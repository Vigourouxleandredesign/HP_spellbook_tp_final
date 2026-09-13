import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Leva } from 'leva'
import type { Group } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { cameraForViewport, sceneDefaults } from '@/config/scene'
import type {
  SceneBloomSettings,
  SceneCameraSettings,
  SceneLightSettings,
} from '@/config/scene'
import { SceneLights } from '@/scenes/SceneLights'
import { SceneEffects } from '@/scenes/SceneEffects'
import { SpellbookModel } from '@/scenes/spellbook/SpellbookModel'
import { BookCameraRig } from '@/scenes/spellbook/BookCameraRig'
import {
  useSceneControls,
  useSceneControlsFallback,
} from '@/hooks/useSceneControls'
import { useLocale } from '@/context/LocaleContext'
import { useSpellContext } from '@/context/SpellContext'
import { useNarrowViewport } from '@/hooks/useNarrowViewport'
import { useSpellNavigation } from '@/hooks/useSpellNavigation'
import { bookCopyFromMessages } from '@/scenes/spellbook/bookCopy'
import type { BookPageCopy } from '@/scenes/spellbook/bookCopy'
import type { Locale } from '@/i18n/locale'
import type { Spell } from '@/types/spell'
import styles from './SpellbookScene.module.css'

interface SceneCoreProps {
  lights: SceneLightSettings
  bloom: SceneBloomSettings
  camera: SceneCameraSettings
  fitKey: number
  onModelReady: () => void
  spell: Spell
  isLoading: boolean
  copy: BookPageCopy
  locale: Locale
  canGoPrevious: boolean
  canGoNext: boolean
  onTurnPrevious: () => void
  onTurnNext: () => void
  isMobile: boolean
}

function SceneCore({
  lights,
  bloom,
  camera,
  fitKey,
  onModelReady,
  spell,
  isLoading,
  copy,
  locale,
  canGoPrevious,
  canGoNext,
  onTurnPrevious,
  onTurnNext,
  isMobile,
}: SceneCoreProps) {
  const viewportCamera = useMemo(
    () => cameraForViewport(camera, isMobile),
    [camera, isMobile],
  )
  const bookRef = useRef<Group>(null)
  const controlsRef = useRef<OrbitControlsImpl>(null)

  return (
    <>
      <SceneLights {...lights} />
      <Suspense fallback={null}>
        <SpellbookModel
          ref={bookRef}
          modelRotationY={viewportCamera.modelRotationY}
          onModelReady={onModelReady}
          spell={spell}
          isLoading={isLoading}
          copy={copy}
          locale={locale}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          onTurnPrevious={onTurnPrevious}
          onTurnNext={onTurnNext}
        />
      </Suspense>
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
      />
      <BookCameraRig
        bookRef={bookRef}
        controlsRef={controlsRef}
        cameraSettings={viewportCamera}
        fitKey={fitKey}
      />
      <SceneEffects {...bloom} />
    </>
  )
}

type BookSceneProps = Pick<
  SceneCoreProps,
  | 'spell'
  | 'isLoading'
  | 'copy'
  | 'locale'
  | 'canGoPrevious'
  | 'canGoNext'
  | 'onTurnPrevious'
  | 'onTurnNext'
  | 'isMobile'
>

function DevSceneContent(props: BookSceneProps) {
  const [fitKey, setFitKey] = useState(0)
  const { lights, bloom, camera } = useSceneControls({
    onRefitCamera: () => setFitKey((key) => key + 1),
  })

  useEffect(() => {
    setFitKey((key) => key + 1)
  }, [props.isMobile])

  const handleModelReady = useCallback(() => {
    setFitKey((key) => key + 1)
  }, [])

  return (
    <SceneCore
      lights={lights}
      bloom={bloom}
      camera={camera}
      fitKey={fitKey}
      onModelReady={handleModelReady}
      {...props}
    />
  )
}

function ProdSceneContent(props: BookSceneProps) {
  const [fitKey, setFitKey] = useState(0)
  const { lights, bloom, camera } = useSceneControlsFallback()

  useEffect(() => {
    setFitKey((key) => key + 1)
  }, [props.isMobile])

  const handleModelReady = useCallback(() => {
    setFitKey((key) => key + 1)
  }, [])

  return (
    <SceneCore
      lights={lights}
      bloom={bloom}
      camera={camera}
      fitKey={fitKey}
      onModelReady={handleModelReady}
      {...props}
    />
  )
}

function SceneContent(props: BookSceneProps) {
  return import.meta.env.DEV ? (
    <DevSceneContent {...props} />
  ) : (
    <ProdSceneContent {...props} />
  )
}

export function SpellbookScene() {
  const { currentSpell, isLoading } = useSpellContext()
  const { locale, t } = useLocale()
  const copy = useMemo(() => bookCopyFromMessages(t), [t])
  const isMobile = useNarrowViewport()
  const startFov = cameraForViewport(sceneDefaults.camera, isMobile).fov
  const { goNext, goPrevious, canGoNext, canGoPrevious } = useSpellNavigation()

  return (
    <div className={styles.wrapper}>
      {import.meta.env.DEV && (
        <Leva collapsed={false} titleBar={{ title: 'Scene' }} />
      )}
      <Canvas
        className={styles.canvas}
        gl={{ alpha: true }}
        camera={{
          fov: startFov,
          near: 0.01,
          far: 200,
        }}
        dpr={[1, 2]}
      >
        <SceneContent
          spell={currentSpell}
          isLoading={isLoading}
          copy={copy}
          locale={locale}
          isMobile={isMobile}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          onTurnPrevious={goPrevious}
          onTurnNext={goNext}
        />
      </Canvas>
    </div>
  )
}
