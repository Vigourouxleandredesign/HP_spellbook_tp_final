import { useCallback, useEffect, useState } from 'react'
import enrichmentFile from '@/data/spell-enrichment.json' with { type: 'json' }
import i18nFile from '@/data/spell-i18n.json' with { type: 'json' }
import wandGesturesFile from '@/data/sources/wand-gestures.json' with { type: 'json' }
import { fetchAllSpells } from '@/services/api'
import type { SpellEnrichmentFile } from '@/types/enrichment'
import type { WandGestureFile } from '@/types/gesture'
import type { SpellI18nFile } from '@/types/i18n'
import type { Spell } from '@/types/spell'
import { applyWandGestures } from '@/utils/applyWandGestures'
import { mergeSpellList } from '@/utils/mergeSpellEnrichment'
import { applySpellI18nList } from '@/utils/localizeSpell'

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
        const raw = enrichmentFile as SpellEnrichmentFile | { default: SpellEnrichmentFile }
        const enrichment = 'patches' in raw ? raw : raw.default
        const i18nRaw = i18nFile as SpellI18nFile | { default: SpellI18nFile }
        const i18n = 'spells' in i18nRaw ? i18nRaw : i18nRaw.default
        const gesturesRaw = wandGesturesFile as
          | WandGestureFile
          | { default: WandGestureFile }
        const gestures = 'spells' in gesturesRaw ? gesturesRaw : gesturesRaw.default

        if (!cancelled) {
          setSpells(
            applyWandGestures(
              applySpellI18nList(mergeSpellList(data, enrichment), i18n),
              gestures,
            ),
          )
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
