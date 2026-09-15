# Architecture

## État actuel

Le dépôt est un **projet Astro 7 + React + Tailwind CSS 4** en SSG. La maquette HTML reste archivée dans `docs/maquette/` comme référence visuelle ; l'intégration vit sous `src/`, découpée par domaine métier.

### Arborescence actuelle

```
/
├── docs/                        # documentation + maquette archivée
├── public/
│   ├── images/                  # visuels extraits de la maquette (webp)
│   ├── favicon.ico
│   └── favicon.svg
├── scripts/
│   └── validate-config.mjs      # validation JSON Schema + cohérence médias
├── src/
│   ├── content/parcours.json    # source de vérité du contenu (10 lieux)
│   ├── types/parcours.ts
│   ├── lib/                     # config, urls, media, icons (+ __tests__)
│   ├── styles/global.css        # tokens Tailwind + classes de composant
│   ├── layouts/BaseLayout.astro
│   ├── pages/                   # index, 404, lieux/[slug]
│   ├── components/              # ui, site, accueil, parcours, lieu,
│   │                            # projet, chronologie, mentions
│   └── islands/                 # accueil, parcours, lieu, site
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── AGENTS.md
└── README.md
```

### Absent pour l'instant

- `public/audio/` et `public/documents/` — pistes et archives réelles
- `wrangler.toml`
- Génération automatique des QR codes

### Commandes actuelles

| Commande | Action |
|---|---|
| `npm install` | Dépendances |
| `npm run dev` | Serveur local (`localhost:4321`) |
| `npm run build` | Validation de la config puis build → `dist/` |
| `npm run preview` | Prévisualiser le build |
| `npm run check` | Diagnostics Astro / TypeScript |
| `npm test` | Tests unitaires des modules `src/lib/` (Vitest) |
| `npm run validate:config` | Valide `parcours.json` contre le schéma |

---

## Cible

### Stack

- **Astro** — génération de site statique (SSG) — *déjà initialisé*
- **TypeScript** — logique des îlots et typage de la config
- **React** (îlots) — composants interactifs hydratés
- **Cloudflare Pages** — hébergement + CDN
- **JSON local** — source de vérité du contenu

### Arborescence cible

Découpage **par domaine métier** (voir `AGENTS.md` / `CLAUDE.md`).  
`pages/` = routes Astro uniquement ; UI statique dans `components/{domaine}/` ; React dans `islands/{domaine}/`.

```
/
├── docs/                          # documentation + maquette archivée
├── public/
│   ├── images/
│   ├── audio/
│   └── documents/
├── src/
│   ├── content/
│   │   └── parcours.json          # configuration éditable
│   ├── types/
│   │   └── parcours.ts
│   ├── lib/
│   │   ├── config.ts
│   │   ├── urls.ts
│   │   └── media.ts
│   ├── styles/
│   │   └── global.css
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   └── lieux/
│   │       └── [slug].astro
│   ├── components/                # .astro — ui, site, accueil, parcours,
│   │   ├── ui/                    # lieu, projet, chronologie, mentions
│   │   ├── site/
│   │   ├── accueil/
│   │   ├── parcours/
│   │   ├── lieu/
│   │   ├── projet/
│   │   ├── chronologie/
│   │   └── mentions/
│   └── islands/                   # React .tsx hydratés
│       ├── accueil/WelcomeModal.tsx
│       ├── parcours/ParcoursExplorer.tsx
│       └── lieu/
│           ├── AudioPlayer.tsx
│           ├── RecitDrawer.tsx
│           └── MediaLightbox.tsx
├── astro.config.mjs
├── wrangler.toml                  # optionnel Cloudflare
├── AGENTS.md                      # consignes agents (FR + domaines)
├── CLAUDE.md                      # → AGENTS.md
└── package.json
```

Les fichiers starter (`Welcome.astro`, `src/assets/astro.svg`, etc.) seront retirés ou remplacés au fur et à mesure.

### Pages et QR codes

| Route | Usage |
|---|---|
| `/` | Découverte hors terrain (hero, projet, explorateur) |
| `/lieux/{slug}` | Page d’épisode pointée par le QR du lieu |
| `/404` | QR ou lien invalide |

Les **slugs sont immuables** une fois les QR imprimés. On peut renommer le titre affiché sans changer le slug.

### Îlots React / TypeScript

Principe Astro : HTML statique par défaut ; hydrater uniquement l’interactif.

| Îlot | Hydratation typique | Responsabilité |
|---|---|---|
| `ParcoursExplorer` | `client:visible` | Liste, diorama, sélection, CTA vers `/lieux/{slug}` |
| `AudioPlayer` | `client:load` | Lecture audio réel, vitesse, accessibilité |
| `RecitDrawer` | `client:idle` | Affichage du récit complet |
| `MediaLightbox` | `client:idle` | Galerie / documents |
| `WelcomeModal` | `client:load` | Première visite (sessionStorage) |

Les textes et chemins de médias sont passés en props depuis Astro (données issues du JSON), jamais codés en dur dans l’îlot.

### Configuration locale (cible)

1. Éditer `src/content/parcours.json`.
2. Valider contre `docs/schema/parcours.schema.json` (CI ou script `npm run validate:config`).
3. Placer les fichiers dans `public/` aux chemins déclarés.
4. `astro build` régénère le site.

Voir [configuration.md](./configuration.md).  
Référence de contenu actuelle : [exemples/parcours.exemple.json](./exemples/parcours.exemple.json) (pas encore branché au build).

### Cloudflare Pages (cible)

- Build : `npm run build`
- Dossier de sortie : `dist/`
- Framework preset : Astro
- Variables d’environnement : aucune requise pour le contenu JSON (tout est build-time)
- Déploiement : push Git → build Pages, ou `wrangler pages deploy dist`

---

## Plan de migration

| # | Étape | Statut |
|---|---|---|
| 1 | Initialiser Astro + TypeScript de base | Fait |
| 2 | Archiver la maquette sous `docs/maquette/` | Fait |
| 3 | Documenter schéma JSON + exemple | Fait |
| 4 | Ajouter React (`@astrojs/react`) + types `parcours.ts` | Fait |
| 5 | Créer `src/content/parcours.json` (migrer les 10 lieux) | Fait |
| 6 | Implémenter `/` (sections maquette en Astro) | Fait |
| 7 | Implémenter `/lieux/[slug]` + `AudioPlayer` | Fait |
| 8 | Porter le diorama dans `ParcoursExplorer` | Fait |
| 9 | Brancher médias réels, retirer base64 | Partiel — visuels extraits dans `public/images/`, audios et documents à fournir |
| 10 | Générer / documenter les URLs QR | À faire |
| 11 | Déployer sur Cloudflare Pages | À faire |
