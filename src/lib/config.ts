import raw from '../content/parcours.json';
import type { Lieu, LieuResume, ParcoursConfig } from '../types/parcours';

export const config = raw as unknown as ParcoursConfig;

/** Mode maintenance actif : toutes les routes affichent la page d'attente. */
export function enMaintenance(): boolean {
  return config.maintenance?.actif === true;
}

/** Lieux actifs, triés par `ordre`. Source de vérité de la navigation du parcours. */
export function getLieux(): Lieu[] {
  return config.lieux
    .filter((lieu) => lieu.actif !== false)
    .sort((a, b) => a.ordre - b.ordre);
}

export function getLieuBySlug(slug: string): Lieu | undefined {
  return getLieux().find((lieu) => lieu.slug === slug);
}

/**
 * Voisins dans le parcours, en boucle : le dernier lieu renvoie au premier.
 * Reprend le comportement de navigation de la maquette.
 */
export function getVoisins(slug: string): { precedent: Lieu; suivant: Lieu } | undefined {
  const lieux = getLieux();
  const index = lieux.findIndex((lieu) => lieu.slug === slug);
  if (index === -1) return undefined;
  return {
    precedent: lieux[(index - 1 + lieux.length) % lieux.length]!,
    suivant: lieux[(index + 1) % lieux.length]!,
  };
}

export function toResume(lieu: Lieu): LieuResume {
  return {
    slug: lieu.slug,
    ordre: lieu.ordre,
    titre: lieu.titre,
    miniature: lieu.image.miniature ?? lieu.image.hero,
    alt: lieu.image.alt ?? lieu.titre,
  };
}

export function getResumes(): LieuResume[] {
  return getLieux().map(toResume);
}
