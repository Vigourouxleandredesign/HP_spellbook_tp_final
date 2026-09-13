import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import { useT } from '@/context/LocaleContext'
import { useSpellContext } from '@/context/SpellContext'
import { useSpellNavigation } from '@/hooks/useSpellNavigation'
import { SEARCH_RESULT_LIMIT, filterSpells } from '@/utils/filterSpells'
import styles from './SearchBar.module.css'

export function SearchBar() {
  const t = useT()
  const { spells, isLoading, error, currentSpell } = useSpellContext()
  const { goToSpell, isAnimating } = useSpellNavigation()
  const listId = useId()
  const rootRef = useRef<HTMLElement>(null)
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const results = useMemo(
    () => filterSpells(spells, query).slice(0, SEARCH_RESULT_LIMIT),
    [query, spells],
  )
  const hasQuery = query.trim().length > 0
  const showList = isOpen && hasQuery && !isLoading && !error
  const canSearch = !isLoading && !error && spells.length > 0

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  const selectSpell = (slug: string, name: string) => {
    goToSpell(slug)
    setQuery(name)
    setIsOpen(false)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsOpen(false)
      return
    }

    if (!showList || results.length === 0) {
      if (event.key === 'Enter') event.preventDefault()
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => (index + 1) % results.length)
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => (index - 1 + results.length) % results.length)
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      const spell = results[activeIndex]
      if (spell) selectSpell(spell.slug, spell.name)
    }
  }

  let hint: string = t.searchHint
  if (isLoading) hint = t.searchLoading
  else if (error) hint = t.searchError
  else if (isAnimating) hint = t.searchFlipping
  else if (showList && results.length === 0) hint = t.searchEmpty
  else if (showList) hint = t.searchResults(results.length)

  return (
    <section
      ref={rootRef}
      className={styles.search}
      aria-label={t.searchAria}
    >
      <label className={styles.label} htmlFor="spell-search">
        {t.searchLabel}
      </label>
      <div className={styles.field}>
      <input
        id="spell-search"
        className={styles.input}
        type="search"
        placeholder={t.searchPlaceholder}
        autoComplete="off"
        disabled={!canSearch}
        aria-disabled={!canSearch}
        aria-controls={listId}
        aria-expanded={showList}
        aria-autocomplete="list"
        role="combobox"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setActiveIndex(0)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={onKeyDown}
      />

      {showList && results.length > 0 && (
        <ul id={listId} className={styles.results} role="listbox">
          {results.map((spell, index) => {
            const isActive = index === activeIndex
            const isCurrent = spell.slug === currentSpell.slug

            return (
              <li key={spell.slug} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  className={`${styles.result} ${isActive ? styles.resultActive : ''}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectSpell(spell.slug, spell.name)}
                >
                  <span className={styles.resultName}>{spell.name}</span>
                  <span className={styles.resultMeta}>
                    {spell.incantation ?? spell.category}
                    {isCurrent ? ` · ${t.pageOpen}` : ''}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
      </div>

      <p className={styles.hint} role="status">
        {hint}
      </p>
    </section>
  )
}
