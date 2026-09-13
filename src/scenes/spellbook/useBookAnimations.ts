import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { MODEL_PATH } from '@/config/scene'
import type { BookAnimationId } from '@/config/bookAnimations'
import { bookAnimationBridge } from '@/scenes/spellbook/bookAnimationBridge'
import {
  buildBookClips,
  getBookClipList,
} from '@/scenes/spellbook/buildBookClips'

interface PlayOptions {
  onComplete?: () => void
}

export interface UseBookAnimationsResult {
  play: (id: BookAnimationId, options?: PlayOptions) => boolean
  isAnimating: boolean
  isReady: boolean
  clips: ReturnType<typeof buildBookClips>
}

export function useBookAnimations(
  modelRef: RefObject<THREE.Object3D | null>,
): UseBookAnimationsResult {
  const { animations } = useGLTF(MODEL_PATH)
  const clips = useMemo(() => buildBookClips(animations), [animations])
  const clipList = useMemo(() => getBookClipList(clips), [clips])
  const { actions, mixer } = useAnimations(clipList, modelRef)
  const [isAnimating, setIsAnimating] = useState(false)
  const pageTurnRef = useRef<THREE.AnimationAction | null>(null)
  const mixerRef = useRef(mixer)
  const activeActionRef = useRef<THREE.AnimationAction | null>(null)
  const onCompleteRef = useRef<(() => void) | undefined>(undefined)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const settledRef = useRef(true)
  const generationRef = useRef(0)
  const finishedListenerRef = useRef<
    ((event: { action?: THREE.AnimationAction }) => void) | null
  >(null)

  const isReady = Boolean(actions.pageTurn)

  useEffect(() => {
    pageTurnRef.current = actions.pageTurn ?? null
    mixerRef.current = mixer
  }, [actions.pageTurn, mixer])

  const clearFinishTimeout = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const resetPose = useCallback(() => {
    const action = pageTurnRef.current
    const currentMixer = mixerRef.current
    if (!action) return

    action.reset()
    action.enabled = true
    action.paused = true
    action.time = 0
    action.play()
    action.paused = true
    currentMixer.update(0)
  }, [])

  const stopActiveAction = useCallback(() => {
    clearFinishTimeout()
    if (finishedListenerRef.current) {
      mixerRef.current.removeEventListener(
        'finished',
        finishedListenerRef.current as never,
      )
      finishedListenerRef.current = null
    }
    if (activeActionRef.current) {
      activeActionRef.current.stop()
      activeActionRef.current = null
    }
  }, [clearFinishTimeout])

  const settlePlayback = useCallback(() => {
    if (settledRef.current) return
    settledRef.current = true
    clearFinishTimeout()
    resetPose()
    activeActionRef.current = null
    onCompleteRef.current?.()
    onCompleteRef.current = undefined
    setIsAnimating(false)
    bookAnimationBridge.setState({ isAnimating: false })
  }, [clearFinishTimeout, resetPose])

  const play = useCallback(
    (id: BookAnimationId, options?: PlayOptions): boolean => {
      const action = pageTurnRef.current
      const currentMixer = mixerRef.current

      if (!action) {
        console.warn('[Spellbook] Action pageTurn introuvable — mixer pas prêt')
        return false
      }

      if (activeActionRef.current) {
        return false
      }

      stopActiveAction()
      generationRef.current += 1
      const generation = generationRef.current
      settledRef.current = false
      onCompleteRef.current = options?.onComplete
      bookAnimationBridge.setState({ isAnimating: true })

      action.reset()
      action.setLoop(THREE.LoopOnce, 1)
      action.clampWhenFinished = true
      action.enabled = true
      action.paused = false

      if (id === 'pageForward') {
        action.timeScale = -1
        action.time = action.getClip().duration
      } else {
        action.timeScale = 1
        action.time = 0
      }

      const onFinished = (event: { action?: THREE.AnimationAction }) => {
        if (event.action !== action || generation !== generationRef.current) {
          return
        }
        currentMixer.removeEventListener('finished', onFinished as never)
        finishedListenerRef.current = null
        settlePlayback()
      }

      finishedListenerRef.current = onFinished
      currentMixer.addEventListener('finished', onFinished as never)
      action.play()
      activeActionRef.current = action
      setIsAnimating(true)

      const durationMs =
        (action.getClip().duration / Math.max(Math.abs(action.timeScale), 0.001)) *
          1000 +
        80
      timeoutRef.current = setTimeout(() => {
        if (generation !== generationRef.current) return
        settlePlayback()
      }, durationMs)

      if (import.meta.env.DEV) {
        console.info('[Spellbook] play', id, {
          duration: action.getClip().duration.toFixed(3),
          timeScale: action.timeScale,
        })
      }

      return true
    },
    [settlePlayback, stopActiveAction],
  )

  useEffect(() => {
    if (!isReady) return
    resetPose()
  }, [isReady, resetPose])

  useEffect(() => {
    return () => {
      stopActiveAction()
    }
  }, [stopActiveAction])

  return { play, isAnimating, isReady, clips }
}
