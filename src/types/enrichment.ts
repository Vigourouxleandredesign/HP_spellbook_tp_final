export interface SpellSource {
  title: string
  url: string
  lang: 'en' | 'fr'
}

export interface SpellPatch {
  effect?: string
  effectFr?: string
  image?: string
  sourceUrl?: string
  sourceTitle?: string
  sources?: SpellSource[]
}

export interface SpellEnrichmentFile {
  generatedAt: string | null
  source: string
  patches: Record<string, SpellPatch>
}

export type FandomEnrichmentFile = SpellEnrichmentFile
