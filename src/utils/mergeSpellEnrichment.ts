import type { SpellEnrichmentFile, SpellPatch } from '@/types/enrichment'
import type { Spell } from '@/types/spell'
import { needsImage, needsMoreText } from '@/utils/spellGaps'

export function mergeSpellEnrichment(
  spell: Spell,
  patch?: SpellPatch,
): Spell {
  if (!patch) return spell

  const effect =
    needsMoreText(spell) && patch.effect ? patch.effect : spell.effect

  return {
    ...spell,
    effect,
    effectEn:
      needsMoreText(spell) && patch.effect && patch.effect !== patch.effectFr
        ? patch.effect
        : spell.effectEn,
    effectFr: patch.effectFr || spell.effectFr,
    image: needsImage(spell) && patch.image ? patch.image : spell.image,
  }
}

export function mergeSpellList(
  spells: Spell[],
  file: SpellEnrichmentFile,
): Spell[] {
  return spells.map((spell) =>
    mergeSpellEnrichment(spell, file.patches?.[spell.slug]),
  )
}
