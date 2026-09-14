# Architecture

## État actuel

Le dépôt est un **projet Astro 7** (template Basics) avec la maquette HTML archivée dans `docs/maquette/`. La stack cible (React, JSON de contenu, pages lieux, Cloudflare) n’est **pas encore** en place.

### Arborescence actuelle

```
/
├── docs/
│   ├── README.md
│   ├── vision.md
│   ├── architecture.md          # ce fichier
│   ├── maquette.md
│   ├── configuration.md
│   ├── qr-codes.md
│   ├── schema/parcours.schema.json
│   ├── exemples/parcours.exemple.json
│   └── maquette/                # prototype HTML archivé
│       ├── index.html
│       ├── style.css
│       ├── script.js
│       ├── README.md
│       └── public/images/*.webp
├── public/
│   ├── favicon.ico
│   └── favicon.svg
├── src/
│   ├── assets/                  # assets starter Astro
│   ├── components/
│   │   └── Welcome.astro        # composant starter (à remplacer)
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro          # page starter uniquement
├── astro.config.mjs             # config vide (défaut)
├── package.json                 # dépendance : astro uniquement
├── package-lock.json
├── tsconfig.json
├── AGENTS.md
└── README.md
```

### Absent pour l’instant

- `@astrojs/react`, îlots `.tsx`
- `src/content/parcours.json`, `src/types/parcours.ts`
- `src/pages/lieux/[slug].astro`, `404.astro`
- `public/images|audio|documents/` (hors maquette)
- `wrangler.toml`
- script `validate:config`

### Commandes actuelles

| Commande | Action |
|---|---|
| `npm install` | Dépendances |
| `npm run dev` | Serveur local (`localhost:4321`) |
| `npm run build` | Build → `dist/` |
| `npm run preview` | Prévisualiser le build |

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
| 4 | Ajouter React (`@astrojs/react`) + types `parcours.ts` | À faire |
| 5 | Créer `src/content/parcours.json` (migrer les 10 lieux) | À faire |
| 6 | Implémenter `/` (sections maquette en Astro) | À faire |
| 7 | Implémenter `/lieux/[slug]` + `AudioPlayer` | À faire |
| 8 | Porter le diorama dans `ParcoursExplorer` | À faire |
| 9 | Brancher médias réels, retirer base64 | À faire |
| 10 | Générer / documenter les URLs QR | À faire |
| 11 | Déployer sur Cloudflare Pages | À faire |
