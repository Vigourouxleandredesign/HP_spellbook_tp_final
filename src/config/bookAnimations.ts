/** spellbook_lowpoly_v2.glb — clip `ArmatureAction.001` (bones) @ 24 fps */
export const BOOK_FPS = 24

export const SOURCE_CLIP_NAME = 'ArmatureAction.001'

/** Suivant : 80 → 0 · Précédent : 0 → 80 */
export const bookAnimationFrames = {
  pageTurn: { start: 0, end: 80 },
} as const

export type BookAnimationId = 'pageForward' | 'pageBackward'

export const bookAnimationLabels: Record<BookAnimationId, string> = {
  pageForward: 'Page suivante (80→0)',
  pageBackward: 'Page précédente (0→80)',
}
