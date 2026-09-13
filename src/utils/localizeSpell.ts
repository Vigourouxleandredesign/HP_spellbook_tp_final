import type { Locale } from '@/i18n/locale'
import type { SpellI18nEntry, SpellI18nFile } from '@/types/i18n'
import type { Spell } from '@/types/spell'

function pick(entry: { en: string; fr: string } | null | undefined, locale: Locale, fallback: string): string {
  if (!entry) return fallback
  return (entry[locale] || entry.en || entry.fr || fallback).trim()
}

export function attachSpellI18n(spell: Spell, entry?: SpellI18nEntry): Spell {
  const nameEn = entry?.name.en || spell.nameEn || spell.name
  const nameFr = entry?.name.fr || spell.nameFr || nameEn
  const categoryEn = entry?.category.en || spell.categoryEn || spell.category
  const categoryFr = entry?.category.fr || spell.categoryFr || categoryEn
  const effectEn = entry?.effect.en || spell.effectEn || spell.effect
  const effectFr = entry?.effect.fr || spell.effectFr || effectEn
  const lightEn = entry?.light?.en || spell.lightEn || spell.light
  const lightFr = entry?.light?.fr || spell.lightFr || lightEn
  const handEn = entry?.hand?.en || spell.handEn || spell.hand
  const handFr = entry?.hand?.fr || spell.handFr || handEn

  return {
    ...spell,
    nameEn,
    nameFr,
    categoryEn,
    categoryFr,
    effectEn,
    effectFr,
    lightEn,
    lightFr,
    handEn,
    handFr,
    gestureKind: spell.gestureKind,
  }
}

export function localizeSpell(spell: Spell, locale: Locale): Spell {
  return {
    ...spell,
    name: pick({ en: spell.nameEn, fr: spell.nameFr }, locale, spell.name),
    category: pick(
      { en: spell.categoryEn, fr: spell.categoryFr },
      locale,
      spell.category,
    ),
    effect: pick({ en: spell.effectEn, fr: spell.effectFr }, locale, spell.effect),
    light: pick(
      { en: spell.lightEn ?? '', fr: spell.lightFr ?? '' },
      locale,
      spell.light ?? '',
    ) || null,
    hand: pick(
      { en: spell.handEn ?? '', fr: spell.handFr ?? '' },
      locale,
      spell.hand ?? '',
    ) || null,
  }
}

export function applySpellI18nList(
  spells: Spell[],
  file: SpellI18nFile,
): Spell[] {
  return spells.map((spell) => attachSpellI18n(spell, file.spells[spell.slug]))
}
