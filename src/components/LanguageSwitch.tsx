import { useT, useLocale } from '@/context/LocaleContext'
import type { Locale } from '@/i18n/locale'
import styles from './Layout.module.css'

export function LanguageSwitch() {
  const { locale, setLocale } = useLocale()
  const t = useT()

  return (
    <div className={styles.langSwitch} role="group" aria-label={t.langSwitch}>
      {(['fr', 'en'] as const).map((code: Locale) => (
        <button
          key={code}
          type="button"
          className={`${styles.langButton} ${locale === code ? styles.langButtonActive : ''}`}
          aria-pressed={locale === code}
          onClick={() => setLocale(code)}
        >
          {code === 'fr' ? t.langFr : t.langEn}
        </button>
      ))}
    </div>
  )
}
