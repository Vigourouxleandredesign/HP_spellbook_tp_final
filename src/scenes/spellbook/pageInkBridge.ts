export const PAGE_INK_FADE_OUT_MS = 240
export const PAGE_INK_FADE_IN_MS = 320

type FadeFn = () => Promise<void>

let fadeOutHandler: FadeFn | null = null

export const pageInkBridge = {
  setFadeOut(handler: FadeFn | null): void {
    fadeOutHandler = handler
  },
  fadeOut(): Promise<void> {
    return fadeOutHandler?.() ?? Promise.resolve()
  },
}
