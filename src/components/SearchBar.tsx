import styles from './SearchBar.module.css'

export function SearchBar() {
  return (
    <section className={styles.search} aria-label="Recherche de sorts">
      <label className={styles.label} htmlFor="spell-search">
        Rechercher un sort
      </label>
      <input
        id="spell-search"
        className={styles.input}
        type="search"
        placeholder="Ex. Lumos, Expelliarmus…"
        disabled
        aria-disabled="true"
      />
      <p className={styles.hint}>Filtrage local — branché en phase 3.</p>
    </section>
  )
}
