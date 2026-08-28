export interface Spell {
  slug: string
  name: string
  incantation: string | null
  category: string
  effect: string
  light: string | null
  hand: string | null
  image: string | null
}

export const EMPTY_SPELL: Spell = {
  slug: '',
  name: '',
  incantation: null,
  category: '',
  effect: '',
  light: null,
  hand: null,
  image: null,
}
