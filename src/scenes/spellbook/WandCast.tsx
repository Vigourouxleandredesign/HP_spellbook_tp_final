import { useEffect, useRef, useState } from 'react'
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

function createWandCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = WAND_CAST_SIZE.width
  canvas.height = WAND_CAST_SIZE.height
  return canvas
}

export function WandCast({
  handDescription,
  gestureKind,
  visible,
}: WandCastProps) {
  const [canvas] = useState(createWandCanvas)
  const textureRef = useRef<THREE.CanvasTexture>(null)
  const stateRef = useRef(createWandCastState())
  const elapsedRef = useRef(0)

  useEffect(() => {
    elapsedRef.current = 0
    stateRef.current = createWandCastState()
  }, [gestureKind, handDescription, visible])

  useFrame((_, delta) => {
    const texture = textureRef.current
    if (!visible || !texture) return
    const context = canvas.getContext('2d', { alpha: true })
    if (!context) return

    elapsedRef.current += Math.min(delta, 0.05)
    stepWandCast(
      context,
      handDescription,
      elapsedRef.current,
      delta,
      stateRef.current,
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
        transparent
        alphaTest={0.04}
        depthWrite={false}
        toneMapped={false}
      >
        <canvasTexture
          ref={textureRef}
          attach="map"
          args={[canvas]}
          colorSpace={THREE.SRGBColorSpace}
          minFilter={THREE.LinearFilter}
          magFilter={THREE.LinearFilter}
          generateMipmaps={false}
          premultiplyAlpha={false}
        />
      </meshBasicMaterial>
    </mesh>
  )
}
