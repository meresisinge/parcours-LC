# Vision produit

## Contexte

**Lieux communs** est un parcours de village (ou de commune) autour de la laïcité. Sur le terrain, chaque personne scanne un QR code placé sur un lieu. Elle arrive directement sur la page de cet épisode : récit audio, texte, images et documents associés.

La maquette archivée dans [`docs/maquette/`](./maquette/) sert de référence visuelle et fonctionnelle. Les assets embarqués (base64 / images de démo) ne sont **pas** destinés à la production. Le site cible est un projet Astro à la racine du dépôt (voir [architecture.md](./architecture.md)).

## Parcours utilisateur

1. L’usager scanne un QR code sur place.
2. Le navigateur ouvre l’URL du lieu (`/lieux/{slug}`).
3. La page affiche le lieu, lance ou propose l’audio, et donne accès au récit écrit et aux contenus complémentaires.
4. Navigation optionnelle vers le lieu précédent / suivant ou la carte du parcours.
5. Accueil (`/`) pour découvrir le projet sans QR (exploration hors terrain).

Les audios et médias peuvent être mis à jour dans le temps sans changer les URL des QR codes (slugs stables).

## Capacités de configuration (hors code)

Depuis le fichier JSON local, on doit pouvoir :

- personnaliser les textes (site, lieux, mentions, accueil) ;
- ajouter / remplacer des images ;
- changer les fichiers audio (ou leur version) ;
- définir ou enrichir une chronologie par lieu (et éventuellement globale) ;
- ajouter / retirer des lieux (ordre, slug, métadonnées) ;
- attacher des contenus complémentaires (photos, cartes, documents) ;
- ajuster le cadrage diorama (coordonnées caméra) ;
- contrôler les métadonnées de déploiement (titre SEO, langue, crédits).

## Contraintes techniques cibles

| Élément | Choix |
|---|---|
| Framework | Astro (site statique) |
| Interactivité | Îlots TypeScript + React |
| Contenu éditable | JSON local versionné |
| Hébergement | Cloudflare Pages |
| Accès terrain | 1 URL stable par lieu → 1 QR code |

## Hors scope de la maquette

- Lecteur audio réel (la maquette simule la lecture).
- Fichiers audio / médias finaux.
- CMS distant (édition via JSON local uniquement pour démarrer).
- Authentification, comptes utilisateurs.
