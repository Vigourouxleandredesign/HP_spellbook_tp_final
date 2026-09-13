import { useEffect, useState } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import type { Locale } from '@/i18n/locale'
import type { BookPageCopy } from '@/scenes/spellbook/bookCopy'
import type { Spell } from '@/types/spell'
import { gestureSealLocal, pageLayout } from '@/scenes/spellbook/pageLayout'
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
  onTurn,
}: {
  side: 'left' | 'right'
  spell: Spell
  isLoading: boolean
  enabled: boolean
  copy: BookPageCopy
  locale: Locale
  gestureRevealed: boolean
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
        alphaTest={0.12}
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

  useEffect(() => {
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [])

  return (
    <group visible={!isAnimating}>
      <SpellPagePlane
        side="left"
        spell={spell}
        isLoading={isLoading}
        enabled={canGoPrevious && !isAnimating}
        copy={copy}
        locale={locale}
        gestureRevealed={false}
        onTurn={onTurnPrevious}
      />
      <SpellPagePlane
        side="right"
        spell={spell}
        isLoading={isLoading}
        enabled={canGoNext && !isAnimating}
        copy={copy}
        locale={locale}
        gestureRevealed={gestureRevealed}
        onTurn={onTurnNext}
      />
      <GestureSealButton
        visible={Boolean(spell.hand) && !gestureRevealed && !isLoading}
        onReveal={() => setRevealedSlug(spell.slug)}
      />
      {spell.hand && gestureRevealed && (
        <WandCast
          key={spell.slug}
          handDescription={spell.hand}
          gestureKind={spell.gestureKind}
          visible={!isAnimating && !isLoading}
        />
      )}
    </group>
  )
}
