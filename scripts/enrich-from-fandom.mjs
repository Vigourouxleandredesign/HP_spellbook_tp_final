/**
 * Passage unique hors ligne : Potter DB → pages Fandom → JSON local.
 * Aucun appel Fandom au runtime. Relancer : npm run enrich:fandom
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const POTTER_API = process.env.VITE_API_URL ?? 'https://api.potterdb.com/v1'
const FANDOM_API = 'https://harrypotter.fandom.com/api.php'
const PAGE_SIZE = 100
const MIN_EFFECT_LENGTH = 80
const MIN_FANDOM_TEXT = 40
const BATCH_SIZE = 20
const DELAY_MS = 250
const OUT_FILE = path.resolve('src/data/sources/fandom-enrichment.json')
const HEADERS = {
  'User-Agent': 'HPSpellbookStudentProject/0.1 (MIAW educational)',
  Accept: 'application/json',
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function needsMoreText(spell) {
  return (spell.effect ?? '').trim().length < MIN_EFFECT_LENGTH
}

function needsImage(spell) {
  return !spell.image
}

function normalize(value) {
  return value
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

function titleFromWiki(wiki) {
  if (!wiki) return null
  try {
    const url = new URL(wiki)
    const marker = '/wiki/'
    const index = url.pathname.indexOf(marker)
    if (index === -1) return null
    return decodeURIComponent(url.pathname.slice(index + marker.length))
      .replace(/_/g, ' ')
      .split('#')[0]
  } catch {
    return null
  }
}

function removeTemplates(text) {
  let output = ''
  let index = 0

  while (index < text.length) {
    if (text.startsWith('{{', index)) {
      const start = index
      let depth = 1
      index += 2
      while (index < text.length && depth > 0) {
        if (text.startsWith('{{', index)) {
          depth += 1
          index += 2
          continue
        }
        if (text.startsWith('}}', index)) {
          depth -= 1
          index += 2
          continue
        }
        index += 1
      }
      if (depth > 0) {
        output += text.slice(start, start + 2)
        index = start + 2
      } else {
        output += ' '
      }
      continue
    }
    output += text[index]
    index += 1
  }

  return output
}

function wikiToProse(wikitext) {
  let text = wikitext ?? ''
  text = text.replace(/<!--[\s\S]*?-->/g, ' ')
  text = text.replace(/<ref\b[^>]*\/>/gi, '')
  text = text.replace(/<ref\b[^>]*>[\s\S]*?<\/ref>/gi, '')
  text = text.replace(/<\/?[^>]+>/g, ' ')
  text = removeTemplates(text)
  text = text.replace(/\[\[(?:File|Image|Fichier):[^\]]+\]\]/gi, '')
  text = text.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, '$2')
  text = text.replace(/\[\[([^\]]+)\]\]/g, '$1')
  text = text.replace(/\[https?:\/\/\S+\s+([^\]]+)\]/g, '$1')
  text = text.replace(/'{2,}/g, '')
  text = text.replace(/\[\d+\]/g, '')
  text = text.replace(/\s+/g, ' ').trim()

  if (text.length > 900) {
    const cut = text.slice(0, 900)
    const lastSentence = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '))
    text = lastSentence > 200 ? cut.slice(0, lastSentence + 1) : cut.trim()
  }

  return text
}

function resolvePage(query, requestedTitle) {
  const pages = Object.values(query?.pages ?? {})
  const aliases = new Map()

  for (const item of query?.normalized ?? []) {
    aliases.set(item.from, item.to)
  }
  for (const item of query?.redirects ?? []) {
    aliases.set(item.from, item.to)
  }

  let title = requestedTitle
  const seen = new Set()
  while (aliases.has(title) && !seen.has(title)) {
    seen.add(title)
    title = aliases.get(title)
  }

  return (
    pages.find((page) => page.title === title) ??
    pages.find((page) => normalize(page.title) === normalize(requestedTitle)) ??
    null
  )
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: HEADERS })
  const contentType = response.headers.get('content-type') ?? ''
  if (!response.ok || !contentType.includes('json')) {
    throw new Error(`${response.status} ${url}`)
  }
  return response.json()
}

async function fetchAllPotterSpells() {
  const spells = []
  let page = 1
  let lastPage = 1

  do {
    const url = new URL(`${POTTER_API}/spells`)
    url.searchParams.set('page[size]', String(PAGE_SIZE))
    url.searchParams.set('page[number]', String(page))
    const json = await fetchJson(url)
    lastPage = json.meta?.pagination?.last ?? page
    for (const resource of json.data ?? []) {
      const attributes = resource.attributes ?? {}
      spells.push({
        slug: attributes.slug,
        name: attributes.name ?? '',
        incantation: attributes.incantation,
        effect: attributes.effect ?? '',
        image: attributes.image ?? null,
        wiki: attributes.wiki ?? null,
      })
    }
    page += 1
  } while (page <= lastPage)

  return spells
}

async function fetchPages(titles) {
  const url = new URL(FANDOM_API)
  url.searchParams.set('action', 'query')
  url.searchParams.set('prop', 'revisions|pageimages|info')
  url.searchParams.set('rvprop', 'content')
  url.searchParams.set('rvslots', 'main')
  url.searchParams.set('rvsection', '0')
  url.searchParams.set('piprop', 'original')
  url.searchParams.set('inprop', 'url')
  url.searchParams.set('redirects', '1')
  url.searchParams.set('titles', titles.join('|'))
  url.searchParams.set('format', 'json')
  url.searchParams.set('origin', '*')
  return fetchJson(url)
}

async function searchFandom(query) {
  const url = new URL(FANDOM_API)
  url.searchParams.set('action', 'query')
  url.searchParams.set('list', 'search')
  url.searchParams.set('srsearch', query)
  url.searchParams.set('srlimit', '8')
  url.searchParams.set('format', 'json')
  url.searchParams.set('origin', '*')
  const json = await fetchJson(url)
  return json.query?.search ?? []
}

function pickSearchTitle(spell, results) {
  const queries = [spell.name, cleanIncantation(spell.incantation)].filter(Boolean)

  for (const result of results) {
    const title = normalize(result.title)
    if (title.includes('podcast') || title.includes('trading card')) continue

    for (const query of queries) {
      const needle = normalize(query)
      if (!needle) continue
      if (title === needle) return result.title
      if (title.startsWith(`anti ${needle}`) || title.startsWith(`contre ${needle}`)) {
        continue
      }
      if (needle.length >= 4 && title.includes(needle)) return result.title
    }
  }

  return null
}

function patchFromPage(spell, page) {
  if (!page || page.missing !== undefined) return null

  const wikitext = page.revisions?.[0]?.slots?.main?.['*'] ?? ''
  const prose = wikiToProse(wikitext)
  const current = (spell.effect ?? '').trim()
  const patch = {}

  if (
    needsMoreText(spell) &&
    prose.length >= MIN_FANDOM_TEXT &&
    prose.length > current.length
  ) {
    patch.effect = prose
  }
  if (needsImage(spell) && page.original?.source) {
    patch.image = page.original.source
  }
  if (!patch.effect && !patch.image) return null

  patch.sourceTitle = page.title
  patch.sourceUrl =
    page.fullurl ??
    `https://harrypotter.fandom.com/wiki/${encodeURIComponent(page.title)}`
  return patch
}

async function searchFallback(spell) {
  const queries = [...new Set([spell.name, cleanIncantation(spell.incantation)].filter(Boolean))]

  for (const query of queries) {
    const results = await searchFandom(query)
    await sleep(DELAY_MS)
    const title = pickSearchTitle(spell, results)
    if (!title) continue
    const json = await fetchPages([title])
    await sleep(DELAY_MS)
    return patchFromPage(spell, resolvePage(json.query, title))
  }

  return null
}

async function writeEnrichment(patches, generatedAt) {
  const file = {
    generatedAt,
    source: 'https://harrypotter.fandom.com',
    patches,
  }
  await mkdir(path.dirname(OUT_FILE), { recursive: true })
  await writeFile(OUT_FILE, `${JSON.stringify(file, null, 2)}\n`, 'utf8')
}

async function main() {
  console.log('Potter DB…')
  const spells = await fetchAllPotterSpells()
  const targets = spells.filter(
    (spell) => spell.slug && (needsMoreText(spell) || needsImage(spell)),
  )
  console.log(`${spells.length} sorts · ${targets.length} à compléter`)

  const patches = {}
  const generatedAt = new Date().toISOString()
  let filled = 0
  let skipped = 0

  for (let offset = 0; offset < targets.length; offset += BATCH_SIZE) {
    const batch = targets.slice(offset, offset + BATCH_SIZE)
    const titles = batch.map((spell) => titleFromWiki(spell.wiki) ?? spell.name)
    let query

    try {
      query = (await fetchPages(titles)).query
    } catch (error) {
      console.warn(`lot ${offset + 1} — ${error.message}`)
      await sleep(DELAY_MS * 4)
      try {
        query = (await fetchPages(titles)).query
      } catch {
        query = { pages: {} }
      }
    }

    await sleep(DELAY_MS)

    for (const [index, spell] of batch.entries()) {
      const rank = offset + index + 1
      const requested = titles[index]
      let patch = patchFromPage(spell, resolvePage(query, requested))

      if (!patch) {
        try {
          const single = await fetchPages([requested])
          await sleep(DELAY_MS)
          patch = patchFromPage(spell, resolvePage(single.query, requested))
        } catch (error) {
          console.warn(`[${rank}/${targets.length}] ${spell.slug} — ${error.message}`)
        }
      }

      if (!patch) {
        try {
          patch = await searchFallback(spell)
        } catch (error) {
          console.warn(`[${rank}/${targets.length}] ${spell.slug} — ${error.message}`)
        }
      }

      if (patch) {
        patches[spell.slug] = patch
        filled += 1
        console.log(`[${rank}/${targets.length}] ${spell.slug} ← ${patch.sourceTitle}`)
      } else {
        skipped += 1
        console.log(`[${rank}/${targets.length}] ${spell.slug} — rien`)
      }
    }

    await writeEnrichment(patches, generatedAt)
  }

  await writeEnrichment(patches, generatedAt)
  console.log(`OK ${filled} patches · ${skipped} sans match → ${OUT_FILE}`)
}

await main()
