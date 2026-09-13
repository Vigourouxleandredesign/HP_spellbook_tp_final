import { useEffect, useState } from 'react'
import { MOBILE_CAMERA_QUERY } from '@/config/scene'

export function useNarrowViewport(): boolean {
  const [narrow, setNarrow] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(MOBILE_CAMERA_QUERY).matches
  })

  useEffect(() => {
    const media = window.matchMedia(MOBILE_CAMERA_QUERY)
    const sync = () => setNarrow(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  return narrow
}
