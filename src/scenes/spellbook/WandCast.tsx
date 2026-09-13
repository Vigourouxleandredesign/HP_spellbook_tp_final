import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { GestureKind } from '@/types/gesture'
import {
  WAND_CAST_SIZE,
  createWandCastState,
  stepWandCast,
} from '@/scenes/spellbook/drawWandCast'

interface WandCastProps {
  handDescription: string
  gestureKind?: GestureKind | null
  visible: boolean
}

export function WandCast({
  handDescription,
  gestureKind,
  visible,
}: WandCastProps) {
  const { canvas, texture, state } = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = WAND_CAST_SIZE.width
    canvas.height = WAND_CAST_SIZE.height
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.generateMipmaps = false
    texture.premultiplyAlpha = false
    return { canvas, texture, state: createWandCastState() }
  }, [])

  const elapsedRef = useRef(0)

  useEffect(() => {
    return () => {
      texture.dispose()
    }
  }, [texture])

  useEffect(() => {
    elapsedRef.current = 0
    state.sparkles.length = 0
    state.spawnCarry = 0
  }, [gestureKind, handDescription, state, visible])

  useFrame((_, delta) => {
    if (!visible) return
    const context = canvas.getContext('2d', { alpha: true })
    if (!context) return

    elapsedRef.current += Math.min(delta, 0.05)
    stepWandCast(
      context,
      handDescription,
      elapsedRef.current,
      delta,
      state,
      gestureKind,
    )
    texture.needsUpdate = true
  })

  return (
    <mesh
      position={[0, 0.92, 0.12]}
      rotation={[-0.62, 0, 0]}
      renderOrder={4}
      raycast={() => null}
    >
      <planeGeometry args={[2.7, 1.52]} />
      <meshBasicMaterial
        map={texture}
        transparent
        alphaTest={0.04}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  )
}
