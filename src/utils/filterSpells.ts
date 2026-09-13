import type { Spell } from '@/types/spell'

export const SEARCH_RESULT_LIMIT = 8

function normalize(value: string | null | undefined): string {
  return (value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function filterSpells(spells: Spell[], query: string): Spell[] {
  const needle = normalize(query.trim())
  if (!needle) return []

  return spells.filter((spell) => {
    const haystack = [
      spell.name,
      spell.nameEn,
      spell.nameFr,
      spell.incantation,
      spell.category,
      spell.categoryEn,
      spell.categoryFr,
      spell.slug,
    ]
      .map(normalize)
      .join(' ')

    return haystack.includes(needle)
  })
}
