# Batterie caméra — anti-régression

```bash
npm run test:camera
```

Si un cas échoue, le cadrage n’est pas validé.

## Contrat

| Surface | Source | Règle |
|---|---|---|
| PC | `desktopCameraDefaults` | Premier panneau Leva, mot pour mot |
| Mobile | `mobileCameraDefaults` via `cameraForViewport(..., true)` | Second panneau Leva, mot pour mot |
| Fit | `computeFitDistance` | Formule d’origine, pas de multiplicateur portrait |
| Isolation | mobile ignore les sliders PC | Un offset Leva desktop ne fuit pas sur téléphone |

## Valeurs figées

**PC** — fov 42 · marge 0,50 · élév. 1,15 · X 0 · Y −0,21 · Z −2 · regard −0,21 · polar 14–88 · dist 0,70–2,55

**Mobile** — fov 43 · marge 0,55 · élév. 1,00 · X 0 · Y −0,80 · Z −2 · regard −0,90 · polar 0–86 · dist 0,50–2,55

## Checklist manuelle (après tests verts)

- [ ] PC ≥ 769 px : cadrage du premier panneau (rechargement forcé si Leva affiche d’anciens sliders)
- [ ] Mobile ≤ 768 px : cadrage du second panneau
- [ ] Repasser en PC : le livre ne garde pas le cadrage mobile
