import { colors } from '@/styles/tokens/colors'
import spellbookModel from '@assets/spellbook_lowpoly_v2.glb?url'

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
  camera: {
    fov: 42,
    fitMargin: 0.5,
    fitElevation: 0.85,
    offsetX: 0,
    offsetY: 0,
    offsetZ: 0,
    targetOffsetY: -0.28,
    minPolarDeg: 31,
    maxPolarDeg: 88,
    minDistanceScale: 0.7,
    maxDistanceScale: 2.55,
    modelRotationY: 0,
  },
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

export type SceneCameraSettings = {
  fov: number
  fitMargin: number
  fitElevation: number
  offsetX: number
  offsetY: number
  offsetZ: number
  targetOffsetY: number
  minPolarDeg: number
  maxPolarDeg: number
  minDistanceScale: number
  maxDistanceScale: number
  modelRotationY: number
}

/** Viewport étroit : le fit serre trop le livre, on recule d’au moins 2×. */
export const MOBILE_CAMERA_QUERY = '(max-width: 768px)'

export function cameraForViewport(
  settings: SceneCameraSettings,
  isMobile: boolean,
): SceneCameraSettings {
  if (!isMobile) return settings

  return {
    ...settings,
    fov: Math.max(settings.fov, 56),
    fitMargin: settings.fitMargin * 2,
    fitElevation: settings.fitElevation * 1.1,
    maxDistanceScale: Math.max(settings.maxDistanceScale, 3.4),
  }
}

/** URL Vite — source unique : Assets/spellbook_lowpoly_v2.glb */
export const MODEL_PATH = spellbookModel
