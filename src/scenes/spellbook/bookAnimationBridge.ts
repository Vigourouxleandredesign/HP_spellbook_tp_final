import type { BookAnimationId } from '@/config/bookAnimations'

export type BookPlayFn = (
  id: BookAnimationId,
  options?: { onComplete?: () => void },
) => boolean

type BridgeListener = () => void
const listeners = new Set<BridgeListener>()

function notifyListeners(): void {
  listeners.forEach((listener) => listener())
}

export const bookAnimationBridge = {
  play: null as BookPlayFn | null,
  isReady: false,
  isAnimating: false,

  subscribe(listener: BridgeListener): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },

  setState(partial: {
    play?: BookPlayFn | null
    isReady?: boolean
    isAnimating?: boolean
  }): void {
    if ('play' in partial) bookAnimationBridge.play = partial.play ?? null
    if ('isReady' in partial) bookAnimationBridge.isReady = partial.isReady ?? false
    if ('isAnimating' in partial) {
      bookAnimationBridge.isAnimating = partial.isAnimating ?? false
    }
    notifyListeners()
  },
}
