import type { ReactNode } from 'react'
import { LanguageSwitch } from '@/components/LanguageSwitch'
import { useT } from '@/context/LocaleContext'
import styles from './Layout.module.css'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const t = useT()

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <LanguageSwitch />
        <p className={styles.eyebrow}>{t.siteEyebrow}</p>
        <h1 className={styles.title}>{t.siteTitle}</h1>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
