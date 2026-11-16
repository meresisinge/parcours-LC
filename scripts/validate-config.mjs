import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const schemaPath = path.join(root, 'docs/schema/parcours.schema.json');
const configPath = path.join(root, 'src/content/parcours.json');

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const validate = ajv.compile(schema);

if (!validate(config)) {
  console.error('✗ src/content/parcours.json est invalide :');
  for (const err of validate.errors ?? []) {
    console.error(`  ${err.instancePath || '/'} ${err.message}`);
  }
  process.exit(1);
}

// Invariants non exprimables dans le schéma JSON Schema.
const errors = [];
const slugs = new Set();
const ordres = new Set();
for (const lieu of config.lieux) {
  if (slugs.has(lieu.slug)) errors.push(`slug dupliqué : ${lieu.slug}`);
  if (ordres.has(lieu.ordre)) errors.push(`ordre dupliqué : ${lieu.ordre}`);
  slugs.add(lieu.slug);
  ordres.add(lieu.ordre);
}

// Chemins relatifs locaux → public/. Les médias CDN (mediaBase) sont exclus.
const publicDir = path.join(root, 'public');
const mediaBase = config.site?.mediaBase;
const seen = new Set();
const estMediaDistant = (src) => {
  if (src.startsWith('/audio/') && src.endsWith('.wav')) return true;
  return /^\/images\/[^/]+\/[^/]+$/.test(src);
};
const checkAsset = (src) => {
  if (!src || !src.startsWith('/') || seen.has(src)) return;
  seen.add(src);
  if (mediaBase && estMediaDistant(src)) return;
  if (!fs.existsSync(path.join(publicDir, src))) errors.push(`fichier absent : public${src}`);
};
checkAsset(config.accueil?.imageSeuil);
checkAsset(config.accueil?.bienvenue?.audio?.src);
for (const key of ['back', 'mid', 'front']) checkAsset(config.accueil?.heroImages?.[key]);
checkAsset(config.projet?.image);
checkAsset(config.diorama?.image);
checkAsset(config.diorama?.imageNeutre);
for (const lieu of config.lieux) {
  checkAsset(lieu.image.hero);
  checkAsset(lieu.image.miniature);
  checkAsset(lieu.audio?.src);
  for (const media of lieu.medias ?? []) checkAsset(media.src);
}

if (errors.length) {
  console.error('✗ src/content/parcours.json : incohérences');
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}

console.log(`✓ Configuration valide — ${config.lieux.length} lieux.`);
