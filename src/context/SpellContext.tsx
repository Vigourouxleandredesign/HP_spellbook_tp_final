import { useMemo, type ReactNode } from 'react'
import { useLocale } from '@/hooks/useLocale'
import { SpellContext, type SpellContextValue } from '@/hooks/useSpellContext'
import { useSpells } from '@/hooks/useSpells'
import { EMPTY_SPELL } from '@/types/spell'
import { resolvePageIndex } from '@/utils/findSpellIndex'
import { localizeSpell } from '@/utils/localizeSpell'

interface SpellProviderProps {
  children: ReactNode
  initialSlug?: string
}

export function SpellProvider({ children, initialSlug }: SpellProviderProps) {
  const { locale } = useLocale()
  const { spells: rawSpells, isLoading, error, refetch } = useSpells()

  const spells = useMemo(
    () => rawSpells.map((spell) => localizeSpell(spell, locale)),
    [locale, rawSpells],
  )

  const currentPageIndex = useMemo(
    () => resolvePageIndex(spells, initialSlug),
    [initialSlug, spells],
  )

  const currentSpell = spells[currentPageIndex] ?? localizeSpell(EMPTY_SPELL, locale)

  const value = useMemo<SpellContextValue>(
    () => ({
      spells,
      currentSpell,
      currentPageIndex,
      isLoading,
      error,
      refetch,
    }),
    [spells, currentSpell, currentPageIndex, isLoading, error, refetch],
  )

  return (
    <SpellContext.Provider value={value}>{children}</SpellContext.Provider>
  )
}
