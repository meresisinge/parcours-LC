# Analyse de la maquette

Référence : dossier [`docs/maquette/`](./maquette/) (`index.html`, `style.css`, `script.js`, `public/images/`).

La maquette n’est plus à la racine du dépôt : elle a été archivée pour laisser place au projet Astro.

## Rôle de la maquette

Prototype de navigation pour valider le récit, la hiérarchie visuelle et les interactions. Elle guide le découpage futur en pages Astro et en îlots React / TypeScript. Les assets (base64 / webp de démo) ne sont **pas** destinés à la production.

## Structure des fichiers (maquette)

```
docs/maquette/
├── index.html
├── style.css
├── script.js
├── README.md
└── public/images/
    ├── bibliotheque.webp
    ├── bus.webp
    ├── ccas.webp
    ├── ecole.webp
    ├── mairie.webp
    ├── monument.webp
    ├── poste.webp
    ├── rue.webp
    └── salle.webp
```

## Structure des écrans

| Zone | ID / classe | Nature | Futur |
|---|---|---|---|
| Header fixe | `#siteHeader` | Marque | Layout Astro |
| Hero 3D + titre | `#epic` | Scroll pin + scène 3D CSS | Page `/` + îlot scroll / 3D |
| Seuil | `#accueil` / `#stageSeuil` | Phrase d’entrée | Contenu config (`accueil.seuil`) |
| Parcours interactif | `#parcours` | Liste + diorama + carte POI | Îlot React `ParcoursExplorer` |
| Projet | `#projet` | Texte éditorial | Contenu config |
| Footer | `footer` | Crédits + mentions | Layout + config |
| Modal bienvenue | `#welcomeModal` | Intro + faux player | Îlot `WelcomeModal` |
| Mentions | `#mentionsModal` | Légal | Contenu config |
| Overlay épisode | `#episodeOverlay` | Fiche lieu + player + galerie | Page `/lieux/[slug]` + îlots |
| Drawer texte | `#textDrawer` | Récit complet | Îlot `RecitDrawer` |
| Lightbox | `#lightbox` | Zoom média / doc | Îlot `MediaLightbox` |

## Données (codées en dur dans `script.js`)

- `LIEUX[]` — 10 lieux (`n`, `name`, `img`, `icon`, `desc`, `more`)
- `CAM_POINTS` — cadrage diorama `{ x, y }` normalisés (0–1)
- `GAL_TEMPLATE` — galerie générique identique pour tous les lieux (placeholders)
- `ICONS` — SVG par type de lieu
- Audio : **simulé** (barre de progression, pas de fichier réel)

### Lieux de la maquette

1. La Mairie (`mairie`)
2. L’École (`ecole`)
3. Monument aux morts (`monument`)
4. La Poste / Maison France services (`poste`)
5. Le lieu de culte (`culte`)
6. La Bibliothèque (`biblio`)
7. La rue Aristide Briand (`rue`)
8. Le CCAS (`ccas`)
9. La salle des fêtes (`salle`)
10. L’arrêt de bus (`bus`)

Les images sous `docs/maquette/public/images/*.webp` sont des assets de démo ; une grande partie des visuels de la maquette reste embarquée en base64 dans `index.html` / `script.js`.

## Interactions à conserver (îlots)

| Interaction | Comportement maquette | Îlot proposé |
|---|---|---|
| Sélection lieu | Liste / timeline / miniatures synchronisées | `ParcoursExplorer` |
| Diorama | Zoom + focus couleur sur `CAM_POINTS` | Inclus dans `ParcoursExplorer` |
| Ouverture épisode | Overlay plein écran | Navigation Astro vers `/lieux/[slug]` (préféré) |
| Lecteur | Play / vitesse / vague | `AudioPlayer` (React + TS) |
| Récit | Drawer texte `more` | `RecitDrawer` |
| Galerie | Lightbox image ou document | `MediaLightbox` |
| Bienvenue | Modal première visite | `WelcomeModal` |
| Accessibilité | `aria-live`, Escape, focus trap partiel | À renforcer dans les îlots |

## Ce qui ne doit pas migrer tel quel

- Images / illustrations en **base64** dans le HTML/JS.
- Styles et scripts monolithiques dans un seul fichier.
- Galerie unique partagée (`GAL_TEMPLATE`) — chaque lieu aura ses propres médias en config.
- Player factice — remplacer par de vrais fichiers référencés dans le JSON.
- Overlay unique pour tous les lieux — en production, **une page par lieu** pour coller aux QR codes.

## Mapping maquette → configuration

| Champ maquette | Champ JSON cible |
|---|---|
| `name` | `lieux[].titre` |
| `desc` | `lieux[].accroche` |
| `more` | `lieux[].recit` |
| `icon` | `lieux[].icone` |
| `img` | `lieux[].image.hero` |
| `CAM_POINTS[n]` | `lieux[].diorama.{x,y}` |
| `GAL_TEMPLATE` | `lieux[].medias[]` |
| textes UI (badge, tagline…) | `site.*` / `accueil.*` |
| durée affichée « 3 min » | dérivée de `lieux[].audio.duree` ou `dureeLabel` |
