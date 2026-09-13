import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import { useLocale } from '@/context/LocaleContext'
import { useSpells } from '@/hooks/useSpells'
import { EMPTY_SPELL, type Spell } from '@/types/spell'
import { resolvePageIndex } from '@/utils/findSpellIndex'
import { localizeSpell } from '@/utils/localizeSpell'

interface SpellContextValue {
  spells: Spell[]
  currentSpell: Spell
  currentPageIndex: number
  isLoading: boolean
  error: string | null
  refetch: () => void
}

const SpellContext = createContext<SpellContextValue | null>(null)

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

export function useSpellContext(): SpellContextValue {
  const context = useContext(SpellContext)

  if (!context) {
    throw new Error('useSpellContext must be used within SpellProvider')
  }

  return context
}
