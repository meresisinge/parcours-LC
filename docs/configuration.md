# Configuration JSON

Fichier unique de contenu du site (cible : `src/content/parcours.json`).

**Statut :** le fichier n’existe pas encore dans `src/`. Utiliser [exemples/parcours.exemple.json](./exemples/parcours.exemple.json) comme modèle, puis le copier vers `src/content/parcours.json` lors de l’implémentation.

Éditer ce fichier permettra, sans modifier le code, de :

- changer textes et accroches ;
- ajouter ou remplacer images / audios / documents ;
- enrichir ou créer une chronologie ;
- ajouter, réordonner ou désactiver des lieux ;
- ajuster le cadrage du diorama ;
- mettre à jour mentions légales et métadonnées SEO.

Schéma formel : [schema/parcours.schema.json](./schema/parcours.schema.json)  
Exemple : [exemples/parcours.exemple.json](./exemples/parcours.exemple.json)

## Règles générales

1. Chemins de fichiers **relatifs à `public/`** — ex. `/audio/mairie.mp3`, `/images/ecole.webp`.
2. Les `slug` des lieux sont **stables** (QR codes). Ne les renommer qu’en connaissance de cause.
3. `ordre` contrôle l’affichage dans le parcours ; il peut différer de l’historique d’ajout.
4. Champs optionnels omis = section masquée (pas d’erreur).
5. UTF-8, JSON strict (pas de commentaires dans le fichier de prod ; le schéma documente les champs).

## Racine

```json
{
  "version": 1,
  "site": { },
  "accueil": { },
  "projet": { },
  "diorama": { },
  "lieux": [ ],
  "chronologieGlobale": [ ],
  "mentions": { }
}
```

| Champ | Type | Requis | Description |
|---|---|---|---|
| `version` | number | oui | Version du format de config (`1`) |
| `site` | object | oui | Identité, SEO, crédits |
| `accueil` | object | non | Hero, seuil, modal de bienvenue |
| `projet` | object | non | Section éditoriale « Le projet » |
| `diorama` | object | non | Illustration globale du parcours |
| `lieux` | array | oui | Étapes du parcours (min. 1) |
| `chronologieGlobale` | array | non | Frise transversale (optionnelle) |
| `mentions` | object | non | Mentions légales |

---

## `site`

| Champ | Type | Description |
|---|---|---|
| `nom` | string | Nom affiché (ex. `Lieux communs`) |
| `nomCourt` | string | Variante header / QR |
| `langue` | string | Code BCP 47 (`fr`) |
| `tagline` | string | Sous-titre principal |
| `eyebrow` | string | Sur-titre (ex. `Métropole et outre-mer`) |
| `badge` | string | Pastille (ex. prix) |
| `descriptionSeo` | string | Meta description |
| `urlCanonique` | string | Origine HTTPS du site déployé |
| `credits` | string | Ligne footer (ex. `Un projet Jaïka et Mérésis`) |
| `contact` | string | Email ou URL de contact |
| `theme` | object | Optionnel — surcharges de couleurs |

### `site.theme` (optionnel)

| Champ | Type | Description |
|---|---|---|
| `bleuProfond` | string | Hex CSS |
| `bleuVif` | string | Hex CSS |
| `navy` | string | Hex CSS |
| `rouge` | string | Hex CSS |
| `papier` | string | Hex fond |

---

## `accueil`

| Champ | Type | Description |
|---|---|---|
| `seuil` | string | Phrase de la section seuil |
| `imageSeuil` | string | Image de fond du seuil |
| `heroImages` | object | Calques scène 3D (`back`, `mid`, `front`) |
| `bienvenue` | object | Contenu de la modal d’intro |

### `accueil.bienvenue`

| Champ | Type | Description |
|---|---|---|
| `titre` | string | Titre modal |
| `texte` | string | Corps |
| `badge` | string | Pastille |
| `ctaLabel` | string | Libellé bouton |
| `audio` | `AudioRef` | Intro audio optionnelle |

---

## `projet`

| Champ | Type | Description |
|---|---|---|
| `eyebrow` | string | Sur-titre |
| `titre` | string | Titre de section |
| `paragraphes` | string[] | Paragraphes |
| `image` | string | Illustration |

---

## `diorama`

Illustration unique du village sur laquelle chaque lieu a un point de focus.

| Champ | Type | Description |
|---|---|---|
| `image` | string | Version couleur |
| `imageNeutre` | string | Version désaturée (fond) ; si omis, dérivée CSS |
| `alt` | string | Texte alternatif |

Les coordonnées de cadrage sont **par lieu** (`lieux[].diorama`).

---

## `lieux[]`

Un objet = une page `/lieux/{slug}` = un QR code.

| Champ | Type | Requis | Description |
|---|---|---|---|
| `id` | string | oui | Identifiant technique stable (`mairie`) |
| `slug` | string | oui | Segment d’URL (`mairie`) — **immuable après impression QR** |
| `ordre` | number | oui | Position dans le parcours (1, 2, …) |
| `actif` | boolean | non | `false` = masqué du parcours (défaut `true`) |
| `titre` | string | oui | Nom affiché |
| `icone` | string | non | Clé d’icône (`mairie`, `ecole`, …) ou chemin SVG |
| `accroche` | string | oui | Texte court (carte POI + intro épisode) |
| `recit` | string | oui | Texte long du récit (drawer) |
| `dureeLabel` | string | non | Libellé durée (`3 min`) si pas d’audio |
| `image` | object | oui | Visuels du lieu |
| `audio` | `AudioRef` | non | Piste principale |
| `diorama` | object | non | Focus caméra `{ x, y, zoom? }` |
| `chronologie` | `ChronologieItem[]` | non | Frise propre au lieu |
| `medias` | `MediaItem[]` | non | Contenus complémentaires |
| `qr` | object | non | Métadonnées d’impression QR |

### `lieux[].image`

| Champ | Type | Description |
|---|---|---|
| `hero` | string | Image principale de l’épisode |
| `miniature` | string | Vignette liste / carousel |
| `alt` | string | Alt text |

### `lieux[].diorama`

Coordonnées normalisées `0`–`1` (origine en haut à gauche de l’illustration), comme `CAM_POINTS` de la maquette.

| Champ | Type | Description |
|---|---|---|
| `x` | number | Position horizontale du focus |
| `y` | number | Position verticale du focus |
| `zoom` | number | Facteur de zoom optionnel (défaut côté app) |

### `lieux[].qr`

| Champ | Type | Description |
|---|---|---|
| `labelImpression` | string | Texte sous le QR imprimé |
| `note` | string | Note interne (emplacement physique) |

---

## Type `AudioRef`

| Champ | Type | Requis | Description |
|---|---|---|---|
| `src` | string | oui | Chemin fichier (`/audio/mairie.mp3`) |
| `duree` | number | non | Durée en secondes (affichage + SEO) |
| `titre` | string | non | Titre accessible |
| `version` | string | non | Version éditoriale (`2026-03`) pour tracer les mises à jour |
| `transcript` | string | non | Chemin vers transcript texte / VTT |

Changer `src` (ou `version`) met à jour l’audio **sans** changer l’URL du QR.

Formats recommandés : `mp3` ou `m4a` (compatibilité mobile).

---

## Type `ChronologieItem`

Utilisé dans `lieux[].chronologie` et `chronologieGlobale`.

| Champ | Type | Requis | Description |
|---|---|---|---|
| `annee` | string | oui | Libellé (`1792`, `1905`, `années 1920`) |
| `titre` | string | oui | Titre de l’événement |
| `texte` | string | non | Description courte |
| `image` | string | non | Illustration de l’entrée |
| `lieuId` | string | non | Lien vers un lieu (`chronologieGlobale` seulement) |

---

## Type `MediaItem`

Galerie « contenus complémentaires » (remplace `GAL_TEMPLATE` unique de la maquette).

| Champ | Type | Requis | Description |
|---|---|---|---|
| `id` | string | oui | Identifiant local au lieu |
| `type` | string | oui | `image` \| `document` \| `carte` \| `lien` |
| `tag` | string | non | Pastille UI (`PHOTO`, `ARCHIVE`…) |
| `label` | string | oui | Libellé affiché |
| `src` | string | conditional | Fichier local (image / document) |
| `url` | string | conditional | URL externe si `type: "lien"` |
| `alt` | string | non | Alt image |
| `credit` | string | non | Crédit / source |

---

## `mentions`

| Champ | Type | Description |
|---|---|---|
| `titre` | string | Titre modal |
| `sections` | array | `{ "titre": "...", "paragraphes": ["..."] }` |

---

## Opérations courantes

### Changer un audio

1. Déposer le fichier dans `public/audio/`.
2. Mettre à jour `lieux[i].audio.src` (et `duree` / `version` si besoin).
3. Rebuild / redeploy.

### Ajouter une image à un lieu

1. Déposer dans `public/images/`.
2. Ajouter une entrée dans `lieux[i].medias` (`type: "image"`).
3. Ou remplacer `lieux[i].image.hero`.

### Ajouter / enrichir une chronologie

- Par lieu : `lieux[i].chronologie.push({ annee, titre, texte })`
- Globale : `chronologieGlobale.push({ annee, titre, lieuId? })`

### Ajouter un lieu

1. Créer l’objet dans `lieux` avec un **nouveau** `slug`.
2. Ajouter image / audio / médias associés.
3. Renseigner `diorama` si le diorama global doit zoomer dessus.
4. Générer et imprimer le QR vers `{urlCanonique}/lieux/{slug}`.
5. Rebuild.

### Désactiver un lieu temporairement

`"actif": false` — retiré des listes ; l’URL peut renvoyer 404 ou une page « bientôt ».

### Personnaliser les textes du site

Modifier `site.*`, `accueil.*`, `projet.*`, `lieux[].accroche` / `recit`, `mentions.*`.

---

## Validation

```bash
# exemple d’outil
npx ajv validate -s docs/schema/parcours.schema.json -d src/content/parcours.json
```

En CI Cloudflare Pages / GitHub Actions : faire échouer le build si le JSON est invalide.

## Typage TypeScript (cible)

Générer ou maintenir `src/types/parcours.ts` aligné sur le schéma (`ParcoursConfig`, `Lieu`, `AudioRef`, …) et charger la config via `import data from '../content/parcours.json'`.
