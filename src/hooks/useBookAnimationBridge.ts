import { useEffect, useState } from 'react'
import { bookAnimationBridge } from '@/scenes/spellbook/bookAnimationBridge'

export function useBookAnimationBridge() {
  const [, setTick] = useState(0)

  useEffect(() => bookAnimationBridge.subscribe(() => setTick((n) => n + 1)), [])

  return {
    play: bookAnimationBridge.play,
    isReady: bookAnimationBridge.isReady,
    isAnimating: bookAnimationBridge.isAnimating,
  }
}
