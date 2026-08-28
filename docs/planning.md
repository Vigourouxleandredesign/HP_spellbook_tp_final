# Planning — Livre des sorts 3D (Harry Potter)

> **Projet** : Exploration interactive 3D de données  
> **Stack** : React · React Three Fiber · API [Potter DB](https://docs.potterdb.com/fr)  
> **Rendu final** : 23/10/2026 (GitHub + Netlify + documents de préparation)

---

## Contraintes de disponibilité

| Type | Dates | Temps estimé |
|---|---|---|
| Cours Front Avancé (TP) | 25/08 · 28/08 · 04/09 · 02/10 | 4 × 2h = **8h (~1 jour)** |
| Période en entreprise | 08/09 → 19/09 | Travail projet **non prioritaire** |
| Période en entreprise | 09/10 → 20/10 | Travail projet **non prioritaire** |
| Week-ends | Autorisés | Créneaux de rattrapage / avance |
| Travail personnel en semaine | Hors entreprise | Variable — prévoir ~1–2h/jour en moyenne |

**Charge totale estimée du projet** : ~6 jours de travail effectif (cohérent avec le cahier des charges).

---

## Vue d'ensemble des phases

```
25/08 ────────────── 06/09 ─── [entreprise] ─── 01/10 ── 02/10 ── [entreprise] ── 23/10
  │    Préparation         │         Développement              │    Finition    │
  │    + setup             │         (cœur 3D + API)            │    + déploiement│
  └────────────────────────┴────────────────────────────────────┴─────────────────┘
```

---

## Phase 0 — Préparation *(documents, sans code)*

**Objectif** : valider le concept, l'architecture et l'organisation avant le développement.

| Livrable | Responsable | Échéance |
|---|---|---|
| Wireframe / maquette Figma | Léandre | **Avant le 28/08** |
| Arborescence de navigation | Léandre + IA | **Avant le 28/08** |
| Schéma d'intégration des données | Léandre + IA | **Avant le 04/09** |
| Planning (ce document) | IA → validé par Léandre | **25/08** ✓ |

**Créneaux associés**
- **25/08** (2h TP) : lecture du sujet, choix thème/API, début des docs de préparation.
- **28/08** (2h TP) : relecture wireframe, finalisation arborescence, validation du schéma de données (brouillon).

**Jalons**
- [ ] Tous les documents de préparation rédigés et versionnés dans le repo — **fini avant le 06/09**

---

## Phase 1 — Fondations techniques

**Objectif** : projet fonctionnel minimal — app qui tourne, API connectée, structure en place.

| Tâche | Échéance |
|---|---|
| Initialisation repo GitHub (React + Vite + R3F) | **Avant le 04/09** |
| Premier fetch `/v1/spells` + affichage liste brute (debug) | **Avant le 04/09** |
| Structure des dossiers (`components/`, `hooks/`, `services/`, `scenes/`) | **Avant le 04/09** |
| Gestion pagination API (333 sorts, `page[size]=100`) | **Avant le 06/09** |
| Premier déploiement Netlify (page placeholder) | **Avant le 06/09** |

**Créneaux associés**
- **04/09** (2h TP) : setup projet, premier appel API, push GitHub.
- **Week-end 30–31/08 ou 06–07/09** (optionnel) : avancer le setup si le TP du 04/09 est insuffisant.

**Jalons**
- [ ] Repo GitHub en ligne avec README — **fini avant le 06/09**
- [ ] Données des sorts récupérables dans l'app — **fini avant le 06/09**

---

## Phase 2 — Livre 3D et feuilletage *(cœur du projet)*

**Objectif** : livre 3D interactif avec animation de tournage de pages.

| Tâche | Échéance |
|---|---|
| Scène Three.js (caméra, lumières, canvas R3F) | **Avant le 20/09** |
| Modèle / mesh du livre (couverture, pages, épaisseur) | **Avant le 20/09** |
| Animation de feuilletage (page suivante / précédente) | **Avant le 27/09** |
| Interaction souris / clic sur les pages | **Avant le 27/09** |
| Mapping d'un sort → contenu affiché sur une double-page | **Avant le 27/09** |

**Créneaux associés**
- **08/09 → 19/09** : entreprise — pas de travail projet prévu (tolérer un retard ici).
- **20/09 → 01/10** : **fenêtre principale de développement 3D** (soirs + week-ends 20–21/09, 27–28/09).

**Jalons**
- [ ] Livre 3D visible avec feuilletage basique — **fini avant le 27/09**
- [ ] Un sort affiché sur chaque page — **fini avant le 27/09**

---

## Phase 3 — Recherche et intégration UI

**Objectif** : barre de recherche fonctionnelle, navigation fluide entre les sorts.

| Tâche | Échéance |
|---|---|
| Barre de recherche (overlay HTML sur le canvas 3D) | **Avant le 05/10** |
| Filtrage des sorts (`filter[name_cont]` ou filtre local) | **Avant le 05/10** |
| Saut automatique à la page du sort trouvé | **Avant le 05/10** |
| Affichage des attributs du sort (nom, incantation, effet, couleur…) | **Avant le 05/10** |
| États vides / aucun résultat / chargement | **Avant le 05/10** |

**Créneaux associés**
- **02/10** (2h TP) : intégration recherche + tests en classe.
- **Week-end 04–05/10** (optionnel) : rattrapage si la phase 2 a pris du retard.

**Jalons**
- [ ] Recherche opérationnelle de bout en bout — **fini avant le 08/10**

---

## Phase 4 — Finition, responsive et livraison

**Objectif** : application polie, déployée, documentée — prête pour l'évaluation.

| Tâche | Échéance |
|---|---|
| Responsive (mobile : livre adapté ou vue alternative) | **Avant le 18/10** |
| Styles finaux, cohérence visuelle avec la maquette Figma | **Avant le 18/10** |
| Gestion erreurs API + fallback CORS si nécessaire | **Avant le 18/10** |
| Tests manuels (navigation, recherche, feuilletage) | **Avant le 20/10** |
| Documents de préparation intégrés au repo (`docs/`) | **Avant le 20/10** |
| Déploiement Netlify final + vérification production | **Avant le 22/10** |
| Envoi mail à francois.gillet@vacataire.unc.nc | **Avant le 23/10** |

**Créneaux associés**
- **09/10 → 20/10** : entreprise — pas de travail projet prévu.
- **21/10 → 23/10** : **buffer final** (soirs + week-end 18–19/10 si besoin avant la 2e période d'entreprise).

**Jalons**
- [ ] Site en ligne sur Netlify, stable — **fini avant le 22/10**
- [ ] Livrable complet (GitHub + Netlify + docs) — **fini avant le 23/10**

---

## Calendrier récapitulatif

| Période | Focus | Disponibilité |
|---|---|---|
| **25/08 → 06/09** | Préparation + setup + API | 3 TP (25, 28/08, 04/09) + week-ends |
| **08/09 → 19/09** | ⛔ Entreprise | Projet en pause |
| **20/09 → 01/10** | Livre 3D + feuilletage | Soirs + week-ends — **phase critique** |
| **02/10** | TP — recherche & intégration UI | 2h en classe |
| **03/10 → 08/10** | Recherche + UI | Soirs + week-end 04–05/10 |
| **09/10 → 20/10** | ⛔ Entreprise | Projet en pause |
| **18/10 → 22/10** | Finition + déploiement | Week-end 18–19/10 + soirs 21–22/10 |
| **23/10** | Rendu final | — |

---

## Risques et parades

| Risque | Impact | Parade |
|---|---|---|
| Feuilletage 3D plus complexe que prévu | Retard phase 2 | MVP simplifié (flip 2D CSS en fallback temporaire) ; week-ends 27–28/09 |
| CORS bloqué sur l'API | Pas de données en prod | Copie locale `spells.json` dans le repo (autorisé par le sujet) |
| Deux périodes d'entreprise consécutives | ~24 jours sans avancement | Avancer le 3D **avant** le 08/09 ; buffer final 21–22/10 |
| Données API en anglais uniquement | UX | UI en français, contenu des sorts en anglais (mention dans le README) |
| Performance (333 sorts en 3D) | Lenteur | Pagination visuelle : charger par lot, pas tout en texture 3D |

---

## Répartition indicative du temps (~6 jours)

| Phase | Durée estimée |
|---|---|
| Préparation (docs) | 0,5 j |
| Setup + API | 1 j |
| Livre 3D + feuilletage | 2,5 j |
| Recherche + UI | 1 j |
| Finition + déploiement | 1 j |
| **Total** | **~6 j** |

---

## Prochaines actions immédiates

1. Finaliser le wireframe Figma — **avant le 28/08**
2. Valider l'arborescence de navigation — **prochaine session de travail**
3. Rédiger le schéma d'intégration des données — **avant le 04/09**
4. Valider ce planning et le committer dans le repo lors de l'init GitHub
