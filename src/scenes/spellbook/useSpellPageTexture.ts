import { useEffect, useMemo, useRef, useState } from 'react'
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

interface UseSpellPageTextureOptions {
  side: 'left' | 'right'
  spell: Spell
  isLoading: boolean
  copy: BookPageCopy
  locale: Locale
  gestureRevealed?: boolean
}

const INK_DURATION = 1.35

function createPageTexture(): {
  canvas: HTMLCanvasElement
  texture: THREE.CanvasTexture
} {
  const canvas = document.createElement('canvas')
  canvas.width = pageLayout.textureWidth
  canvas.height = pageLayout.textureHeight
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = false
  texture.premultiplyAlpha = false
  return { canvas, texture }
}

function easeOutCubic(value: number): number {
  return 1 - (1 - value) ** 3
}

export function useSpellPageTexture({
  side,
  spell,
  isLoading,
  copy,
  locale,
  gestureRevealed = false,
}: UseSpellPageTextureOptions): THREE.CanvasTexture {
  const { canvas, texture } = useMemo(
    createPageTexture,
    [pageLayout.textureHeight, pageLayout.textureWidth],
  )
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const elapsedRef = useRef(0)
  const progressRef = useRef(0)
  const imageRef = useRef<HTMLImageElement | null>(null)
  imageRef.current = image

  useEffect(() => {
    return () => {
      texture.dispose()
    }
  }, [texture])

  useEffect(() => {
    if (side !== 'right' || !spell.image || isLoading) {
      setImage(null)
      return
    }

    let cancelled = false
    const loaded = new Image()
    loaded.crossOrigin = 'anonymous'
    loaded.onload = () => {
      if (!cancelled) setImage(loaded)
    }
    loaded.onerror = () => {
      if (!cancelled) setImage(null)
    }
    loaded.src = spell.image

    return () => {
      cancelled = true
    }
  }, [isLoading, side, spell.image, spell.slug])

  useEffect(() => {
    elapsedRef.current = 0
    progressRef.current = 0
  }, [copy, gestureRevealed, locale, side, spell.slug])

  useEffect(() => {
    if (side !== 'right' || progressRef.current < 1) return
    const context = canvas.getContext('2d', { alpha: true })
    if (!context) return
    drawRightPage(context, spell, isLoading, image, copy, gestureRevealed, 1)
    texture.needsUpdate = true
  }, [canvas, copy, gestureRevealed, image, isLoading, side, spell, texture])

  useFrame((_, delta) => {
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
        imageRef.current,
        copy,
        gestureRevealed,
        progress,
      )
    }

    texture.needsUpdate = true
  })

  return texture
}
