# Lieux communs — maquette (archive)

Prototype de navigation pour le parcours urbain « Lieux communs » (Mérésis / Jaïka), sur le thème de la laïcité.

Ce dossier est une **archive de référence**. Le site de production se construit à la racine avec Astro. Analyse détaillée : [../maquette.md](../maquette.md).

## Contenu

```
docs/maquette/
├── index.html      # page principale
├── style.css       # styles
├── script.js       # logique + illustrations embarquées (base64)
└── public/images/  # webp de démo (lieux)
```

Ouvrir `index.html` dans un navigateur (pas de build requis).

## Diorama — coordonnées des lieux

Les coordonnées de cadrage (`CAM_POINTS` dans `script.js`) sont des estimations visuelles. Deux points à vérifier :

- **La rue Aristide Briand** : aucune rue n’est visible sur l’illustration actuelle ; le cadrage pointe vers l’allée centrale en bas.
- **Le lieu de culte** : deux éléments possibles (tour à dôme bleu en haut à droite, façade avec rosace en bas à droite) — le cadrage actuel pointe vers la seconde.

Ajustement : valeurs `x` / `y` entre `0` et `1` dans `CAM_POINTS` (et plus tard dans `lieux[].diorama` du JSON de config).
