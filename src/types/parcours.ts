/**
 * Types alignés sur docs/schema/parcours.schema.json.
 * Toute évolution du schéma doit être répercutée ici.
 */

export interface AudioRef {
  src: string;
  duree?: number;
  titre?: string;
  version?: string;
  transcript?: string;
}

export interface ChronologieItem {
  annee: string;
  titre: string;
  texte?: string;
  image?: string;
  lieuId?: string;
}

export type MediaType = 'image' | 'document' | 'carte' | 'lien';

export interface MediaItem {
  id: string;
  type: MediaType;
  tag?: string;
  label: string;
  src?: string;
  url?: string;
  alt?: string;
  credit?: string;
}

export interface Theme {
  bleuProfond?: string;
  bleuVif?: string;
  navy?: string;
  rouge?: string;
  papier?: string;
}

export interface Site {
  nom: string;
  nomCourt?: string;
  langue: string;
  tagline: string;
  eyebrow?: string;
  badge?: string;
  descriptionSeo: string;
  urlCanonique?: string;
  credits?: string;
  contact?: string;
  theme?: Theme;
}

export interface Bienvenue {
  titre?: string;
  texte?: string;
  badge?: string;
  ctaLabel?: string;
  audio?: AudioRef;
}

export interface Accueil {
  seuil?: string;
  imageSeuil?: string;
  heroImages?: {
    back?: string;
    mid?: string;
    front?: string;
  };
  bienvenue?: Bienvenue;
}

export interface Projet {
  eyebrow?: string;
  titre?: string;
  paragraphes?: string[];
  image?: string;
}

export interface Diorama {
  image?: string;
  imageNeutre?: string;
  alt?: string;
}

export interface DioramaFocus {
  x: number;
  y: number;
  zoom?: number;
}

export interface LieuImage {
  hero: string;
  miniature?: string;
  alt?: string;
}

export interface Lieu {
  id: string;
  slug: string;
  ordre: number;
  actif?: boolean;
  titre: string;
  icone?: string;
  accroche: string;
  recit: string;
  dureeLabel?: string;
  image: LieuImage;
  audio?: AudioRef;
  diorama?: DioramaFocus;
  chronologie?: ChronologieItem[];
  medias?: MediaItem[];
  qr?: {
    labelImpression?: string;
    note?: string;
  };
}

export interface MentionsSection {
  titre: string;
  paragraphes: string[];
}

export interface Mentions {
  titre?: string;
  sections?: MentionsSection[];
}

export interface ParcoursConfig {
  version: 1;
  site: Site;
  accueil?: Accueil;
  projet?: Projet;
  diorama?: Diorama;
  lieux: Lieu[];
  chronologieGlobale?: ChronologieItem[];
  mentions?: Mentions;
}

/** Vue réduite d'un lieu, suffisante pour les listes, frises et carrousels. */
export interface LieuResume {
  slug: string;
  ordre: number;
  titre: string;
  miniature: string;
  alt: string;
}
