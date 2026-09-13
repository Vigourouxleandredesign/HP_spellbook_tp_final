import { useEffect, type RefObject } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { Group } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { SceneCameraSettings } from '@/config/scene'
import {
  applyOrbitLimits,
  fitPerspectiveCameraToObject,
} from '@/scenes/spellbook/fitBookCamera'

interface BookCameraRigProps {
  bookRef: RefObject<Group | null>
  controlsRef: RefObject<OrbitControlsImpl | null>
  cameraSettings: SceneCameraSettings
  fitKey: number
}

export function BookCameraRig({
  bookRef,
  controlsRef,
  cameraSettings,
  fitKey,
}: BookCameraRigProps) {
  const { camera, size } = useThree()
  const settingsKey = JSON.stringify(cameraSettings)

  useEffect(() => {
    const book = bookRef.current
    const controls = controlsRef.current
    if (!book || !controls) return

    const fit = fitPerspectiveCameraToObject(
      camera as THREE.PerspectiveCamera,
      book,
      cameraSettings,
    )

    if (!fit) return

    applyOrbitLimits(controls, fit, cameraSettings)
  }, [
    bookRef,
    camera,
    cameraSettings,
    controlsRef,
    fitKey,
    settingsKey,
    size.height,
    size.width,
  ])

  return null
}
