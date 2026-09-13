import { useT } from '@/context/LocaleContext'
import styles from './About.module.css'

export function About() {
  const t = useT()

  return (
    <section className={styles.about} id="about">
      <h2 className={styles.title}>{t.aboutTitle}</h2>
      <p className={styles.text}>
        {t.aboutP1Before}
        <a
          href="https://docs.potterdb.com/fr"
          target="_blank"
          rel="noreferrer"
          className={styles.link}
        >
          Potter DB
        </a>
        {t.aboutP1Mid}
        <a
          href="https://harrypotter.fandom.com"
          target="_blank"
          rel="noreferrer"
          className={styles.link}
        >
          Harry Potter Wiki
        </a>
        {t.aboutP1And}
        <a
          href="https://www.encyclopedie-hp.org/monde-magique/sorts/"
          target="_blank"
          rel="noreferrer"
          className={styles.link}
        >
          Encyclopédie Harry Potter
        </a>
        {t.aboutP1After}
      </p>
      <p className={styles.text}>{t.aboutP2}</p>
      <p className={styles.text}>{t.aboutP3}</p>
    </section>
  )
}
