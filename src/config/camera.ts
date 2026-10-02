export const MOBILE_CAMERA_QUERY = '(max-width: 768px)'

/** Cadrage PC — sliders Leva validés (image 1). */
export const desktopCameraDefaults = {
  fov: 42,
  fitMargin: 0.5,
  fitElevation: 1.15,
  offsetX: 0,
  offsetY: -0.21,
  offsetZ: -2,
  targetOffsetY: -0.21,
  minPolarDeg: 14,
  maxPolarDeg: 88,
  minDistanceScale: 0.7,
  maxDistanceScale: 2.55,
  modelRotationY: 0,
} as const

/** Cadrage mobile — sliders Leva validés (image 2). */
export const mobileCameraDefaults = {
  fov: 43,
  fitMargin: 0.55,
  fitElevation: 1,
  offsetX: 0,
  offsetY: -0.8,
  offsetZ: -2,
  targetOffsetY: -0.9,
  minPolarDeg: 0,
  maxPolarDeg: 86,
  minDistanceScale: 0.5,
  maxDistanceScale: 2.55,
  modelRotationY: 0,
} as const

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

export function computeFitDistance(
  maxDim: number,
  fovDeg: number,
  fitMargin: number,
): number {
  const fovRad = (fovDeg * Math.PI) / 180
  return (maxDim / 2 / Math.tan(fovRad / 2)) * fitMargin
}

export function cameraForViewport(
  settings: SceneCameraSettings,
  isMobile: boolean,
): SceneCameraSettings {
  if (!isMobile) return settings
  return { ...mobileCameraDefaults }
}
