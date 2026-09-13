/**
 * Assemble src/data/spell-i18n.json from Potter + enrichment + EHP + overrides.
 * Usage : npm run i18n:spells
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const POTTER_API = process.env.VITE_API_URL ?? 'https://api.potterdb.com/v1'
const PAGE_SIZE = 100
const ENRICH_FILE = path.resolve('src/data/spell-enrichment.json')
const EHP_FILE = path.resolve('src/data/sources/ehp-raw.json')
const TRANSLATIONS_FILE = path.resolve(
  'src/data/sources/spell-i18n-translations.json',
)
const OVERRIDES_FILE = path.resolve('src/data/sources/spell-i18n-overrides.json')
const OUT_FILE = path.resolve('src/data/spell-i18n.json')

const CATEGORY_FR = {
  charm: 'Charme',
  'dark charm': 'Charme obscur',
  curse: 'Maléfice',
  hex: 'Maléfice',
  jinx: 'Jinx',
  spell: 'Sort',
  transfiguration: 'Métamorphose',
  'healing spell': 'Sortilège de guérison',
  'healing charm': 'Charme de guérison',
  conjuration: 'Conjuration',
  vanishment: 'Disparition',
  untransfiguration: 'Démetamorphose',
  'counter-spell': 'Contre-sort',
  'counter spell': 'Contre-sort',
  'counter-charm': 'Contre-charme',
  'counter charm': 'Contre-charme',
  'counter-jinx': 'Contre-jinx',
  'counter jinx': 'Contre-jinx',
  'counter-curse': 'Contre-sortilège',
  'counter curse': 'Contre-sortilège',
  'dark arts': 'Arts sombres',
  transportation: 'Transport',
  transformation: 'Transformation',
}

const LIGHT_FR = {
  white: 'Blanche',
  blue: 'Bleue',
  red: 'Rouge',
  green: 'Verte',
  yellow: 'Jaune',
  purple: 'Violette',
  violet: 'Violette',
  orange: 'Orange',
  gold: 'Dorée',
  golden: 'Dorée',
  silver: 'Argentée',
  pink: 'Rose',
  scarlet: 'Écarlate',
  turquoise: 'Turquoise',
  crimson: 'Cramoisie',
  none: 'Aucune',
  transparent: 'Transparente',
  'icy blue': 'Bleu glacier',
  'bright blue': 'Bleu vif',
  'bright yellow': 'Jaune vif',
  'bright green': 'Vert vif',
  'dark green': 'Vert sombre',
  'dark red': 'Rouge sombre',
  'pale blue': 'Bleu pâle',
  'pale green': 'Vert pâle',
  'pale yellow': 'Jaune pâle',
  'blueish-white': 'Blanc bleuté',
  'blue-white': 'Blanc bleuté',
  'multi-coloured': 'Multicolore',
  multicoloured: 'Multicolore',
  'various colours': 'Diverses couleurs',
  fire: 'Feu',
  black: 'Noire',
  brown: 'Brune',
  grey: 'Grise',
  gray: 'Grise',
  invisible: 'Invisible',
}

const HAND_FR = {
  wave: 'Ondulation',
  'wave wand': 'Onduler la baguette',
  'wave wand around': 'Onduler la baguette autour de soi',
  'wave wand four times': 'Onduler la baguette quatre fois',
  'waving wand above head': 'Onduler la baguette au-dessus de la tête',
  'brandish wand': 'Brandir la baguette',
  'casual flick of wand': 'Léger fouetté de baguette',
  'diagonal down-right, up, diagonal down-right':
    'Diagonale bas-droite, haut, puis diagonale bas-droite',
  'direct at target': 'Diriger vers la cible',
  'downward slash': 'Entaille descendante',
  'downwards slash': 'Entaille descendante',
  'downwards, palm of opposite hand held outward':
    'Mouvement descendant, paume de l’autre main tournée vers l’extérieur',
  'draw in midair': 'Dessiner en l’air',
  'flick wand': 'Fouetter de la baguette',
  'flick wand at target': 'Fouetter la baguette vers la cible',
  'flick wanddraw wand backflick again':
    'Fouetter la baguette, la ramener, puis fouetter de nouveau',
  'forwards slash': 'Entaille vers l’avant',
  'hold tip of wand to targeted wand':
    'Tenir la pointe de la baguette contre celle de la cible',
  'hold wand aloft or wave (when animating multiple things)':
    'Lever la baguette ou l’onduler (pour animer plusieurs objets)',
  'hold wand flat in hand': 'Tenir la baguette à plat dans la main',
  'hold wand to the left': 'Tenir la baguette vers la gauche',
  'jerk wand upwards': 'Dresser brusquement la baguette',
  'move in a triangular gesture': 'Tracer un triangle',
  'move wand over object': 'Passer la baguette au-dessus de l’objet',
  'overhead circles': 'Cercles au-dessus de la tête',
  'overhead wave': 'Ondulation au-dessus de la tête',
  'place wand between hands': 'Placer la baguette entre les mains',
  "place wand tip over caster's heart":
    'Poser la pointe de la baguette sur le cœur du lanceur',
  'point skyward': 'Pointer vers le ciel',
  'point wand': 'Pointer la baguette',
  'point wand at chest': 'Pointer la baguette vers la poitrine',
  'point wand at sky': 'Pointer la baguette vers le ciel',
  'point wand at target': 'Pointer la baguette vers la cible',
  'point wand at victim': 'Pointer la baguette vers la victime',
  'point wand skyward': 'Pointer la baguette vers le ciel',
  'point wand to the place where the spell is desired to hit':
    'Pointer la baguette vers l’endroit visé',
  'raise wand': 'Lever la baguette',
  'rap smartly': 'Tapoter d’un coup net',
  slash: 'Entaille',
  'slash wand': 'Entailler de la baguette',
  'slash wand at target': 'Entailler de la baguette vers la cible',
  'slashing movement': 'Mouvement d’entaille',
  'slide wand across ground and point':
    'Glisser la baguette au sol puis pointer',
  'tap glasses': 'Tapoter les lunettes',
  'tap target with wand': 'Tapoter la cible de la baguette',
  'tap the target': 'Tapoter la cible',
  'tap twice on boat with wand': 'Tapoter deux fois le bateau de la baguette',
  'trace wand over wounds or': 'Passer la baguette sur les plaies',
  'turn on the spot': 'Pivoter sur place',
  'upwards swish then downward flick':
    'Fouetté ascendant puis claquement descendant',
  'v-shape': 'En forme de V',
  point: 'Pointer',
  'swish and flick': 'Un coup de baguette vif',
  circular: 'Mouvement circulaire',
  circle: 'Cercle',
  jab: 'Piqué',
  tap: 'Tapoter',
  'tap wand': 'Tapoter de la baguette',
  flick: 'Fouetté',
  sweep: 'Balayage',
  thrust: 'Estocade',
  downward: 'Mouvement descendant',
  upward: 'Mouvement ascendant',
  'upward slash': 'Entaille ascendante',
  'point at target': 'Pointer la cible',
  'point at victim': 'Pointer la victime',
  'point at object': 'Pointer l’objet',
  none: 'Aucun',
}

function readJson(filePath) {
  return readFile(filePath, 'utf8').then((text) => JSON.parse(text))
}

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
        name: attributes.name ?? '',
        category: attributes.category ?? '',
        effect: attributes.effect ?? '',
        light: attributes.light ?? null,
        hand: attributes.hand ?? null,
      })
    }
    page += 1
  } while (page <= lastPage)

  return spells
}

function cleanText(value) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .replace(/\s([.!?])/g, '$1')
    .trim()
}

function looksFrench(text) {
  return /[àâäéèêëïîôùûüçœ]/i.test(text) ||
    /\b(le|la|les|un|une|des|du|de|et|qui|que|sortilège|charme|maléfice|baguette)\b/i.test(
      text,
    )
}

function translateCategory(en) {
  if (!en) return ''
  return en
    .split(/[,/]/)
    .map((part) => {
      const key = part.trim().toLowerCase()
      return CATEGORY_FR[key] ?? part.trim()
    })
    .filter(Boolean)
    .join(', ')
}

function translateLight(en) {
  if (!en) return null
  const key = en.trim().toLowerCase()
  if (LIGHT_FR[key]) return LIGHT_FR[key]

  const entries = Object.entries(LIGHT_FR).sort((a, b) => b[0].length - a[0].length)
  let translated = en
  for (const [english, french] of entries) {
    translated = translated.replace(new RegExp(`\\b${english}\\b`, 'ig'), french)
  }
  return translated.replace(/\bor\b/gi, 'ou')
}

function translateHand(en) {
  if (!en) return null
  const key = en.trim().toLowerCase()
  if (HAND_FR[key]) return HAND_FR[key]
  return (
    key
      .replace(/\bwand\b/g, 'baguette')
      .replace(/\bpoint\b/g, 'pointer')
      .replace(/\bwave\b/g, 'onduler')
      .replace(/\bflick\b/g, 'fouetter')
      .replace(/\bslash\b/g, 'entailler')
      .replace(/\btap\b/g, 'tapoter')
      .replace(/\bcircle\b/g, 'cercle')
      .replace(/\btarget\b/g, 'cible')
      .replace(/\bvictim\b/g, 'victime')
      .replace(/\bobject\b/g, 'objet')
  )
}

function frenchNameFromEhp(ehp) {
  if (!ehp) return ''
  const heading = cleanText(ehp.heading ?? '')
  const quoted = heading.match(/[«"]([^»"]+)[»"]/)
  if (quoted?.[1] && /[àâäéèêëïîôùûüçœ]|sortilège|charme|maléfice/i.test(quoted[1])) {
    return cleanText(quoted[1])
  }

  const withoutEn = heading
    .replace(/\[[^\]]*]/g, ' ')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const inverted = withoutEn.match(
    /^(.+?),\s*(sortilège|charme|maléfice|jinx)\s+(d'|de |du |des |d’)/i,
  )
  if (inverted) {
    const noun = inverted[2]
    const prep = inverted[3].replace('d’', "d'")
    const head = inverted[1].trim()
    return `${noun[0].toUpperCase()}${noun.slice(1)} ${prep}${head}`
  }

  if (
    withoutEn &&
    /sortilège|charme|maléfice|jinx|métamorphose/i.test(withoutEn) &&
    withoutEn.length > 3
  ) {
    return withoutEn
  }

  const nameFr = cleanText(ehp.nameFr ?? '')
  if (
    nameFr &&
    /[àâäéèêëïîôùûüçœ]|sortilège|charme|maléfice/i.test(nameFr) &&
    nameFr.length > 3
  ) {
    return nameFr.replace(/\s+\)+$/g, '').trim()
  }

  return ''
}

function mergePair(left, right) {
  const a = cleanText(left)
  const b = cleanText(right)
  return {
    en: a || b,
    fr: b || a,
  }
}

function applyOverride(base, override) {
  if (!override) return base
  const next = { ...base }
  for (const key of ['name', 'category', 'effect', 'hand', 'light']) {
    if (!override[key]) continue
    if (override[key] === null) {
      next[key] = null
      continue
    }
    next[key] = {
      en: cleanText(override[key].en) || next[key]?.en || '',
      fr: cleanText(override[key].fr) || next[key]?.fr || '',
    }
  }
  return next
}

async function main() {
  console.log('Assemblage spell-i18n…')
  const [spells, enrichment, ehpFile, translations, overrides] =
    await Promise.all([
      fetchAllPotterSpells(),
      readJson(ENRICH_FILE),
      readJson(EHP_FILE),
      readJson(TRANSLATIONS_FILE).catch(() => ({})),
      readJson(OVERRIDES_FILE).catch(() => ({})),
    ])

  const patches = enrichment.patches ?? {}
  const ehpEntries = ehpFile.entries ?? {}
  const translationOverlay = translations.spells ?? translations
  const overlay = overrides.spells ?? overrides
  const out = {}
  let missingFr = 0
  let missingEn = 0

  for (const spell of spells) {
    if (!spell.slug) continue
    const patch = patches[spell.slug] ?? {}
    const ehp = ehpEntries[spell.slug]
    const potterEn = cleanText(spell.effect)
    const enrichEn = cleanText(patch.effect)
    const enrichFr = cleanText(patch.effectFr)
    const ehpFr = cleanText(ehp?.effect)

    let effectEn = potterEn
    if (enrichEn && enrichEn !== enrichFr && enrichEn.length > effectEn.length) {
      effectEn = enrichEn
    }
    if (!effectEn && enrichEn && !looksFrench(enrichEn)) effectEn = enrichEn

    let effectFr = enrichFr || ehpFr
    if (!effectFr && enrichEn && looksFrench(enrichEn)) effectFr = enrichEn

    const nameFr = frenchNameFromEhp(ehp)
    const categoryEn = cleanText(spell.category)
    const lightEn = cleanText(spell.light)
    const handEn = cleanText(spell.hand)

    const entry = applyOverride(
      applyOverride(
        {
          name: mergePair(cleanText(spell.name), nameFr),
          category: {
            en: categoryEn,
            fr: translateCategory(categoryEn) || categoryEn,
          },
          effect: mergePair(effectEn, effectFr),
          hand: handEn
            ? { en: handEn, fr: translateHand(handEn) || handEn }
            : null,
          light: lightEn
            ? { en: lightEn, fr: translateLight(lightEn) || lightEn }
            : null,
        },
        translationOverlay[spell.slug],
      ),
      overlay[spell.slug],
    )

    if (!cleanText(entry.effect.fr)) missingFr += 1
    if (!cleanText(entry.effect.en)) missingEn += 1
    out[spell.slug] = entry
  }

  const file = {
    generatedAt: new Date().toISOString(),
    source: 'Potter DB + spell-enrichment + ehp-raw + spell-i18n-overrides',
    spells: out,
  }

  await writeFile(OUT_FILE, `${JSON.stringify(file, null, 2)}\n`, 'utf8')
  console.log(
    `${Object.keys(out).length} sorts → ${path.relative(process.cwd(), OUT_FILE)}`,
  )
  console.log(`effets FR manquants : ${missingFr} · EN manquants : ${missingEn}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
