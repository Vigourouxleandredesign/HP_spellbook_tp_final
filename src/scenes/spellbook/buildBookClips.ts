import * as THREE from 'three'
import {
  BOOK_FPS,
  SOURCE_CLIP_NAME,
  bookAnimationFrames,
} from '@/config/bookAnimations'

export interface BookClips {
  source: THREE.AnimationClip
  pageTurn: THREE.AnimationClip
}

/** Décale les keyframes pour qu'ils commencent à t=0 (export Blender décalé). */
function shiftClipToStart(
  clip: THREE.AnimationClip,
  outputName: string,
): THREE.AnimationClip {
  let minTime = Infinity

  for (const track of clip.tracks) {
    if (track.times.length > 0) {
      minTime = Math.min(minTime, track.times[0])
    }
  }

  if (!Number.isFinite(minTime) || minTime < 0.001) {
    const clone = clip.clone()
    clone.name = outputName
    return clone
  }

  const tracks = clip.tracks.map((track) => {
    const times = Float32Array.from(track.times, (time) => time - minTime)
    const TrackCtor = track.constructor as typeof THREE.KeyframeTrack
    return new TrackCtor(track.name, times, track.values.slice())
  })

  const duration = Math.max(
    0,
    ...tracks.flatMap((track) => Array.from(track.times)),
  )

  return new THREE.AnimationClip(outputName, duration, tracks)
}

function quaternionMotionScore(clip: THREE.AnimationClip): number {
  let score = 0

  for (const track of clip.tracks) {
    if (!track.name.endsWith('.quaternion') || track.times.length < 10) {
      continue
    }

    const span = track.times[track.times.length - 1] - track.times[0]
    if (span > 1) {
      score += track.times.length
    }
  }

  return score
}

export function buildBookClips(animations: THREE.AnimationClip[]): BookClips {
  const ranked = [...animations].sort(
    (a, b) => quaternionMotionScore(b) - quaternionMotionScore(a),
  )
  const source =
    animations.find((clip) => clip.name === SOURCE_CLIP_NAME) ??
    ranked.find((clip) => quaternionMotionScore(clip) > 0) ??
    animations.find((clip) => clip.duration > 0.1) ??
    animations[0]

  if (!source) {
    throw new Error('spellbook_lowpoly_v2.glb : aucune animation trouvée.')
  }

  const { pageTurn } = bookAnimationFrames

  const subclip = THREE.AnimationUtils.subclip(
    source,
    'pageTurn',
    pageTurn.start,
    pageTurn.end,
    BOOK_FPS,
  )

  return {
    source,
    pageTurn: shiftClipToStart(subclip, 'pageTurn'),
  }
}

export function getBookClipList(clips: BookClips): THREE.AnimationClip[] {
  return [clips.pageTurn]
}
