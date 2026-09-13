import { DEFAULT_SPELL_SLUG, type Spell } from '@/types/spell'

function normalizeKey(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function findSpellIndex(spells: Spell[], slug?: string): number {
  if (!slug || spells.length === 0) return -1

  const exact = spells.findIndex((spell) => spell.slug === slug)
  if (exact >= 0) return exact

  const needle = normalizeKey(slug)
  if (!needle) return -1

  return spells.findIndex((spell) => {
    if (normalizeKey(spell.slug) === needle) return true
    if (normalizeKey(spell.name) === needle) return true
    if (normalizeKey(spell.nameEn) === needle) return true
    if (normalizeKey(spell.nameFr) === needle) return true
    return normalizeKey(spell.incantation ?? '') === needle
  })
}

export function resolvePageIndex(spells: Spell[], slug?: string): number {
  if (spells.length === 0) return 0

  const fromUrl = findSpellIndex(spells, slug)
  if (fromUrl >= 0) return fromUrl

  const fallback = findSpellIndex(spells, DEFAULT_SPELL_SLUG)
  return fallback >= 0 ? fallback : 0
}
