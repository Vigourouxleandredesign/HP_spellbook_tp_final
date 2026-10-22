import { createContext, useContext } from 'react'
import type { Locale } from '@/i18n/locale'
import type { Messages } from '@/i18n/messages'

export interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Messages
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider')
  }
  return context
}

export function useT(): Messages {
  return useLocale().t
}
