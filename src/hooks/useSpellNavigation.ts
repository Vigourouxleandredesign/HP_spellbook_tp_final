import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSpellContext } from '@/context/SpellContext'
import { useBookAnimationBridge } from '@/hooks/useBookAnimationBridge'
import { bookAnimationBridge } from '@/scenes/spellbook/bookAnimationBridge'

export function useSpellNavigation() {
  const { currentPageIndex, spells } = useSpellContext()
  const { play, isReady, isAnimating } = useBookAnimationBridge()
  const navigate = useNavigate()

  const total = spells.length
  const canNavigate = total > 1 && !isAnimating

  const goToIndex = useCallback(
    (index: number, direction: 'pageForward' | 'pageBackward') => {
      if (index < 0 || index >= total) return

      const apply = () => {
        const slug = spells[index]?.slug
        if (slug) {
          navigate(`/spell/${slug}`)
        }
      }

      if (isAnimating || bookAnimationBridge.isAnimating) return

      if (!play) {
        apply()
        return
      }

      const started = play(direction, { onComplete: apply })
      if (!started) {
        if (isReady) return
        apply()
      }
    },
    [isAnimating, isReady, navigate, play, spells, total],
  )

  const goPrevious = useCallback(() => {
    if (!canNavigate) return
    const index = currentPageIndex === 0 ? total - 1 : currentPageIndex - 1
    goToIndex(index, 'pageBackward')
  }, [canNavigate, currentPageIndex, goToIndex, total])

  const goNext = useCallback(() => {
    if (!canNavigate) return
    const index = currentPageIndex === total - 1 ? 0 : currentPageIndex + 1
    goToIndex(index, 'pageForward')
  }, [canNavigate, currentPageIndex, goToIndex, total])

  const goToSpell = useCallback(
    (slug: string) => {
      const index = spells.findIndex((spell) => spell.slug === slug)
      if (index < 0 || index === currentPageIndex) return

      const direction =
        index < currentPageIndex ? 'pageBackward' : 'pageForward'
      goToIndex(index, direction)
    },
    [currentPageIndex, goToIndex, spells],
  )

  return {
    goPrevious,
    goNext,
    goToSpell,
    canGoPrevious: canNavigate,
    canGoNext: canNavigate,
    isReady,
    isAnimating,
  }
}

export function useSpellKeyboard(): void {
  const { goPrevious, goNext } = useSpellNavigation()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return
      }

      if (event.key === 'ArrowRight' || event.key === 'PageDown') {
        event.preventDefault()
        goNext()
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault()
        goPrevious()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goNext, goPrevious])
}
