# Documentation — Lieux communs

Parcours audio urbain (village / commune). Chaque étape est accessible via un QR code scanné sur place. Le site sera généré en statique avec Astro, hébergé sur Cloudflare Pages, et alimenté par une configuration JSON locale.

## État du dépôt (septembre 2026)

| Zone | État |
|---|---|
| Astro (template Basics) | Initialisé à la racine |
| React / îlots TypeScript | Pas encore installés |
| `src/content/parcours.json` | Absent (spécifié seulement) |
| Pages `/lieux/[slug]` | Absentes |
| Maquette HTML | Archivée dans [`maquette/`](./maquette/) |
| Schéma + exemple JSON | Présents sous `schema/` et `exemples/` |

La documentation ci-dessous décrit à la fois **l’existant** et la **cible**. Voir [architecture.md](./architecture.md) pour le détail.

## Contenu

| Document | Rôle |
|---|---|
| [vision.md](./vision.md) | Objectifs produit, parcours QR, évolution des contenus |
| [architecture.md](./architecture.md) | Structure actuelle + cible Astro / îlots / Cloudflare |
| [maquette.md](./maquette.md) | Analyse de la maquette (écrans, données, îlots) |
| [maquette/](./maquette/) | Code source de la maquette (référence visuelle) |
| [configuration.md](./configuration.md) | Spécification du fichier JSON de contenu |
| [qr-codes.md](./qr-codes.md) | URLs stables et règles d’impression QR |
| [schema/parcours.schema.json](./schema/parcours.schema.json) | Schéma JSON Schema (validation) |
| [exemples/parcours.exemple.json](./exemples/parcours.exemple.json) | Exemple minimal éditable |

## Principes

1. **Contenu hors code** — textes, images, audios, chronologie et médias complémentaires vivent dans la configuration.
2. **Pages = QR codes** — chaque lieu a une URL stable (`/lieux/{slug}`) destinée à être gravée dans un QR.
3. **Statique d’abord** — Astro génère le HTML ; les parties interactives sont des îlots TypeScript / React hydratés au besoin.
4. **Évolution minimale** — changer un audio, une image ou un texte ne nécessite pas de toucher au code applicatif.
