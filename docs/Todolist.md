# Todolist — Livre des sorts 3D

> Rendu final : **23/10/2026** · Détails dans [`planning.md`](planning.md)

---

## Phase 0 — Préparation

| Statut | Tâche | Responsable | Deadline |
|:---:|---|---|---|
| ✅ | Planning | — | 25/08 |
| ✅ | Arborescence de navigation | — | 25/08 |
| ✅ | Schéma d'intégration des données | — | 25/08 |
| ⬜ | Wireframe / maquette Figma | Léandre | **28/08** |
| ⬜ | Validation finale des docs de préparation | Léandre | **06/09** |
| ⬜ | Init repo GitHub + commit des docs (`docs/`) | — | **06/09** |

---

## Phase 1 — Fondations techniques

| Statut | Tâche | Deadline |
|:---:|---|---|
| ⬜ | Setup React + Vite + React Three Fiber | **04/09** |
| ⬜ | Structure des dossiers du projet | **04/09** |
| ⬜ | Premier fetch API `/v1/spells` | **04/09** |
| ⬜ | Pagination complète (~345 sorts) | **06/09** |
| ⬜ | README + premier déploiement Netlify | **06/09** |

**TP associé** : 04/09 (2h)

---

## Phase 2 — Livre 3D et feuilletage

| Statut | Tâche | Deadline |
|:---:|---|---|
| ⬜ | Scène 3D (caméra, lumières, canvas) | **20/09** |
| ⬜ | Modèle du livre (couverture, pages) | **20/09** |
| ⬜ | Animation de feuilletage | **27/09** |
| ⬜ | Interactions souris / clavier | **27/09** |
| ⬜ | Mapping sort → double-page | **27/09** |
| ⬜ | Route `/spell/:slug` | **27/09** |
| ⬜ | *(Optionnel)* Animation d'ouverture du livre | **27/09** |

**Fenêtre critique** : 20/09 → 01/10 · ⛔ Entreprise 08/09 → 19/09

---

## Phase 3 — Recherche et UI

| Statut | Tâche | Deadline |
|:---:|---|---|
| ⬜ | Barre de recherche (overlay HTML) | **05/10** |
| ⬜ | Filtrage des sorts | **05/10** |
| ⬜ | Navigation vers la page du sort trouvé | **05/10** |
| ⬜ | Affichage complet des attributs du sort | **05/10** |
| ⬜ | États chargement / aucun résultat / erreur | **05/10** |
| ⬜ | Section « À propos » (bas de page) | **08/10** |

**TP associé** : 02/10 (2h)

---

## Phase 4 — Finition et livraison

| Statut | Tâche | Deadline |
|:---:|---|---|
| ⬜ | Responsive (3D conservé sur mobile) | **18/10** |
| ⬜ | Styles finaux (alignés maquette Figma) | **18/10** |
| ⬜ | Fallback CORS (`spells.json` local si besoin) | **18/10** |
| ⬜ | Tests manuels complets | **20/10** |
| ⬜ | Déploiement Netlify final | **22/10** |
| ⬜ | Envoi mail à francois.gillet@vacataire.unc.nc | **23/10** |

**Buffer final** : week-end 18–19/10 + 21–22/10 · ⛔ Entreprise 09/10 → 20/10

---

## Décisions encore ouvertes

| Sujet | Deadline suggérée |
|---|---|
| Recherche API vs filtre local | Avant phase 3 (**02/10**) |
| Affichage des images de sorts | Avant phase 2 (**20/09**) |
| Image de couverture / 1re page (Figma) | **28/08** |

---

## Prochaine action

**Wireframe Figma** — deadline **28/08** · TP demain pour relecture et validation
