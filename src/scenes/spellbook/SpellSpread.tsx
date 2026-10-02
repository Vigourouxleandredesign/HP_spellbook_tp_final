import { useCallback, useEffect, useRef, useState } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import type { Locale } from '@/i18n/locale'
import type { BookPageCopy } from '@/scenes/spellbook/bookCopy'
import type { Spell } from '@/types/spell'
import { gestureSealLocal, pageLayout } from '@/scenes/spellbook/pageLayout'
import {
  PAGE_INK_FADE_IN_MS,
  PAGE_INK_FADE_OUT_MS,
  pageInkBridge,
} from '@/scenes/spellbook/pageInkBridge'
import { useSpellPageTexture } from '@/scenes/spellbook/useSpellPageTexture'
import { WandCast } from '@/scenes/spellbook/WandCast'

interface SpellSpreadProps {
  spell: Spell
  isLoading: boolean
  isAnimating: boolean
  copy: BookPageCopy
  locale: Locale
  canGoPrevious: boolean
  canGoNext: boolean
  onTurnPrevious: () => void
  onTurnNext: () => void
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
}

function usePageInkFade(isAnimating: boolean, spellSlug: string): number {
  const [opacity, setOpacity] = useState(1)
  const opacityRef = useRef(1)
  const frameRef = useRef(0)

  const animateTo = useCallback((target: number, duration: number) => {
    cancelAnimationFrame(frameRef.current)
    const start = opacityRef.current
    if (Math.abs(start - target) < 0.01) {
      opacityRef.current = target
      setOpacity(target)
      return Promise.resolve()
    }

    const startedAt = performance.now()
    return new Promise<void>((resolve) => {
      const tick = (now: number) => {
        const t = Math.min(1, (now - startedAt) / duration)
        const value = start + (target - start) * easeInOut(t)
        opacityRef.current = value
        setOpacity(value)
        if (t < 1) {
          frameRef.current = requestAnimationFrame(tick)
          return
        }
        opacityRef.current = target
        setOpacity(target)
        resolve()
      }
      frameRef.current = requestAnimationFrame(tick)
    })
  }, [])

  useEffect(() => {
    pageInkBridge.setFadeOut(() => animateTo(0, PAGE_INK_FADE_OUT_MS))
    return () => {
      pageInkBridge.setFadeOut(null)
      cancelAnimationFrame(frameRef.current)
    }
  }, [animateTo])

  useEffect(() => {
    if (isAnimating) return
    if (opacityRef.current >= 0.99) return
    void animateTo(1, PAGE_INK_FADE_IN_MS)
  }, [animateTo, isAnimating, spellSlug])

  return opacity
}

function stopEvent(event: ThreeEvent<MouseEvent>): void {
  event.stopPropagation()
}

function SpellPagePlane({
  side,
  spell,
  isLoading,
  enabled,
  copy,
  locale,
  gestureRevealed,
  inkOpacity,
  onTurn,
}: {
  side: 'left' | 'right'
  spell: Spell
  isLoading: boolean
  enabled: boolean
  copy: BookPageCopy
  locale: Locale
  gestureRevealed: boolean
  inkOpacity: number
  onTurn: () => void
}) {
  const texture = useSpellPageTexture({
    side,
    spell,
    isLoading,
    copy,
    locale,
    gestureRevealed,
  })
  const x = side === 'left' ? pageLayout.leftX : pageLayout.rightX

  return (
    <mesh
      position={[x, pageLayout.liftY, pageLayout.z]}
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerDown={stopEvent}
      onClick={(event) => {
        stopEvent(event)
        if (enabled) onTurn()
      }}
      onPointerOver={() => {
        document.body.style.cursor = enabled ? 'pointer' : 'default'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      <planeGeometry args={[pageLayout.planeWidth, pageLayout.planeHeight]} />
      <meshBasicMaterial
        map={texture}
        color={0xffffff}
        transparent
        opacity={inkOpacity}
        alphaTest={inkOpacity < 0.98 ? 0 : 0.12}
        depthWrite={false}
        toneMapped={false}
        polygonOffset
        polygonOffsetFactor={-1}
      />
    </mesh>
  )
}

function GestureSealButton({
  visible,
  onReveal,
}: {
  visible: boolean
  onReveal: () => void
}) {
  const seal = gestureSealLocal()

  if (!visible) return null

  return (
    <group
      position={[pageLayout.rightX, pageLayout.liftY + 0.012, pageLayout.z]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <mesh
        position={[seal.x, seal.y, 0.01]}
        onPointerDown={stopEvent}
        onClick={(event) => {
          stopEvent(event)
          onReveal()
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        <planeGeometry args={[seal.width, seal.height]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}

export function SpellSpread({
  spell,
  isLoading,
  isAnimating,
  copy,
  locale,
  canGoPrevious,
  canGoNext,
  onTurnPrevious,
  onTurnNext,
}: SpellSpreadProps) {
  const [revealedSlug, setRevealedSlug] = useState<string | null>(null)
  const gestureRevealed = Boolean(spell.hand && revealedSlug === spell.slug)
  const inkOpacity = usePageInkFade(isAnimating, spell.slug)
  const inkVisible = inkOpacity > 0.02 || !isAnimating
  const canTurn = !isAnimating && inkOpacity > 0.85

  useEffect(() => {
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [])

  return (
    <group visible={inkVisible}>
      <SpellPagePlane
        side="left"
        spell={spell}
        isLoading={isLoading}
        enabled={canGoPrevious && canTurn}
        copy={copy}
        locale={locale}
        gestureRevealed={false}
        inkOpacity={inkOpacity}
        onTurn={onTurnPrevious}
      />
      <SpellPagePlane
        side="right"
        spell={spell}
        isLoading={isLoading}
        enabled={canGoNext && canTurn}
        copy={copy}
        locale={locale}
        gestureRevealed={gestureRevealed}
        inkOpacity={inkOpacity}
        onTurn={onTurnNext}
      />
      <GestureSealButton
        visible={
          Boolean(spell.hand) && !gestureRevealed && !isLoading && canTurn
        }
        onReveal={() => setRevealedSlug(spell.slug)}
      />
      {spell.hand && gestureRevealed && (
        <WandCast
          key={spell.slug}
          handDescription={spell.hand}
          gestureKind={spell.gestureKind}
          visible={!isAnimating && !isLoading && inkOpacity > 0.4}
        />
      )}
    </group>
  )
}
