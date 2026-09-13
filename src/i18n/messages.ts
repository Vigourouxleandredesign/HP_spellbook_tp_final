import type { Locale } from '@/i18n/locale'

export const messages = {
  fr: {
    siteEyebrow: 'Harry Potter',
    siteTitle: 'Livre des sorts',
    langFr: 'FR',
    langEn: 'EN',
    langSwitch: 'Choisir la langue',
    searchLabel: 'Rechercher un sort',
    searchAria: 'Recherche de sorts',
    searchPlaceholder: 'Ex. Lumos, Expelliarmus…',
    searchHint: 'Filtre local sur le nom, l’incantation ou la catégorie.',
    searchLoading: 'Chargement des sorts…',
    searchError: 'Recherche indisponible — l’API n’a pas répondu.',
    searchFlipping: 'Feuilletage en cours…',
    searchEmpty: 'Aucun sort trouvé.',
    searchResults: (count: number) =>
      `${count} résultat${count > 1 ? 's' : ''} — Entrée pour ouvrir.`,
    pageOpen: 'page ouverte',
    navAria: 'Navigation du livre',
    loadingSpells: 'Chargement des sorts…',
    retry: 'Réessayer',
    spellsLoaded: (total: number, name: string) =>
      `${total} sorts chargés · ${name}`,
    animWaiting: 'animation en attente…',
    flipping: 'feuilletage…',
    previous: '← Précédent',
    next: 'Suivant →',
    navHint:
      'Flèches du clavier · clic sur la page gauche ou droite · première et dernière pages se rejoignent',
    unknownError: 'Erreur inconnue lors du chargement des sorts.',
    aboutTitle: 'À propos',
    aboutP1Before:
      'Exploration interactive 3D des sorts de l’univers Harry Potter. Chaque double-page du grimoire correspond à un sort issu de l’API ',
    aboutP1Mid:
      '. Les descriptions trop courtes sont complétées une fois pour toutes depuis le ',
    aboutP1And: ' et l’',
    aboutP1After:
      ', stockées en local — aucun appel externe pendant la navigation. Passez du français à l’anglais avec le bouton en haut de page.',
    aboutP2:
      'Feuilletez avec les flèches, le clavier ou un clic sur les pages. Recherchez un sort par nom, incantation ou catégorie pour ouvrir directement sa double-page.',
    aboutP3:
      'Projet Front Avancé — MIAW. Stack : React, React Three Fiber, Three.js. Auteur : Léandre Vigouroux.',
    bookSpell: 'Sort',
    bookEffect: 'Effet',
    bookIncantation: 'Incantation',
    bookGesture: 'Geste',
    bookDiscover: 'Découvrir le geste',
    bookLoadingLeft: 'Chargement des sorts…',
    bookLoadingRight: 'Ouverture du grimoire…',
    bookLight: 'Lumière',
  },
  en: {
    siteEyebrow: 'Harry Potter',
    siteTitle: 'Spellbook',
    langFr: 'FR',
    langEn: 'EN',
    langSwitch: 'Choose language',
    searchLabel: 'Search for a spell',
    searchAria: 'Spell search',
    searchPlaceholder: 'E.g. Lumos, Expelliarmus…',
    searchHint: 'Local filter on name, incantation or category.',
    searchLoading: 'Loading spells…',
    searchError: 'Search unavailable — the API did not respond.',
    searchFlipping: 'Turning the page…',
    searchEmpty: 'No spell found.',
    searchResults: (count: number) =>
      `${count} result${count > 1 ? 's' : ''} — Enter to open.`,
    pageOpen: 'open page',
    navAria: 'Book navigation',
    loadingSpells: 'Loading spells…',
    retry: 'Try again',
    spellsLoaded: (total: number, name: string) =>
      `${total} spells loaded · ${name}`,
    animWaiting: 'animation pending…',
    flipping: 'turning page…',
    previous: '← Previous',
    next: 'Next →',
    navHint:
      'Arrow keys · click the left or right page · first and last pages wrap around',
    unknownError: 'Unknown error while loading spells.',
    aboutTitle: 'About',
    aboutP1Before:
      'An interactive 3D exploration of spells from the Harry Potter universe. Each double-page in the grimoire is a spell from the ',
    aboutP1Mid:
      ' API. Short descriptions are filled in once and for all from the ',
    aboutP1And: ' and the ',
    aboutP1After:
      ', stored locally — no external calls while you browse. Switch French and English with the button at the top of the page.',
    aboutP2:
      'Turn pages with the arrows, the keyboard or a click on the pages. Search by name, incantation or category to open a spell’s spread.',
    aboutP3:
      'Advanced Front-end project — MIAW. Stack: React, React Three Fiber, Three.js. Author: Léandre Vigouroux.',
    bookSpell: 'Spell',
    bookEffect: 'Effect',
    bookIncantation: 'Incantation',
    bookGesture: 'Movement',
    bookDiscover: 'Discover the movement',
    bookLoadingLeft: 'Loading spells…',
    bookLoadingRight: 'Opening the grimoire…',
    bookLight: 'Light',
  },
} as const

export type Messages = (typeof messages)[Locale]
