import { createContext, useContext } from 'react'
import type { Spell } from '@/types/spell'

export interface SpellContextValue {
  spells: Spell[]
  currentSpell: Spell
  currentPageIndex: number
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export const SpellContext = createContext<SpellContextValue | null>(null)

export function useSpellContext(): SpellContextValue {
  const context = useContext(SpellContext)

  if (!context) {
    throw new Error('useSpellContext must be used within SpellProvider')
  }

  return context
}
