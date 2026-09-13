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
| 2 — Livre 3D | ✅ | Feuilletage, mapping sort → page |
| 3 — Recherche & UI | ✅ | Barre de recherche, filtrage |
| 4 — Livraison | ➡️ | UI bilingue, mobile, gestes · Netlify / mail à faire |

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
| `npm run preview` | Preview prod (libère 4173 s’il est pris) |
| `npm run lint` | ESLint |
| `npm run i18n:spells` | Reconstruire `spell-i18n.json` |
| `npm run enrich` | Dump EHP + synthèse d’enrichment |

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
context/SpellContext  sorts, page courante (Alohomora par défaut)
      ↓
components / scenes   UI HTML + canvas R3F
```

### Routes

| URL | Comportement |
|---|---|
| `/` | Livre ouvert sur **Alohomora** |
| `/spell/:slug` | Livre ouvert sur le sort demandé (slug inconnu → `/`) |

Visuellement, une seule vue (`BookView`) — les routes servent au deep linking.

### Structure des dossiers

```
src/
├── App.tsx                 Routing + SpellProvider
├── BookView.tsx            Vue unique (recherche + livre + contrôles + about)
├── components/             UI HTML (SearchBar, SpellControls, About…)
├── scenes/                 Canvas R3F (SpellbookScene, lumières, bloom)
│   └── spellbook/          Modèle, pages canvas, geste baguette, caméra
├── context/                SpellContext, LocaleContext
├── config/                 Defaults scène 3D (Leva / prod)
├── hooks/                  useSpells, useSceneControls, useSpellNavigation
├── i18n/                   Messages FR / EN
├── data/                   Enrichment + i18n sorts + gestes (hors runtime réseau)
├── utils/                  filterSpells, localizeSpell, spellLightColor
├── services/               api.ts
├── types/                  spell.ts, api.ts, i18n.ts
└── styles/tokens/          colors.ts — source de vérité des couleurs
```

### Couleurs

Toutes les couleurs sont définies dans `src/styles/tokens/colors.ts` et injectées en variables CSS au démarrage. Ne pas hardcoder de hex ailleurs.

### Modèle 3D

- **Source unique :** `Assets/spellbook_lowpoly_v2.glb` (importé par Vite, pas de copie dans `public/`)
- Ancien modèle haute-fidélité : `Assets/Spellbook.glb`

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
- Panneau Leva en dev (lumières, bloom, test d'animation)
- Chargement des ~345 sorts au démarrage
- Feuilletage 3D (page suivante / précédente, boucle première ↔ dernière)
- Contenu **dans** le livre : gauche (nom, incantation API, catégorie) · droite (effet, image, lumière)
- Recherche locale bilingue (nom FR/EN, incantation, catégorie, slug)
- Navigation boutons, clavier (← →) et clic sur les pages
- Indicateur de position et URL `/spell/:slug`
- Accueil et slug inconnu → Alohomora (`/`)
- États chargement / aucun résultat / erreur API
- Section « À propos » + bouton FR / EN
- Pages du livre localisées + overlay de gestes sourcés (livres, films, Hogwarts Legacy)
- Caméra dézoomée sur mobile (≤ 768 px)

### À venir

- Déploiement Netlify + envoi du rendu (Léandre)

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
