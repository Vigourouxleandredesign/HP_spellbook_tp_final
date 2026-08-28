export const colors = {
  background: '#1a1208',
  surface: '#2c1810',
  parchment: '#f4e8c1',
  ink: '#2c1810',
  inkMuted: '#5c4033',
  accent: '#c9a227',
  accentHover: '#ddb83a',
  border: '#4a3728',
  error: '#c0392b',
  spellLight: {
    white: '#ffffff',
    red: '#e74c3c',
    blue: '#3498db',
    green: '#2ecc71',
    yellow: '#f1c40f',
    purple: '#9b59b6',
  },
} as const

export type ColorToken = typeof colors
