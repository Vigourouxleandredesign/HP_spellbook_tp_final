import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { SkeletonUtils } from 'three-stdlib'
import { MODEL_PATH, sceneDefaults } from '@/config/scene'
import { bookAnimationBridge } from '@/scenes/spellbook/bookAnimationBridge'
import { SpellSpread } from '@/scenes/spellbook/SpellSpread'
import { useBookAnimations } from '@/scenes/spellbook/useBookAnimations'
import type { BookPageCopy } from '@/scenes/spellbook/bookCopy'
import type { Locale } from '@/i18n/locale'
import type { Spell } from '@/types/spell'

interface SpellbookModelProps {
  onModelReady?: () => void
  modelRotationY?: number
  spell: Spell
  isLoading: boolean
  copy: BookPageCopy
  locale: Locale
  canGoPrevious: boolean
  canGoNext: boolean
  onTurnPrevious: () => void
  onTurnNext: () => void
}

export const SpellbookModel = forwardRef<THREE.Group, SpellbookModelProps>(
  function SpellbookModel(
    {
      onModelReady,
      modelRotationY = sceneDefaults.camera.modelRotationY,
      spell,
      isLoading,
      copy,
      locale,
      canGoPrevious,
      canGoNext,
      onTurnPrevious,
      onTurnNext,
    },
    ref,
  ) {
    const wrapperRef = useRef<THREE.Group>(null)
    const modelRef = useRef<THREE.Object3D>(null)
    const { scene } = useGLTF(MODEL_PATH)
    const clone = useMemo(() => {
      const copied = SkeletonUtils.clone(scene)
      copied.traverse((node) => {
        if (node instanceof THREE.SkinnedMesh) {
          node.frustumCulled = false
        }
      })
      return copied
    }, [scene])
    const hasFittedRef = useRef(false)

    useImperativeHandle(ref, () => wrapperRef.current as THREE.Group)

    const { play, isAnimating, isReady, clips } = useBookAnimations(modelRef)

    useEffect(() => {
      bookAnimationBridge.setState({ play, isReady, isAnimating })
    }, [play, isReady, isAnimating])

    useEffect(() => {
      return () => {
        bookAnimationBridge.setState({
          play: null,
          isReady: false,
          isAnimating: false,
        })
      }
    }, [])

    useEffect(() => {
      if (import.meta.env.DEV) {
        console.info('[Spellbook] lowpoly —', clips.source.name, {
          sourceDuration: `${clips.source.duration.toFixed(2)}s`,
          pageTurn: `${clips.pageTurn.duration.toFixed(2)}s`,
          tracks: clips.pageTurn.tracks.map(
            (track) =>
              `${track.name} (${track.times.length} kf, t0=${track.times[0]?.toFixed(3) ?? '?'})`,
          ),
          ready: isReady,
        })
      }
    }, [clips, isReady])

    useEffect(() => {
      if (!isReady || hasFittedRef.current) return
      hasFittedRef.current = true
      requestAnimationFrame(() => {
        onModelReady?.()
      })
    }, [isReady, onModelReady])

    return (
      <group ref={wrapperRef} rotation={[0, modelRotationY, 0]}>
        <primitive ref={modelRef} object={clone} />
        <SpellSpread
          spell={spell}
          isLoading={isLoading}
          isAnimating={isAnimating}
          copy={copy}
          locale={locale}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          onTurnPrevious={onTurnPrevious}
          onTurnNext={onTurnNext}
        />
      </group>
    )
  },
)

useGLTF.preload(MODEL_PATH)
