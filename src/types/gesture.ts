import type { LocalizedText } from '@/types/i18n'

export type GestureKind =
  | 'swishFlick'
  | 'pullToward'
  | 'pushAway'
  | 'jab'
  | 'downwardSlash'
  | 'spiral'
  | 'shield'
  | 'upwardLift'
  | 'downwardSmash'
  | 'circleReveal'
  | 'freeze'
  | 'burst'
  | 'waveHorizontal'
  | 'tap'
  | 'mend'
  | 'twist'
  | 'wash'
  | 'point'
  | 'wave'
  | 'slash'
  | 'circle'
  | 'flick'
  | 'arc'
  | 'wristCircle'

export interface WandGestureSource {
  title: string
  kind: 'book' | 'film' | 'book-film' | 'hogwarts-legacy'
  url?: string
}

export interface WandGestureEntry {
  kind: GestureKind
  hand: LocalizedText
  source: WandGestureSource
}

export interface WandGestureFile {
  generatedAt: string | null
  spells: Record<string, WandGestureEntry>
}
