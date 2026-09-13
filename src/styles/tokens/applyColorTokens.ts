import { colors } from '@/styles/tokens/colors'
import libraryTable from '@/assets/hogwarts-library-table.jpg'

const cssVarMap = {
  background: '--color-background',
  surface: '--color-surface',
  parchment: '--color-parchment',
  parchmentMuted: '--color-parchment-muted',
  ink: '--color-ink',
  inkMuted: '--color-ink-muted',
  accent: '--color-accent',
  accentHover: '--color-accent-hover',
  border: '--color-border',
  error: '--color-error',
  glow: '--color-glow',
  wand: '--color-wand',
} as const satisfies Record<keyof Omit<typeof colors, 'spellLight'>, string>

type RootColorKey = keyof typeof cssVarMap

export function applyColorTokens(): void {
  const root = document.documentElement

  for (const key of Object.keys(cssVarMap) as RootColorKey[]) {
    root.style.setProperty(cssVarMap[key], colors[key])
  }

  for (const [name, value] of Object.entries(colors.spellLight)) {
    root.style.setProperty(`--color-spell-light-${name}`, value)
  }

  root.style.setProperty('--bg-library', `url("${libraryTable}")`)
}
