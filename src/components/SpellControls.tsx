import { useSpellContext } from '@/context/SpellContext'
import { GestureCanvas } from '@/components/gesture/GestureCanvas'
import styles from './SpellControls.module.css'

export function SpellControls() {
  const {
    currentPageIndex,
    spells,
    currentSpell,
    showGesture,
    toggleGesture,
    isLoading,
    error,
    refetch,
  } = useSpellContext()

  const total = spells.length
  const positionLabel =
    total > 0 ? `${currentPageIndex + 1} / ${total}` : '— / —'

  return (
    <section className={styles.controls} aria-label="Navigation du livre">
      {isLoading && (
        <p className={styles.status} role="status">
          Chargement des sorts…
        </p>
      )}

      {error && (
        <div className={styles.errorBox} role="alert">
          <p className={styles.errorText}>{error}</p>
          <button type="button" className={styles.retryButton} onClick={refetch}>
            Réessayer
          </button>
        </div>
      )}

      {!isLoading && !error && total > 0 && (
        <p className={styles.status} role="status">
          {total} sorts chargés · {currentSpell.name}
        </p>
      )}

      <div className={styles.navRow}>
        <button type="button" className={styles.navButton} disabled>
          ← Précédent
        </button>
        <span className={styles.indicator}>{positionLabel}</span>
        <button type="button" className={styles.navButton} disabled>
          Suivant →
        </button>
      </div>

      <button
        type="button"
        className={styles.gestureButton}
        onClick={toggleGesture}
        disabled={!currentSpell.hand}
        aria-pressed={showGesture}
        title={
          currentSpell.hand
            ? 'Afficher le geste du sort'
            : 'Aucun geste renseigné pour ce sort'
        }
      >
        Geste du sort
      </button>

      {showGesture && currentSpell.hand && (
        <GestureCanvas handDescription={currentSpell.hand} />
      )}
    </section>
  )
}
