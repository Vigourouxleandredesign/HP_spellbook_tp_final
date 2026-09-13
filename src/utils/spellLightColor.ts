import { colors } from '@/styles/tokens/colors'

const aliases: Record<string, keyof typeof colors.spellLight> = {
  gold: 'yellow',
  scarlet: 'red',
  crimson: 'red',
  azure: 'blue',
  violet: 'purple',
}

export function spellLightColor(light: string | null): string {
  if (!light) return colors.accent

  const key = light.trim().toLowerCase()
  if (key in colors.spellLight) {
    return colors.spellLight[key as keyof typeof colors.spellLight]
  }

  const aliased = aliases[key]
  return aliased ? colors.spellLight[aliased] : colors.accent
}
