# URLs QR codes

**Statut :** cible — les pages `/lieux/{slug}` et le fichier `parcours.json` ne sont pas encore en place.

Chaque lieu actif exposera une URL stable utilisée pour générer le QR imprimé sur site.

## Formule

```
{site.urlCanonique}/lieux/{lieu.slug}
```

## Inventaire (à générer au build)

| Ordre | Titre | Slug | URL | Emplacement (qr.note) |
|---|---|---|---|---|
| 1 | La Mairie | `mairie` | `https://…/lieux/mairie` | Entrée principale |
| 2 | L'École | `ecole` | `https://…/lieux/ecole` | Portail |

Compléter automatiquement depuis `parcours.json` (script ou page interne `/admin/qr` en local uniquement, hors prod publique).

## Règles

1. Ne jamais changer `slug` après impression des QR.
2. Pour retirer un lieu du parcours sans casser les QR déjà posés : `"actif": false` + page de bascule (« étape indisponible ») plutôt qu’une 404 sèche si des QR existent encore.
3. Les mises à jour audio / texte / images n’impactent pas le QR.
4. Tester chaque URL sur mobile (réseau terrain) avant impression définitive.
