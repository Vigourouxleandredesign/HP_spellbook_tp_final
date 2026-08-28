import type { ReactNode } from 'react'
import styles from './Layout.module.css'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Harry Potter</p>
        <h1 className={styles.title}>Livre des sorts</h1>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
