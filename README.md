# Lieux communs — prototype

Prototype de navigation pour le parcours urbain "Lieux communs" (Mérésis / Jaïka), sur le thème de la laïcité.

## Structure du projet

```
index.html                  # page principale
style.css                   # tous les styles
script.js                   # toute la logique + toutes les illustrations embarquées (base64)
```

Plus aucune dépendance externe (fini le modèle 3D / Three.js / GLTFLoader) : la section
parcours utilise désormais le diorama illustré fourni, avec un effet de caméra qui zoome
et se déplace vers le lieu sélectionné, et une révélation en couleur autour de ce point
pendant que le reste de l'illustration reste en retrait (désaturé).

## Diorama — coordonnées des lieux

Les coordonnées de cadrage de chaque lieu (variable `CAM_POINTS` dans `script.js`) sont
des estimations visuelles à partir de l'illustration fournie. Deux points sont à vérifier :

- **La rue Aristide Briand** : aucune rue n'est visible sur l'illustration actuelle,
  le cadrage pointe pour l'instant vers l'allée centrale en bas de la composition.
- **Le lieu de culte** : l'illustration montre deux éléments qui pourraient correspondre
  (une tour à dôme bleu en haut à droite, et une façade avec rosace et croix en bas à
  droite) — le cadrage actuel pointe vers la seconde.

Si le cadrage d'un lieu ne tombe pas juste, ce sont des nombres simples (x/y entre 0 et 1)
à ajuster dans `CAM_POINTS`.
