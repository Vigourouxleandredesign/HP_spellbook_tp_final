# Arborescence de navigation — Livre des sorts 3D

> SPA React · React Three Fiber · API Potter DB

---

## Routes

```
/                    → Livre ouvert (accueil)
/spell/:slug         → Livre ouvert sur le sort demandé
```

---

## Structure de l'application

```
App
│
├── Vue principale (/)
│   │
│   ├── Scène 3D — Livre des sorts
│   │   ├── Couverture (ouverture animée — optionnelle)
│   │   ├── Double-pages (1 sort = 1 double-page)
│   │   └── Feuilletage (clic, flèches, clavier)
│   │
│   ├── Barre de recherche
│   │   └── Résultats → navigation vers la double-page du sort
│   │
│   ├── Contrôles de navigation
│   │   ├── Page précédente / suivante
│   │   └── Indicateur de position
│   │
│   └── Section « À propos » (bas de page)
│
└── Vue sort (/spell/:slug)
    └── Même interface, ouverte directement sur le sort
```

---

## Parcours utilisateur

```
Arrivée sur le site
    → Chargement des sorts (API)
    → Livre 3D affiché
    → Navigation par feuilletage ou recherche
    → Consultation d'un sort (double-page)
    → Scroll vers « À propos » si besoin
```

---

## États principaux

| État | Description |
|---|---|
| Chargement | Récupération des données API |
| Consultation | Feuilletage et lecture des sorts |
| Recherche | Filtrage et accès direct à un sort |
| Erreur | Problème API — message + retry |

---
