import { useCallback, useEffect, useState } from 'react'
import { fetchAllSpells } from '@/services/api'
import type { Spell } from '@/types/spell'

interface UseSpellsResult {
  spells: Spell[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useSpells(): UseSpellsResult {
  const [spells, setSpells] = useState<Spell[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fetchKey, setFetchKey] = useState(0)

  const refetch = useCallback(() => {
    setFetchKey((key) => key + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadSpells() {
      setIsLoading(true)
      setError(null)

      try {
        const data = await fetchAllSpells()

        if (!cancelled) {
          setSpells(data)
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error
              ? err.message
              : 'Erreur inconnue lors du chargement des sorts.'
          setError(message)
          setSpells([])
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadSpells()

    return () => {
      cancelled = true
    }
  }, [fetchKey])

  return { spells, isLoading, error, refetch }
}
