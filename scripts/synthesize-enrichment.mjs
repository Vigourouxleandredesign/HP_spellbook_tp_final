/**
 * Fusion Fandom + EHP → un seul JSON de soutien.
 * Usage : npm run enrich:synthesize
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const POTTER_API = process.env.VITE_API_URL ?? 'https://api.potterdb.com/v1'
const PAGE_SIZE = 100
const MIN_EFFECT_LENGTH = 80
const FANDOM_FILE = path.resolve('src/data/sources/fandom-enrichment.json')
const EHP_FILE = path.resolve('src/data/sources/ehp-raw.json')
const OUT_FILE = path.resolve('src/data/spell-enrichment.json')

async function fetchAllPotterSpells() {
  const spells = []
  let page = 1
  let lastPage = 1

  do {
    const url = new URL(`${POTTER_API}/spells`)
    url.searchParams.set('page[size]', String(PAGE_SIZE))
    url.searchParams.set('page[number]', String(page))
    const response = await fetch(url)
    if (!response.ok) throw new Error(`${response.status} Potter DB`)
    const json = await response.json()
    lastPage = json.meta?.pagination?.last ?? page
    for (const resource of json.data ?? []) {
      const attributes = resource.attributes ?? {}
      spells.push({
        slug: attributes.slug,
        effect: attributes.effect ?? '',
        image: attributes.image ?? null,
      })
    }
    page += 1
  } while (page <= lastPage)

  return spells
}

function readJson(filePath) {
  return readFile(filePath, 'utf8').then((text) => JSON.parse(text))
}

function synthesizePatch(spell, fandom, ehp) {
  const potterEffect = (spell.effect ?? '').trim()
  const fandomEn = (fandom?.effect ?? '').trim()
  const ehpFr = (ehp?.effect ?? '').trim()

  let display = potterEffect
  if (display.length < MIN_EFFECT_LENGTH && fandomEn.length > display.length) {
    display = fandomEn
  }
  if (display.length < MIN_EFFECT_LENGTH && ehpFr.length > display.length) {
    display = ehpFr
  }

  const patch = {}
  if (display && display !== potterEffect) {
    patch.effect = display
  }
  if (ehpFr) {
    patch.effectFr = ehpFr
  }
  if (!spell.image && fandom?.image) {
    patch.image = fandom.image
  }

  const sources = []
  if (fandom?.sourceUrl) {
    sources.push({
      title: fandom.sourceTitle ?? 'Harry Potter Wiki',
      url: fandom.sourceUrl,
      lang: 'en',
    })
  }
  if (ehp?.sourceUrl) {
    sources.push({
      title: ehp.nameFr || ehp.heading || 'Encyclopédie HP',
      url: ehp.sourceUrl,
      lang: 'fr',
    })
  }
  if (sources.length > 0) {
    patch.sources = sources
    patch.sourceTitle = sources[0].title
    patch.sourceUrl = sources[0].url
  }

  if (!patch.effect && !patch.effectFr && !patch.image) return null
  return patch
}

async function main() {
  console.log('Synthèse Fandom + EHP…')
  const [spells, fandomFile, ehpFile] = await Promise.all([
    fetchAllPotterSpells(),
    readJson(FANDOM_FILE),
    readJson(EHP_FILE),
  ])

  const fandomPatches = fandomFile.patches ?? {}
  const ehpEntries = ehpFile.entries ?? {}
  const patches = {}
  let withEffect = 0
  let withFr = 0
  let withImage = 0

  for (const spell of spells) {
    if (!spell.slug) continue
    const patch = synthesizePatch(
      spell,
      fandomPatches[spell.slug],
      ehpEntries[spell.slug],
    )
    if (!patch) continue
    patches[spell.slug] = patch
    if (patch.effect) withEffect += 1
    if (patch.effectFr) withFr += 1
    if (patch.image) withImage += 1
  }

  const file = {
    generatedAt: new Date().toISOString(),
    source: 'https://harrypotter.fandom.com + https://www.encyclopedie-hp.org/monde-magique/sorts/',
    patches,
  }
  await writeFile(OUT_FILE, `${JSON.stringify(file, null, 2)}\n`, 'utf8')
  console.log(
    `OK ${Object.keys(patches).length} patches · ${withEffect} effect · ${withFr} effectFr · ${withImage} images → ${OUT_FILE}`,
  )
}

await main()
