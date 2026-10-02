import { colors } from '@/styles/tokens/colors'
import spellbookModel from '@assets/spellbook_lowpoly_v2.glb?url'
import { desktopCameraDefaults } from '@/config/camera'

export {
  cameraForViewport,
  MOBILE_CAMERA_QUERY,
  type SceneCameraSettings,
} from '@/config/camera'

export const sceneDefaults = {
  lights: {
    ambientIntensity: 0.35,
    ambientColor: colors.parchment,
    keyIntensity: 1.2,
    keyColor: colors.accent,
    keyPosition: [3, 4, 2] as [number, number, number],
    fillIntensity: 0.4,
    fillColor: colors.parchment,
    fillPosition: [-2, 1, -1] as [number, number, number],
  },
  bloom: {
    intensity: 0.45,
    luminanceThreshold: 0.85,
    luminanceSmoothing: 0.025,
    mipmapBlur: true,
  },
  camera: desktopCameraDefaults,
} as const

export type SceneLightSettings = {
  ambientIntensity: number
  ambientColor: string
  keyIntensity: number
  keyColor: string
  keyPosition: [number, number, number]
  fillIntensity: number
  fillColor: string
  fillPosition: [number, number, number]
}

export type SceneBloomSettings = {
  intensity: number
  luminanceThreshold: number
  luminanceSmoothing: number
  mipmapBlur: boolean
}

/** URL Vite — source unique : Assets/spellbook_lowpoly_v2.glb */
export const MODEL_PATH = spellbookModel
