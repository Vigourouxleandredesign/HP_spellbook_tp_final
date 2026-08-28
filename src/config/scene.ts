import { colors } from '@/styles/tokens/colors'

export const sceneDefaults = {
  lights: {
    ambientIntensity: 0.35,
    ambientColor: colors.parchment,
    keyIntensity: 1.2,
    keyColor: colors.accent,
    fillIntensity: 0.4,
    fillColor: colors.parchment,
  },
  bloom: {
    intensity: 0.45,
    luminanceThreshold: 0.85,
    luminanceSmoothing: 0.025,
    mipmapBlur: true,
  },
  camera: {
    fov: 45,
    position: [0, 0.5, 4] as [number, number, number],
  },
} as const

export const MODEL_PATH = '/models/Spellbook.glb'
