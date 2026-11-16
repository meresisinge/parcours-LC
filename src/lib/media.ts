import type { AudioRef, MediaItem, ParcoursConfig } from '../types/parcours';

/** Durée en secondes → `m:ss`, format d'affichage du lecteur. */
export function formatDuree(secondes: number): string {
  const total = Math.max(0, Math.round(secondes));
  const minutes = Math.floor(total / 60);
  return `${minutes}:${String(total % 60).padStart(2, '0')}`;
}

/** Libellé de durée : `dureeLabel` explicite, sinon dérivé de l'audio. */
export function dureeLabel(audio?: AudioRef, fallback?: string): string | undefined {
  if (fallback) return fallback;
  if (audio?.duree) return `${Math.max(1, Math.round(audio.duree / 60))} min`;
  return undefined;
}

/** Une entrée de galerie est affichable en image si elle en porte une. */
export function estMediaImage(media: MediaItem): boolean {
  return (media.type === 'image' || media.type === 'carte') && Boolean(media.src);
}

export function lienMedia(media: MediaItem): string | undefined {
  return media.type === 'lien' ? media.url : media.src;
}

/**
 * Assets hébergés sur le CDN (R2) : audios .wav et images de galerie
 * `/images/{slug}/…`. Les heroes plats (`/images/mairie.webp`) restent locaux.
 */
export function estMediaDistant(src: string): boolean {
  if (/^https?:\/\//i.test(src)) return false;
  if (src.startsWith('/audio/') && src.endsWith('.wav')) return true;
  return /^\/images\/[^/]+\/[^/]+$/.test(src);
}

/** Joint `mediaBase` aux chemins relatifs destinés au CDN. */
export function urlMedia(src: string | undefined, mediaBase?: string): string | undefined {
  if (!src) return src;
  if (/^https?:\/\//i.test(src)) return src;
  const base = mediaBase?.replace(/\/+$/, '');
  if (!base || !estMediaDistant(src)) return src;
  return `${base}${src.startsWith('/') ? src : `/${src}`}`;
}

/** Réécrit les `src` audio / galerie vers le CDN quand `site.mediaBase` est défini. */
export function resoudreMediasDistants(config: ParcoursConfig): ParcoursConfig {
  const base = config.site.mediaBase;
  if (!base) return config;

  const audio = (ref?: AudioRef): AudioRef | undefined =>
    ref ? { ...ref, src: urlMedia(ref.src, base)! } : undefined;

  return {
    ...config,
    accueil: config.accueil
      ? {
          ...config.accueil,
          bienvenue: config.accueil.bienvenue
            ? {
                ...config.accueil.bienvenue,
                audio: audio(config.accueil.bienvenue.audio),
              }
            : config.accueil.bienvenue,
        }
      : config.accueil,
    lieux: config.lieux.map((lieu) => ({
      ...lieu,
      audio: audio(lieu.audio),
      medias: lieu.medias?.map((media) =>
        media.src ? { ...media, src: urlMedia(media.src, base) } : media,
      ),
    })),
  };
}
