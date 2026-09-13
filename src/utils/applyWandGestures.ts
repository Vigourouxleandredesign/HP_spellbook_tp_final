import type { WandGestureFile } from '@/types/gesture'
import type { Spell } from '@/types/spell'

export function applyWandGestures(
  spells: Spell[],
  file: WandGestureFile,
): Spell[] {
  return spells.map((spell) => {
    const entry = file.spells[spell.slug]
    if (!entry) return spell

    return {
      ...spell,
      gestureKind: entry.kind,
      handEn: entry.hand.en,
      handFr: entry.hand.fr,
      hand: entry.hand.fr,
    }
  })
}
