# Instructions agents — Lieux communs

## Langue

- Répondre **toujours en français**.
- Commentaires dans le code : anglais, uniquement si la logique est non évidente.
- Pas de documentation / guides / exemples sauf demande explicite.

## Stack

- **Astro 7** (SSG) — pages et layouts `.astro`
- **TypeScript** — typage strict
- **React** — îlots interactifs uniquement (`.tsx`)
- **Tailwind CSS 4** — styles utilitaires
- Contenu éditable : `src/content/parcours.json` (schéma : `docs/schema/parcours.schema.json`)
- Référence UI : `docs/maquette/` (ne pas modifier sauf demande)
- Doc projet : `docs/`

## Développement

```bash
npm run dev          # serveur local
npm run build        # sortie dist/
npm run preview      # prévisualiser le build
```

Si besoin du mode background Astro : `astro dev --background` puis `astro dev stop|status|logs`.

## Règles générales

1. Contenu métier (textes, audios, images, chronologie) → **JSON**, pas hardcodé dans les composants.
2. Hydrater le minimum : `.astro` par défaut ; React seulement pour l’interactif.
3. Une URL `/lieux/{slug}` = un QR code. **Ne jamais renommer un `slug` existant.**
4. Chemins médias : relatifs à `public/` ou URL R2 publique. Aucune clé secrète R2 dans le frontend / JSON / `PUBLIC_*`.
5. Secrets éventuels (upload) → `.env` gitignored uniquement, jamais côté client.
6. Suivre l’architecture décrite dans `docs/architecture.md` et `docs/configuration.md`.

---

## Structure frontend (stable)

Conventions Astro : `pages/` = routes uniquement ; le métier vit dans `components/`, `islands/`, `lib/`, `content/`.

```
src/
├── pages/                      # ROUTES uniquement (fichier = URL)
│   ├── index.astro             # Accueil
│   ├── 404.astro
│   └── lieux/
│       └── [slug].astro        # Page épisode (QR)
│
├── layouts/
│   └── BaseLayout.astro        # Shell HTML, SEO, styles globaux
│
├── content/
│   └── parcours.json           # Source de vérité contenu
│
├── types/
│   └── parcours.ts             # Types alignés sur le schéma JSON
│
├── lib/                        # Logique pure TS (pas de UI)
│   ├── config.ts               # Chargement / validation config
│   ├── urls.ts                 # Helpers slug / URLs QR
│   └── media.ts                # Résolution chemins / base média
│
├── styles/
│   └── global.css              # Tailwind + tokens CSS
│
├── assets/                     # Assets importés (optimisés par Astro)
│
├── components/                 # UI STATIQUE (.astro) — par domaine
│   ├── ui/                     # Primitives réutilisables (Button, Badge…)
│   ├── site/                   # Marque, header, footer
│   ├── accueil/                # Hero, seuil, intro
│   ├── parcours/               # Liste / structure explorateur (coquille)
│   ├── lieu/                   # En-tête épisode, galerie statique…
│   ├── projet/                 # Section éditoriale
│   ├── chronologie/            # Frise(s) statiques
│   └── mentions/               # Mentions légales
│
└── islands/                    # UI INTERACTIVE (React + TS) — mêmes domaines
    ├── accueil/
    │   └── WelcomeModal.tsx
    ├── parcours/
    │   └── ParcoursExplorer.tsx    # Liste + diorama + sélection
    └── lieu/
        ├── AudioPlayer.tsx
        ├── RecitDrawer.tsx
        └── MediaLightbox.tsx
```

### Emplacements interdits / à éviter

| Ne pas faire | Faire |
|---|---|
| Logique métier dans `pages/` | Déléguer à `lib/` + composants / îlots |
| Gros `.tsx` monolithe | Un îlot = une interaction, dossier domaine |
| Dupliquer les domaines entre `components/` et `features/` | Un seul découpage : `components/` + `islands/` |
| Contenu texte en dur dans React | Props depuis Astro ← JSON |
| Modifier `docs/maquette/` pour le site | S’en inspirer, implémenter sous `src/` |

---

## Domaines métier

Travailler **dans le dossier du domaine** concerné. Ne pas mélanger les responsabilités.

### `site`

Identité, chrome global, SEO de base.

- Layout, header, footer, marque
- Tokens / thème issus de `site.theme` dans le JSON
- Fichiers : `layouts/`, `components/site/`

### `accueil`

Entrée hors terrain (sans QR).

- Hero, phrase seuil, modal de bienvenue
- Données : `accueil.*` du JSON
- Fichiers : `components/accueil/`, `islands/accueil/`

### `parcours`

Vue d’ensemble des lieux (exploration).

- Liste ordonnée, diorama, carte POI, navigation vers `/lieux/{slug}`
- Données : `lieux[]`, `diorama`
- Fichiers : `components/parcours/`, `islands/parcours/`

### `lieu`

Épisode scanné sur place (cœur produit).

- Page `[slug]`, lecteur audio, récit, médias, nav prev/next
- Données : un objet `lieux[]` + `medias` / `chronologie` du lieu
- Fichiers : `pages/lieux/`, `components/lieu/`, `islands/lieu/`

### `chronologie`

Frises temporelles.

- Globale (`chronologieGlobale`) et/ou par lieu (`lieux[].chronologie`)
- Fichiers : `components/chronologie/` (+ îlot seulement si interaction)

### `projet`

Section éditoriale « Le projet ».

- Données : `projet.*`
- Fichiers : `components/projet/`

### `mentions`

Contenu légal.

- Données : `mentions.*`
- Fichiers : `components/mentions/`

### `content` (transversal)

Pas d’UI : schéma, types, chargement config, helpers d’URL / médias.

- Fichiers : `content/`, `types/`, `lib/`

---

## Conventions Astro / React

- Pages : composition légère — import layout + sections domaine + passage de données.
- Îlots React : directive explicite (`client:load` | `client:visible` | `client:idle`) selon le besoin.
- Nommage : `PascalCase` composants ; dossiers domaines en **minuscules** ; slugs / ids JSON en `kebab-case`.
- Styles : Tailwind dans les composants ; tokens globaux dans `styles/global.css`.
- Accessibilité : focus visible, labels, `aria-*` sur lecteurs et modales (reprendre l’esprit de la maquette).

## Références Astro

- [Routing](https://docs.astro.build/en/guides/routing/)
- [Components](https://docs.astro.build/en/basics/astro-components/)
- [Framework components (îlots)](https://docs.astro.build/en/guides/framework-components/)
- [Styling / Tailwind](https://docs.astro.build/en/guides/styling/)
- [Content](https://docs.astro.build/en/guides/content-collections/)
