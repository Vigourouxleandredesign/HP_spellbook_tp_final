import styles from './About.module.css'

export function About() {
  return (
    <section className={styles.about} id="about">
      <h2 className={styles.title}>À propos</h2>
      <p className={styles.text}>
        Exploration interactive 3D des sorts de l&apos;univers Harry Potter,
        alimentée par l&apos;API{' '}
        <a
          href="https://docs.potterdb.com/fr"
          target="_blank"
          rel="noreferrer"
          className={styles.link}
        >
          Potter DB
        </a>
        .
      </p>
      <p className={styles.text}>
        Projet Front Avancé — MIAW. Feuilletage 3D, recherche et navigation par
        sort.
      </p>
    </section>
  )
}
