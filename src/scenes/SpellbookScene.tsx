import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Leva } from 'leva'
import { sceneDefaults, MODEL_PATH } from '@/config/scene'
import { colors } from '@/styles/tokens/colors'
import { SceneLights } from '@/scenes/SceneLights'
import { SceneEffects } from '@/scenes/SceneEffects'
import {
  useSceneControls,
  useSceneControlsFallback,
} from '@/hooks/useSceneControls'
import styles from './SpellbookScene.module.css'

function SpellbookModel() {
  const { scene } = useGLTF(MODEL_PATH)
  return <primitive object={scene} />
}

interface SceneLightSettings {
  ambientIntensity: number
  ambientColor: string
  keyIntensity: number
  keyColor: string
  fillIntensity: number
  fillColor: string
}

interface SceneBloomSettings {
  intensity: number
  luminanceThreshold: number
  luminanceSmoothing: number
  mipmapBlur: boolean
}

function SceneCore({
  lights,
  bloom,
}: {
  lights: SceneLightSettings
  bloom: SceneBloomSettings
}) {
  return (
    <>
      <SceneLights {...lights} />
      <Suspense fallback={null}>
        <SpellbookModel />
      </Suspense>
      <OrbitControls
        enablePan={false}
        minDistance={2}
        maxDistance={8}
        target={[0, 0.2, 0]}
      />
      <SceneEffects {...bloom} />
    </>
  )
}

function DevSceneContent() {
  const controls = useSceneControls()
  return <SceneCore lights={controls.lights} bloom={controls.bloom} />
}

function ProdSceneContent() {
  const controls = useSceneControlsFallback()
  return <SceneCore lights={controls.lights} bloom={controls.bloom} />
}

function SceneContent() {
  return import.meta.env.DEV ? <DevSceneContent /> : <ProdSceneContent />
}

export function SpellbookScene() {
  return (
    <div className={styles.wrapper}>
      {import.meta.env.DEV && <Leva collapsed titleBar={{ title: 'Scene' }} />}
      <Canvas
        className={styles.canvas}
        camera={{
          fov: sceneDefaults.camera.fov,
          position: sceneDefaults.camera.position,
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={[colors.background]} />
        <SceneContent />
      </Canvas>
    </div>
  )
}

useGLTF.preload(MODEL_PATH)
