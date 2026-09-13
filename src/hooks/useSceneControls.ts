import { button, useControls } from 'leva'
import { sceneDefaults } from '@/config/scene'
import type {
  SceneBloomSettings,
  SceneCameraSettings,
  SceneLightSettings,
} from '@/config/scene'
import { bookAnimationBridge } from '@/scenes/spellbook/bookAnimationBridge'

interface UseSceneControlsOptions {
  onRefitCamera?: () => void
}

export function useSceneControls(options: UseSceneControlsOptions = {}) {
  const lights = useControls(
    'Lights',
    {
      ambientIntensity: {
        value: sceneDefaults.lights.ambientIntensity,
        min: 0,
        max: 2,
        step: 0.05,
      },
      ambientColor: sceneDefaults.lights.ambientColor,
      keyIntensity: {
        value: sceneDefaults.lights.keyIntensity,
        min: 0,
        max: 3,
        step: 0.05,
      },
      keyColor: sceneDefaults.lights.keyColor,
      keyPosition: {
        value: sceneDefaults.lights.keyPosition,
        step: 0.1,
      },
      fillIntensity: {
        value: sceneDefaults.lights.fillIntensity,
        min: 0,
        max: 2,
        step: 0.05,
      },
      fillColor: sceneDefaults.lights.fillColor,
      fillPosition: {
        value: sceneDefaults.lights.fillPosition,
        step: 0.1,
      },
    },
    { collapsed: false },
  ) as SceneLightSettings

  const camera = useControls(
    'Camera',
    {
      fov: {
        value: sceneDefaults.camera.fov,
        min: 20,
        max: 80,
        step: 1,
      },
      fitMargin: {
        value: sceneDefaults.camera.fitMargin,
        min: 0.5,
        max: 3,
        step: 0.05,
      },
      fitElevation: {
        value: sceneDefaults.camera.fitElevation,
        min: 0,
        max: 2,
        step: 0.05,
      },
      offsetX: {
        value: sceneDefaults.camera.offsetX,
        min: -2,
        max: 2,
        step: 0.01,
      },
      offsetY: {
        value: sceneDefaults.camera.offsetY,
        min: -2,
        max: 2,
        step: 0.01,
      },
      offsetZ: {
        value: sceneDefaults.camera.offsetZ,
        min: -2,
        max: 2,
        step: 0.01,
      },
      targetOffsetY: {
        value: sceneDefaults.camera.targetOffsetY,
        min: -1.5,
        max: 1.5,
        step: 0.01,
      },
      minPolarDeg: {
        value: sceneDefaults.camera.minPolarDeg,
        min: 0,
        max: 90,
        step: 1,
      },
      maxPolarDeg: {
        value: sceneDefaults.camera.maxPolarDeg,
        min: 45,
        max: 180,
        step: 1,
      },
      minDistanceScale: {
        value: sceneDefaults.camera.minDistanceScale,
        min: 0.3,
        max: 1.5,
        step: 0.05,
      },
      maxDistanceScale: {
        value: sceneDefaults.camera.maxDistanceScale,
        min: 1,
        max: 5,
        step: 0.05,
      },
      modelRotationY: {
        value: sceneDefaults.camera.modelRotationY,
        min: 0,
        max: Math.PI * 2,
        step: 0.01,
      },
      'Refit camera': button(() => {
        options.onRefitCamera?.()
      }),
    },
    { collapsed: false },
  ) as SceneCameraSettings

  const bloom = useControls(
    'Bloom',
    {
      intensity: {
        value: sceneDefaults.bloom.intensity,
        min: 0,
        max: 2,
        step: 0.01,
      },
      luminanceThreshold: {
        value: sceneDefaults.bloom.luminanceThreshold,
        min: 0,
        max: 1,
        step: 0.01,
      },
      luminanceSmoothing: {
        value: sceneDefaults.bloom.luminanceSmoothing,
        min: 0,
        max: 1,
        step: 0.001,
      },
      mipmapBlur: sceneDefaults.bloom.mipmapBlur,
    },
    { collapsed: true },
  ) as SceneBloomSettings

  useControls(
    'Spellbook',
    {
      'Page suivante': button(() => {
        const ok = bookAnimationBridge.play?.('pageForward')
        if (!ok) {
          console.warn('[Spellbook] Leva — page suivante impossible', {
            ready: bookAnimationBridge.isReady,
            hasPlay: Boolean(bookAnimationBridge.play),
          })
        }
      }),
      'Page précédente': button(() => {
        const ok = bookAnimationBridge.play?.('pageBackward')
        if (!ok) {
          console.warn('[Spellbook] Leva — page précédente impossible', {
            ready: bookAnimationBridge.isReady,
            hasPlay: Boolean(bookAnimationBridge.play),
          })
        }
      }),
    },
    { collapsed: false },
  )

  return { lights, camera, bloom }
}

export function useSceneControlsFallback() {
  return {
    lights: sceneDefaults.lights,
    camera: sceneDefaults.camera,
    bloom: sceneDefaults.bloom,
  }
}
