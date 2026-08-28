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

## Flux de données

```
Potter DB API
      │
      ▼
  Service API (fetch + pagination)
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
| Recherche API vs filtre local | À définir en dev (les deux sont possibles) |
| Affichage des images | Optionnel — selon faisabilité 3D / maquette Figma |
