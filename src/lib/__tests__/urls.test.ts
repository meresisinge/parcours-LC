import { describe, expect, it } from 'vitest';
import { episodeLabel, formatOrdre, lieuPath, lieuUrl } from '../urls';

describe('formatOrdre', () => {
  it('complète sur deux chiffres', () => {
    expect(formatOrdre(1)).toBe('01');
    expect(formatOrdre(10)).toBe('10');
  });
});

describe('lieuPath', () => {
  it('construit le chemin gravé dans le QR code', () => {
    expect(lieuPath('mairie')).toBe('/lieux/mairie');
  });
});

describe('lieuUrl', () => {
  it('assemble une URL absolue', () => {
    expect(lieuUrl('ecole', 'https://exemple.fr')).toBe('https://exemple.fr/lieux/ecole');
  });

  it("supprime les barres obliques finales de l'origine", () => {
    expect(lieuUrl('ecole', 'https://exemple.fr//')).toBe('https://exemple.fr/lieux/ecole');
  });

  it('retombe sur un chemin relatif sans origine', () => {
    expect(lieuUrl('ecole')).toBe('/lieux/ecole');
  });
});

describe('episodeLabel', () => {
  it("formate le sur-titre de l'épisode", () => {
    expect(episodeLabel(3)).toBe('ÉPISODE 03');
  });
});
