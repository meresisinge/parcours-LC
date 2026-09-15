import type { AudioRef, MediaItem } from '../types/parcours';

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
