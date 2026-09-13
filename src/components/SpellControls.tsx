import { useT } from '@/context/LocaleContext'
import { useSpellContext } from '@/context/SpellContext'
import { useSpellNavigation } from '@/hooks/useSpellNavigation'
import styles from './SpellControls.module.css'

export function SpellControls() {
  const t = useT()
  const { currentPageIndex, spells, currentSpell, isLoading, error, refetch } =
    useSpellContext()

  const { goPrevious, goNext, canGoPrevious, canGoNext, isReady, isAnimating } =
    useSpellNavigation()

  const total = spells.length
  const positionLabel =
    total > 0 ? `${currentPageIndex + 1} / ${total}` : '— / —'

  return (
    <section className={styles.controls} aria-label={t.navAria}>
      {isLoading && (
        <p className={styles.status} role="status">
          {t.loadingSpells}
        </p>
      )}

      {error && (
        <div className={styles.errorBox} role="alert">
          <p className={styles.errorText}>{error}</p>
          <button type="button" className={styles.retryButton} onClick={refetch}>
            {t.retry}
          </button>
        </div>
      )}

      {!isLoading && !error && total > 0 && (
        <p className={styles.status} role="status">
          {t.spellsLoaded(total, currentSpell.name)}
          {!isReady && ` · ${t.animWaiting}`}
          {isAnimating && ` · ${t.flipping}`}
        </p>
      )}

      <div className={styles.navRow}>
        <button
          type="button"
          className={styles.navButton}
          disabled={!canGoPrevious}
          onClick={goPrevious}
        >
          {t.previous}
        </button>
        <span className={styles.indicator}>{positionLabel}</span>
        <button
          type="button"
          className={styles.navButton}
          disabled={!canGoNext}
          onClick={goNext}
        >
          {t.next}
        </button>
      </div>

      <p className={styles.hint}>{t.navHint}</p>
    </section>
  )
}
