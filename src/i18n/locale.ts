export type Locale = 'fr' | 'en'

export const LOCALES: Locale[] = ['fr', 'en']

export const DEFAULT_LOCALE: Locale = 'fr'

export const LOCALE_STORAGE_KEY = 'hp-spellbook-locale'

export function isLocale(value: string | null): value is Locale {
  return value === 'fr' || value === 'en'
}
