# Documentation — Lieux communs

Parcours audio urbain (village / commune). Chaque étape est accessible via un QR code scanné sur place. Le site sera généré en statique avec Astro, hébergé sur Cloudflare Pages, et alimenté par une configuration JSON locale.

## État du dépôt (septembre 2026)

| Zone | État |
|---|---|
| Astro + Tailwind 4 | En place à la racine |
| React / îlots TypeScript | 7 îlots sous `src/islands/` |
| `src/content/parcours.json` | En place (10 lieux) |
| Pages `/lieux/[slug]` | Générées (une par lieu actif) |
| Maquette HTML | Archivée dans [`maquette/`](./maquette/) |
| Schéma + exemple JSON | Présents sous `schema/` et `exemples/` |
| Médias | Visuels réels dans `public/images/` ; audios et documents de démonstration à remplacer |

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
