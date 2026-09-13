import { useLocale, useT } from '@/context/LocaleContext'
import styles from './About.module.css'

export function About() {
  const t = useT()
  const { locale } = useLocale()
  const potterDbHref =
    locale === 'fr' ? 'https://docs.potterdb.com/fr' : 'https://docs.potterdb.com'

  return (
    <section className={styles.about} id="about">
      <h2 className={styles.title}>{t.aboutTitle}</h2>
      <p className={styles.text}>{t.aboutP1}</p>
      <p className={styles.text}>{t.aboutP2}</p>
      <p className={styles.text}>{t.aboutP3}</p>
      <p className={styles.sources}>
        {t.aboutSourcesBefore}
        <a href={potterDbHref} target="_blank" rel="noreferrer" className={styles.link}>
          Potter DB
        </a>
        {t.aboutSourcesMid}
        <a
          href="https://harrypotter.fandom.com"
          target="_blank"
          rel="noreferrer"
          className={styles.link}
        >
          Harry Potter Wiki
        </a>
        {t.aboutSourcesAnd}
        <a
          href="https://www.encyclopedie-hp.org/monde-magique/sorts/"
          target="_blank"
          rel="noreferrer"
          className={styles.link}
        >
          Encyclopédie Harry Potter
        </a>
        .
      </p>
    </section>
  )
}
