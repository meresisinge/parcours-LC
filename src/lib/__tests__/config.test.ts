import { describe, expect, it } from 'vitest';
import { config, getLieuBySlug, getLieux, getResumes, getVoisins } from '../config';

describe('getLieux', () => {
  const lieux = getLieux();

  it('renvoie les lieux actifs triés par ordre', () => {
    expect(lieux.length).toBeGreaterThan(0);
    expect(lieux.map((lieu) => lieu.ordre)).toEqual([...lieux.map((l) => l.ordre)].sort((a, b) => a - b));
    expect(lieux.every((lieu) => lieu.actif !== false)).toBe(true);
  });

  it('expose des slugs uniques — un slug = un QR code', () => {
    const slugs = lieux.map((lieu) => lieu.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('getLieuBySlug', () => {
  it('retrouve un lieu par son slug', () => {
    expect(getLieuBySlug('mairie')?.titre).toBe('La Mairie');
  });

  it('renvoie undefined pour un slug inconnu', () => {
    expect(getLieuBySlug('slug-inexistant')).toBeUndefined();
  });
});

describe('getVoisins', () => {
  const lieux = getLieux();
  const premier = lieux[0]!;
  const dernier = lieux[lieux.length - 1]!;

  it('boucle du dernier lieu vers le premier', () => {
    expect(getVoisins(dernier.slug)?.suivant.slug).toBe(premier.slug);
    expect(getVoisins(premier.slug)?.precedent.slug).toBe(dernier.slug);
  });

  it('renvoie undefined hors parcours', () => {
    expect(getVoisins('slug-inexistant')).toBeUndefined();
  });
});

describe('getResumes', () => {
  it('fournit une miniature pour chaque lieu', () => {
    expect(getResumes().every((resume) => resume.miniature.length > 0)).toBe(true);
  });
});

describe('config', () => {
  it('déclare la version de format attendue', () => {
    expect(config.version).toBe(1);
  });
});
