export interface LocalizedText {
  en: string
  fr: string
}

export interface SpellI18nEntry {
  name: LocalizedText
  category: LocalizedText
  effect: LocalizedText
  hand: LocalizedText | null
  light: LocalizedText | null
}

export interface SpellI18nFile {
  generatedAt: string | null
  spells: Record<string, SpellI18nEntry>
}
