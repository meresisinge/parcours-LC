# Lieux communs — prototype

Prototype de navigation pour le parcours urbain "Lieux communs" (Mérésis / Jaïka), sur le thème de la laïcité.

## Structure du projet

```
index.html                  # page principale
style.css                   # tous les styles
script.js                   # toute la logique + toutes les images embarquées (base64)
lieux-communs-model.glb     # modèle 3D (Meshy AI, v1)
vendor/
  three.module.js           # Three.js, embarqué localement
  GLTFLoader.js              # chargeur de modèles .glb/.gltf
  BufferGeometryUtils.js     # dépendance de GLTFLoader
```

Aucune dépendance réseau externe : Three.js est embarqué dans `vendor/` plutôt que
chargé depuis un CDN, et toutes les illustrations sont encodées directement dans
`script.js` plutôt que servies comme fichiers séparés — pour éviter tout souci de
chemin de fichier ou de dossier mal placé.
