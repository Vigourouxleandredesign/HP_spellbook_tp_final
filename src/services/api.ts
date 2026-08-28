import type {
  JsonApiListResponse,
  JsonApiResource,
  PotterDbSpellAttributes,
} from '@/types/api'
import type { Spell } from '@/types/spell'

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'https://api.potterdb.com/v1'

export const SPELLS_PAGE_SIZE = 100

export class ApiError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function mapSpellResource(
  resource: JsonApiResource<PotterDbSpellAttributes>,
): Spell {
  const { attributes } = resource

  return {
    slug: attributes.slug,
    name: attributes.name,
    incantation: attributes.incantation,
    category: attributes.category,
    effect: attributes.effect,
    light: attributes.light,
    hand: attributes.hand,
    image: attributes.image,
  }
}

export async function fetchSpellsPage(page: number): Promise<{
  spells: Spell[]
  lastPage: number
}> {
  const url = new URL(`${API_BASE_URL}/spells`)
  url.searchParams.set('page[size]', String(SPELLS_PAGE_SIZE))
  url.searchParams.set('page[number]', String(page))

  const response = await fetch(url)

  if (!response.ok) {
    throw new ApiError(
      `Impossible de charger les sorts (page ${page}).`,
      response.status,
    )
  }

  const json = (await response.json()) as JsonApiListResponse<PotterDbSpellAttributes>
  const lastPage = json.meta?.pagination?.last ?? page

  return {
    spells: json.data.map(mapSpellResource),
    lastPage,
  }
}

export async function fetchAllSpells(): Promise<Spell[]> {
  const allSpells: Spell[] = []
  let page = 1
  let lastPage = 1

  do {
    const result = await fetchSpellsPage(page)
    allSpells.push(...result.spells)
    lastPage = result.lastPage
    page += 1
  } while (page <= lastPage)

  return allSpells
}
