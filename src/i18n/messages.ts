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
    aboutP1:
      'Les sorts s’oublient vite, surtout loin des tables de bois et des rayonnages familiers. Ce grimoire a été ouvert pour les jeunes sorciers qui veulent continuer à réviser — même loin de leur bibliothèque favorite.',
    aboutP2:
      'C’est un projet étudiant, sans autre ambition que d’être clair : une double-page par sort, une recherche par nom ou incantation, le geste à découvrir, le français et l’anglais au bout d’un bouton.',
    aboutP3:
      'Réalisé dans le cadre du module Front Avancé (MIAW), par Léandre Vigouroux.',
    aboutSourcesBefore: 'Sources : ',
    aboutSourcesMid: ', ',
    aboutSourcesAnd: ' et l’',
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
    aboutP1:
      'Spells fade quickly, especially far from familiar wooden tables and well-worn shelves. This grimoire was opened for young witches and wizards who still want to revise — even far from their favourite library.',
    aboutP2:
      'It is a student project, with no ambition beyond being clear: one double-page per spell, a search by name or incantation, a movement to discover, French and English at the tap of a button.',
    aboutP3:
      'Made for the Advanced Front-end module (MIAW), by Léandre Vigouroux.',
    aboutSourcesBefore: 'Sources: ',
    aboutSourcesMid: ', the ',
    aboutSourcesAnd: ' and the ',
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
