# Livre des sorts 3D — Harry Potter

Exploration interactive 3D des sorts de l'univers Harry Potter.

Projet **Front Avancé — MIAW** · Rendu final : **23/10/2026**

L'utilisateur feuillette un grimoire 3D où chaque double-page présente un sort, avec recherche et navigation par URL. Les données proviennent de l'API [Potter DB](https://docs.potterdb.com/fr).

**Repo GitHub :** [HP_spellbook_tp_final](https://github.com/Vigourouxleandredesign/HP_spellbook_tp_final)

---

## État du projet

| Phase | Statut | Contenu |
|---|---|---|
| 0 — Préparation | ✅ | Planning, docs, wireframes |
| 1 — Fondations | ✅ | Vite, R3F, fetch API (~345 sorts) |
| 2 — Livre 3D | ⬜ | Feuilletage, mapping sort → page |
| 3 — Recherche & UI | ⬜ | Barre de recherche, filtrage |
| 4 — Livraison | ⬜ | Responsive, Netlify, envoi final |

---

## Stack

| Couche | Techno |
|---|---|
| Build | Vite + React 19 + TypeScript |
| Routing | React Router (`/` · `/spell/:slug`) |
| 3D | Three.js · `@react-three/fiber` · `@react-three/drei` |
| Post-processing | `@react-three/postprocessing` (bloom) |
| Debug scène | Leva (dev only) |
| État global | React Context |
| Données | Potter DB REST · `fetch` natif |
| Styles | CSS modules · tokens centralisés |

---

## Démarrage

```bash
npm install
npm run dev
```

Ouvre [http://localhost:5173](http://localhost:5173).

### Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build production |
| `npm run preview` | Prévisualiser le build local |
| `npm run lint` | ESLint |

### Variables d'environnement

Copier `.env.example` en `.env` si besoin :

```env
# VITE_API_URL=https://api.potterdb.com/v1
```

Par défaut, l'API Potter DB est utilisée sans configuration.

---

## Architecture

```
Potter DB API
      ↓
services/api.ts       fetch + pagination + mapping JSON:API → Spell
      ↓
hooks/useSpells.ts    chargement, loading, error, retry
      ↓
context/SpellContext  sorts, page courante, slug URL, gesture
      ↓
components / scenes   UI HTML + canvas R3F
```

### Routes

| URL | Comportement |
|---|---|
| `/` | Livre ouvert (1er sort par défaut) |
| `/spell/:slug` | Livre ouvert sur le sort demandé |

Visuellement, une seule vue (`BookView`) — les routes servent au deep linking.

### Structure des dossiers

```
src/
├── App.tsx                 Routing + SpellProvider
├── BookView.tsx            Vue unique (recherche + livre + contrôles + about)
├── components/             UI HTML
├── components/gesture/     Bonus — GestureCanvas (stub)
├── scenes/                 Canvas R3F (SpellbookScene, lumières, bloom)
├── context/                SpellContext
├── config/                 Defaults scène 3D (Leva / prod)
├── hooks/                  useSpells, useSceneControls
├── services/               api.ts
├── types/                  spell.ts, api.ts
└── styles/tokens/          colors.ts — source de vérité des couleurs
```

### Couleurs

Toutes les couleurs sont définies dans `src/styles/tokens/colors.ts` et injectées en variables CSS au démarrage. Ne pas hardcoder de hex ailleurs.

### Modèle 3D

- Fichier servi : `public/models/Spellbook.glb`
- Sources Blender : `Assets/`

---

## API — Potter DB

| Endpoint | Usage |
|---|---|
| `GET /v1/spells?page[size]=100&page[number]=N` | Liste paginée |
| `GET /v1/spells/{slug}` | Détail d'un sort *(route URL)* |

Au démarrage, `fetchAllSpells()` charge les **4 pages** (~**345 sorts**) et les stocke en mémoire pour le feuilletage et la recherche locale.

Attributs mappés côté app : `slug`, `name`, `incantation`, `category`, `effect`, `light`, `hand`, `image`.

---

## Fonctionnalités

### En place

- Scène 3D avec modèle GLB, lumières, bloom
- Panneau Leva en dev (lumières, bloom)
- Chargement des ~345 sorts au démarrage
- Indicateur de position (`1 / 345`)
- Deep link `/spell/:slug`
- Gestion erreur API + bouton « Réessayer »
- Slot « Geste du sort » (stub bonus)

### À venir

- Animation de feuilletage
- Navigation précédent / suivant
- Affichage du contenu du sort sur la double-page 3D
- Barre de recherche et filtrage
- Responsive mobile
- Déploiement Netlify

---

## Déploiement

> Le déploiement Netlify sera réalisé en **fin de projet** (phase 4).

Un fichier `netlify.toml` est déjà présent pour faciliter le déploiement :

- **Build command :** `npm run build`
- **Publish directory :** `dist`
- **Redirect SPA :** toutes les routes → `index.html`

---

## Documents de préparation

| Fichier | Contenu |
|---|---|
| [`docs/planning.md`](docs/planning.md) | Planning et contraintes |
| [`docs/arborescence.md`](docs/arborescence.md) | Navigation et parcours utilisateur |
| [`docs/schema-donnees.md`](docs/schema-donnees.md) | Intégration API et modèle de données |
| [`docs/Todolist.md`](docs/Todolist.md) | Suivi des tâches par phase |

---

## Auteur

Léandre Vigouroux — MIAW Front Avancé
