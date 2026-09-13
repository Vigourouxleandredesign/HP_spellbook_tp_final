/**
 * Passage unique : pages A–Z de l’Encyclopédie HP → dump local.
 * Usage : npm run enrich:ehp
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const POTTER_API = process.env.VITE_API_URL ?? 'https://api.potterdb.com/v1'
const EHP_BASE = 'https://www.encyclopedie-hp.org/monde-magique/sorts'
const PAGE_SIZE = 100
const DELAY_MS = 250
const MATCH_THRESHOLD = 70
const OUT_FILE = path.resolve('src/data/sources/ehp-raw.json')
const LETTERS = [...'abcdefghijklmnopqrstuvwxyz']
const HEADERS = {
  'User-Agent': 'HPSpellbookStudentProject/0.1 (MIAW educational)',
  Accept: 'text/html',
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function normalize(value) {
  return (value ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function cleanIncantation(value) {
  if (!value) return ''
  return value.replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim()
}

function decodeEntities(text) {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCharCode(Number.parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&nbsp;/gi, ' ')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&')
}

function stripTags(html) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(?:p|li|div|h\d)>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  )
}

async function fetchHtml(url) {
  const response = await fetch(url, { headers: HEADERS })
  if (!response.ok) {
    throw new Error(`${response.status} ${url}`)
  }
  return response.text()
}

async function fetchAllPotterSpells() {
  const spells = []
  let page = 1
  let lastPage = 1

  do {
    const url = new URL(`${POTTER_API}/spells`)
    url.searchParams.set('page[size]', String(PAGE_SIZE))
    url.searchParams.set('page[number]', String(page))
    const response = await fetch(url, {
      headers: { ...HEADERS, Accept: 'application/json' },
    })
    if (!response.ok) throw new Error(`${response.status} Potter DB`)
    const json = await response.json()
    lastPage = json.meta?.pagination?.last ?? page
    for (const resource of json.data ?? []) {
      const attributes = resource.attributes ?? {}
      spells.push({
        slug: attributes.slug,
        name: attributes.name ?? '',
        incantation: attributes.incantation,
        effect: attributes.effect ?? '',
      })
    }
    page += 1
  } while (page <= lastPage)

  return spells
}

function parseEntries(html, pageUrl) {
  const dl = html.match(/<dl class="timeline-list">([\s\S]*?)<\/dl>/i)
  if (!dl) return []

  const entries = []
  const pairRe = /<dt\b([^>]*)>([\s\S]*?)<\/dt>\s*<dd>([\s\S]*?)<\/dd>/gi
  let match

  while ((match = pairRe.exec(dl[1]))) {
    const attrs = match[1]
    const dtHtml = match[2]
    const ddHtml = match[3]
    const id = /id="([^"]+)"/.exec(attrs)?.[1] ?? ''
    const heading = stripTags(dtHtml.replace(/<img[\s\S]*?>/gi, ''))
    const nameEn = /\[([^\]]+)\]/.exec(heading)?.[1]?.trim() ?? ''
    const nameFr = heading
      .replace(/\[[^\]]+\]/g, '')
      .replace(/\([^)]*\)/g, '')
      .replace(/,\s*$/g, '')
      .trim()

    const etymology = stripTags(
      ddHtml.match(
        /<(?:span class="small_notes"|small)[^>]*>([\s\S]*?)<\/(?:span|small)>/i,
      )?.[1] ?? '',
    )

    const effectFromClass = stripTags(
      ddHtml.match(/<span class="section6lowern">([\s\S]*?)<\/span>/i)?.[1] ?? '',
    )
    const paragraphs = [...ddHtml.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
      .map((item) => stripTags(item[1]))
      .filter(Boolean)
    const effect =
      effectFromClass ||
      paragraphs.find((paragraph) => paragraph !== etymology && paragraph.length >= 20) ||
      paragraphs.find((paragraph) => paragraph !== etymology) ||
      ''

    const examples = [...ddHtml.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)]
      .map((item) => stripTags(item[1]))
      .filter(Boolean)

    const dedicatedHref = [
      ...dtHtml.matchAll(
        /href="(https?:\/\/(?:www\.)?encyclopedie-hp\.org\/monde-magique\/sorts\/[^"#]+)"/gi,
      ),
    ]
      .map((item) => item[1].replace(/\/?$/, '/'))
      .find((href) => !/\/sorts\/[a-z]\/$/i.test(href))

    entries.push({
      id,
      heading,
      nameFr,
      nameEn,
      etymology,
      effect,
      examples,
      dedicatedUrl: dedicatedHref ?? null,
      sourceUrl: dedicatedHref ?? `${pageUrl}#${id}`,
    })
  }

  return entries
}

function scoreMatch(spell, entry) {
  const queries = [
    normalize(spell.name),
    normalize(cleanIncantation(spell.incantation)),
    normalize(spell.slug.replace(/-/g, ' ')),
  ].filter((query) => query.length >= 3)

  const targets = [
    normalize(entry.nameEn),
    normalize(entry.nameFr),
    normalize(entry.heading),
    normalize((entry.id ?? '').replace(/-/g, ' ')),
  ].filter(Boolean)

  let best = 0
  for (const query of queries) {
    for (const target of targets) {
      if (target === query) {
        best = Math.max(best, 100)
        continue
      }
      if (target.startsWith(`anti ${query}`) || query.startsWith(`anti ${target}`)) {
        continue
      }
      if (query.length >= 4 && target.includes(query)) {
        best = Math.max(best, 80)
      }
      if (target.length >= 4 && query.includes(target) && target.length / query.length >= 0.7) {
        best = Math.max(best, 72)
      }
    }
  }
  return best
}

function assignMatches(spells, entries) {
  const ranked = []
  for (const entry of entries) {
    for (const spell of spells) {
      const score = scoreMatch(spell, entry)
      if (score >= MATCH_THRESHOLD) {
        ranked.push({ spell, entry, score })
      }
    }
  }

  ranked.sort((left, right) => right.score - left.score)
  const usedSlugs = new Set()
  const usedEntries = new Set()
  const bySlug = {}

  for (const row of ranked) {
    const key = row.entry.id || row.entry.heading
    if (usedSlugs.has(row.spell.slug) || usedEntries.has(key)) continue
    usedSlugs.add(row.spell.slug)
    usedEntries.add(key)
    bySlug[row.spell.slug] = {
      ...row.entry,
      potterSlug: row.spell.slug,
      matchScore: row.score,
    }
  }

  return bySlug
}

async function main() {
  console.log('Potter DB…')
  const spells = await fetchAllPotterSpells()
  console.log(`${spells.length} sorts Potter`)

  const catalog = []
  for (const letter of LETTERS) {
    const url = `${EHP_BASE}/${letter}/`
    try {
      const html = await fetchHtml(url)
      const entries = parseEntries(html, url)
      catalog.push(...entries)
      console.log(`lettre ${letter} · ${entries.length} fiches`)
    } catch (error) {
      console.warn(`lettre ${letter} — ${error.message}`)
    }
    await sleep(DELAY_MS)
  }

  console.log(`${catalog.length} fiches EHP`)
  const matched = assignMatches(spells, catalog)

  for (const [slug, entry] of Object.entries(matched)) {
    if (!entry.dedicatedUrl) continue
    try {
      const html = await fetchHtml(entry.dedicatedUrl)
      await sleep(DELAY_MS)
      const extra = parseEntries(html, entry.dedicatedUrl)[0]
      if (extra?.effect && extra.effect.length > (entry.effect ?? '').length) {
        matched[slug] = {
          ...entry,
          ...extra,
          potterSlug: slug,
          matchScore: entry.matchScore,
          sourceUrl: extra.sourceUrl || entry.sourceUrl,
        }
        console.log(`${slug} ← fiche dédiée ${entry.dedicatedUrl}`)
      }
    } catch (error) {
      console.warn(`${slug} — ${error.message}`)
    }
  }

  await mkdir(path.dirname(OUT_FILE), { recursive: true })
  const file = {
    generatedAt: new Date().toISOString(),
    source: EHP_BASE,
    unmatched: catalog.length - Object.keys(matched).length,
    entries: matched,
  }
  await writeFile(OUT_FILE, `${JSON.stringify(file, null, 2)}\n`, 'utf8')
  console.log(
    `OK ${Object.keys(matched).length} matchs · ${file.unmatched} EHP hors liste → ${OUT_FILE}`,
  )
}

await main()
