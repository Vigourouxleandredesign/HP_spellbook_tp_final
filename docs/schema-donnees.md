# Schéma d'intégration des données — Livre des sorts 3D

> API [Potter DB](https://docs.potterdb.com/fr) · Format JSON:API

---

## Source de données

| Élément | Valeur |
|---|---|
| API | `https://api.potterdb.com/v1` |
| Ressource | Sorts (`/spells`) |
| Volume | ~345 sorts, paginés (100 par page, 4 pages) |
| Langue | Anglais uniquement |

---

## Endpoints utilisés

```
GET /v1/spells                    → Liste complète (pagination)
GET /v1/spells/{slug}             → Détail d'un sort (route /spell/:slug)
GET /v1/spells?filter[name_cont]= → Recherche par nom
```

---

## Complément hors runtime (un seul JSON)

Potter DB reste la source des sorts. Deux passages hors ligne alimentent un
fichier unique `src/data/spell-enrichment.json` :

1. `npm run enrich:fandom` → dump [Harry Potter Wiki](https://harrypotter.fandom.com)
   (CC-BY-SA) dans `src/data/sources/fandom-enrichment.json`
2. `npm run enrich:ehp` → dump [Encyclopédie HP](https://www.encyclopedie-hp.org/monde-magique/sorts/)
   dans `src/data/sources/ehp-raw.json`
3. `npm run enrich:synthesize` (ou `npm run enrich`) fusionne les deux : texte
   anglais Fandom en priorité, français EHP si le trou reste, images wiki
   seulement. L’app n’importe que le JSON fusionné : **aucun appel wiki/EHP
   en navigation**. Le chrome du site est bilingue (FR/EN) et les fiches du
   livre passent par `src/data/spell-i18n.json` (`npm run i18n:spells`) —
   toujours aucun appel Fandom/EHP pendant la navigation. Les gestes de
   baguette (sceau « Découvrir le geste ») viennent de
   `src/data/sources/wand-gestures.json` : seulement les sorts dont le
   mouvement est attesté dans les livres, les films ou Hogwarts Legacy —
   Potter DB n’en documente presque aucun.

Citer EHP avec un lien vers la page d’origine (condition d’usage du site).

## Flux de données

```
Potter DB API
      │
      ▼
  Service API (fetch + pagination)
      │
      ▼
  Fusion JSON de soutien local (Fandom + EHP, trous seulement)
      │
      ▼
  State React (liste des sorts)
      │
      ├──► Barre de recherche (filtrage)
      │
      └──► Livre 3D (1 sort = 1 double-page)
```

---

## Données API → Application

Réponse JSON:API — chaque sort expose ces attributs :

| Attribut API | Usage dans l'app |
|---|---|
| `slug` | Identifiant URL (`/spell/:slug`) |
| `name` | Titre du sort (double-page) |
| `incantation` | Formule magique |
| `category` | Type de sort (Charm, Curse…) |
| `effect` | Description de l'effet |
| `light` | Couleur du sort (accent visuel) |
| `image` | Illustration (optionnelle) |

**Modèle simplifié côté app :**

```
Spell {
  slug, name, incantation, category, effect, light, image
}
```

---

## Affichage dans le livre (double-page)

```
Double-page du sort
├── Page gauche  → Nom + incantation + catégorie
└── Page droite  → Effet + couleur (light)
```

---

## Recherche

```
Saisie utilisateur
      │
      ▼
Filtrage sur le nom (API ou liste locale)
      │
      ▼
Clic sur un résultat → navigation vers /spell/:slug
      │
      ▼
Livre ouvert sur la double-page correspondante
```

---

## Chargement initial

```
Ouverture de l'app
      │
      ▼
Fetch page 1 → page 2 → page 3 → page 4
      │
      ▼
Liste complète en mémoire → livre prêt
```

---

## Gestion des erreurs

| Cas | Comportement |
|---|---|
| API indisponible | Message d'erreur + bouton retry |
| CORS bloqué en production | Fallback : fichier `spells.json` local dans le repo |
| Sort introuvable (`/spell/:slug`) | Redirection vers `/` |

---

## Points laissés ouverts

| Sujet | Décision |
|---|---|
| Recherche API vs filtre local | **Filtre local** sur la liste chargée (nom, incantation, catégorie) |
| Affichage des images | Affichées sur la page droite du livre si l’API fournit `image` |
