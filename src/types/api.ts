export interface JsonApiResource<TAttributes> {
  id: string
  type: string
  attributes: TAttributes
}

export interface JsonApiListResponse<TAttributes> {
  data: JsonApiResource<TAttributes>[]
  meta?: {
    pagination?: {
      current: number
      next: number | null
      last: number
      records: number
    }
  }
}

export interface JsonApiDetailResponse<TAttributes> {
  data: JsonApiResource<TAttributes>
}

export interface PotterDbSpellAttributes {
  slug: string
  name: string
  incantation: string | null
  category: string
  effect: string
  light: string | null
  hand: string | null
  image: string | null
}
