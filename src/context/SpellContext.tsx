import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useSpells } from '@/hooks/useSpells'
import { EMPTY_SPELL, type Spell } from '@/types/spell'

interface SpellContextValue {
  spells: Spell[]
  currentSpell: Spell
  currentPageIndex: number
  isLoading: boolean
  error: string | null
  showGesture: boolean
  setCurrentPageIndex: (index: number) => void
  toggleGesture: () => void
  refetch: () => void
}

const SpellContext = createContext<SpellContextValue | null>(null)

interface SpellProviderProps {
  children: ReactNode
  initialSlug?: string
}

export function SpellProvider({ children, initialSlug }: SpellProviderProps) {
  const { spells, isLoading, error, refetch } = useSpells()
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [showGesture, setShowGesture] = useState(false)

  useEffect(() => {
    if (!initialSlug || spells.length === 0) return

    const index = spells.findIndex((spell) => spell.slug === initialSlug)
    if (index >= 0) {
      setCurrentPageIndex(index)
    }
  }, [initialSlug, spells])

  const currentSpell = useMemo(() => {
    if (spells.length === 0) {
      return EMPTY_SPELL
    }

    return spells[currentPageIndex] ?? EMPTY_SPELL
  }, [currentPageIndex, spells])

  const toggleGesture = useCallback(() => {
    setShowGesture((value) => !value)
  }, [])

  const value = useMemo<SpellContextValue>(
    () => ({
      spells,
      currentSpell,
      currentPageIndex,
      isLoading,
      error,
      showGesture,
      setCurrentPageIndex,
      toggleGesture,
      refetch,
    }),
    [
      spells,
      currentSpell,
      currentPageIndex,
      isLoading,
      error,
      showGesture,
      toggleGesture,
      refetch,
    ],
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
