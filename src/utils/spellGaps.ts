import type { Spell } from '@/types/spell'

export const MIN_EFFECT_LENGTH = 80

export function needsMoreText(spell: Spell): boolean {
  return (spell.effect ?? '').trim().length < MIN_EFFECT_LENGTH
}

export function needsImage(spell: Spell): boolean {
  return !spell.image
}

export function needsFandomEnrichment(spell: Spell): boolean {
  return needsMoreText(spell) || needsImage(spell)
}
