import { colors } from '@/styles/tokens/colors'

const cssVarMap = {
  background: '--color-background',
  surface: '--color-surface',
  parchment: '--color-parchment',
  ink: '--color-ink',
  inkMuted: '--color-ink-muted',
  accent: '--color-accent',
  accentHover: '--color-accent-hover',
  border: '--color-border',
  error: '--color-error',
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
}
