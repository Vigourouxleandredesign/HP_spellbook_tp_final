import * as THREE from 'three'
import type { SceneCameraSettings } from '@/config/scene'

export interface CameraFitResult {
  center: THREE.Vector3
  distance: number
  maxDim: number
}

export function fitPerspectiveCameraToObject(
  camera: THREE.PerspectiveCamera,
  object: THREE.Object3D,
  settings: SceneCameraSettings,
): CameraFitResult | null {
  object.updateMatrixWorld(true)

  const box = new THREE.Box3().setFromObject(object)
  if (box.isEmpty()) return null

  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z)

  camera.fov = settings.fov
  const fovRad = (camera.fov * Math.PI) / 180
  const distance =
    (maxDim / 2 / Math.tan(fovRad / 2)) * settings.fitMargin

  camera.position.set(
    center.x + settings.offsetX,
    center.y + maxDim * settings.fitElevation + settings.offsetY,
    center.z + distance + settings.offsetZ,
  )
  camera.near = Math.max(distance / 100, 0.001)
  camera.far = Math.max(distance * 100, 10)
  camera.lookAt(
    center.x,
    center.y + settings.targetOffsetY,
    center.z,
  )
  camera.updateProjectionMatrix()

  return { center, distance, maxDim }
}

export function applyOrbitLimits(
  controls: {
    target: THREE.Vector3
    minDistance: number
    maxDistance: number
    minPolarAngle: number
    maxPolarAngle: number
    update: () => void
  },
  fit: CameraFitResult,
  settings: SceneCameraSettings,
): void {
  controls.target.set(
    fit.center.x,
    fit.center.y + settings.targetOffsetY,
    fit.center.z,
  )
  controls.minDistance = fit.distance * settings.minDistanceScale
  controls.maxDistance = fit.distance * settings.maxDistanceScale
  controls.minPolarAngle = (settings.minPolarDeg * Math.PI) / 180
  controls.maxPolarAngle = (settings.maxPolarDeg * Math.PI) / 180
  controls.update()
}
