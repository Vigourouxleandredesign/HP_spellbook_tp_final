import type { GestureKind } from '@/types/gesture'

export interface Spell {
  slug: string
  name: string
  nameEn: string
  nameFr: string
  incantation: string | null
  category: string
  categoryEn: string
  categoryFr: string
  effect: string
  effectEn: string
  effectFr: string
  light: string | null
  lightEn: string | null
  lightFr: string | null
  hand: string | null
  handEn: string | null
  handFr: string | null
  gestureKind: GestureKind | null
  image: string | null
}

export const DEFAULT_SPELL_SLUG = 'unlocking-charm'

export const EMPTY_SPELL: Spell = {
  slug: '',
  name: '',
  nameEn: '',
  nameFr: '',
  incantation: null,
  category: '',
  categoryEn: '',
  categoryFr: '',
  effect: '',
  effectEn: '',
  effectFr: '',
  light: null,
  lightEn: null,
  lightFr: null,
  hand: null,
  handEn: null,
  handFr: null,
  gestureKind: null,
  image: null,
}
