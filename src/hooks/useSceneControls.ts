import { useControls } from 'leva'
import { sceneDefaults } from '@/config/scene'

export function useSceneControls() {
  const lights = useControls('Lights', {
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
    fillIntensity: {
      value: sceneDefaults.lights.fillIntensity,
      min: 0,
      max: 2,
      step: 0.05,
    },
    fillColor: sceneDefaults.lights.fillColor,
  })

  const bloom = useControls('Bloom', {
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
  })

  return { lights, bloom }
}

export function useSceneControlsFallback() {
  return {
    lights: sceneDefaults.lights,
    bloom: sceneDefaults.bloom,
  }
}
