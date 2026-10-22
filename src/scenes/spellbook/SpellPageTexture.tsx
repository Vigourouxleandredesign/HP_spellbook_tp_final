import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Spell } from '@/types/spell'
import { pageLayout } from '@/scenes/spellbook/pageLayout'
import {
  drawLeftPage,
  drawRightPage,
} from '@/scenes/spellbook/drawSpellPage'
import type { BookPageCopy } from '@/scenes/spellbook/bookCopy'
import type { Locale } from '@/i18n/locale'

interface SpellPageTextureProps {
  side: 'left' | 'right'
  spell: Spell
  isLoading: boolean
  copy: BookPageCopy
  locale: Locale
  gestureRevealed?: boolean
}

interface LoadedImage {
  src: string
  image: HTMLImageElement | null
}

const INK_DURATION = 1.35

function createPageCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = pageLayout.textureWidth
  canvas.height = pageLayout.textureHeight
  return canvas
}

function easeOutCubic(value: number): number {
  return 1 - (1 - value) ** 3
}

/** Texture canvas d'une page, à placer dans un matériau (`attach="map"`). */
export function SpellPageTexture({
  side,
  spell,
  isLoading,
  copy,
  locale,
  gestureRevealed = false,
}: SpellPageTextureProps) {
  const [canvas] = useState(createPageCanvas)
  const textureRef = useRef<THREE.CanvasTexture>(null)
  const [loaded, setLoaded] = useState<LoadedImage | null>(null)
  const elapsedRef = useRef(0)
  const progressRef = useRef(0)

  const imageSrc = side === 'right' && !isLoading ? spell.image : null
  const image = imageSrc && loaded?.src === imageSrc ? loaded.image : null

  useEffect(() => {
    if (!imageSrc) return

    let cancelled = false
    const next = new Image()
    next.crossOrigin = 'anonymous'
    next.onload = () => {
      if (!cancelled) setLoaded({ src: imageSrc, image: next })
    }
    next.onerror = () => {
      if (!cancelled) setLoaded({ src: imageSrc, image: null })
    }
    next.src = imageSrc

    return () => {
      cancelled = true
    }
  }, [imageSrc])

  useEffect(() => {
    elapsedRef.current = 0
    progressRef.current = 0
  }, [copy, gestureRevealed, locale, side, spell.slug])

  useEffect(() => {
    const texture = textureRef.current
    if (side !== 'right' || progressRef.current < 1 || !texture) return
    const context = canvas.getContext('2d', { alpha: true })
    if (!context) return
    drawRightPage(context, spell, isLoading, image, copy, gestureRevealed, 1)
    texture.needsUpdate = true
  }, [canvas, copy, gestureRevealed, image, isLoading, side, spell])

  useFrame((_, delta) => {
    const texture = textureRef.current
    if (!texture) return

    const delay = side === 'right' ? 0.2 : 0
    elapsedRef.current += Math.min(delta, 0.05)
    const raw = Math.min(
      Math.max((elapsedRef.current - delay) / INK_DURATION, 0),
      1,
    )
    const progress = easeOutCubic(raw)
    if (progress === progressRef.current && progress >= 1) return
    progressRef.current = progress

    const context = canvas.getContext('2d', { alpha: true })
    if (!context) return

    if (side === 'left') {
      drawLeftPage(context, spell, isLoading, copy, progress)
    } else {
      drawRightPage(
        context,
        spell,
        isLoading,
        image,
        copy,
        gestureRevealed,
        progress,
      )
    }

    texture.needsUpdate = true
  })

  return (
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
  )
}
