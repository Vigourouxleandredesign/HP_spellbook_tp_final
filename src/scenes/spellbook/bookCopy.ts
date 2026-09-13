import type { Messages } from '@/i18n/messages'

export interface BookPageCopy {
  spellLabel: string
  effectLabel: string
  incantationLabel: string
  gestureLabel: string
  discoverGesture: string
  loadingLeft: string
  loadingRight: string
  lightLabel: string
}

export function bookCopyFromMessages(t: Messages): BookPageCopy {
  return {
    spellLabel: t.bookSpell,
    effectLabel: t.bookEffect,
    incantationLabel: t.bookIncantation,
    gestureLabel: t.bookGesture,
    discoverGesture: t.bookDiscover,
    loadingLeft: t.bookLoadingLeft,
    loadingRight: t.bookLoadingRight,
    lightLabel: t.bookLight,
  }
}
