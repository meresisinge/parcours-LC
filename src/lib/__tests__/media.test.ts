import { describe, expect, it } from 'vitest';
import type { MediaItem } from '../../types/parcours';
import { dureeLabel, estMediaImage, formatDuree, lienMedia } from '../media';

describe('formatDuree', () => {
  it('formate en minutes:secondes', () => {
    expect(formatDuree(0)).toBe('0:00');
    expect(formatDuree(65)).toBe('1:05');
    expect(formatDuree(204)).toBe('3:24');
  });

  it('protège des valeurs négatives', () => {
    expect(formatDuree(-5)).toBe('0:00');
  });
});

describe('dureeLabel', () => {
  it('privilégie le libellé explicite de la configuration', () => {
    expect(dureeLabel({ src: '/audio/a.mp3', duree: 600 }, '3 min')).toBe('3 min');
  });

  it("dérive le libellé de la durée de l'audio", () => {
    expect(dureeLabel({ src: '/audio/a.mp3', duree: 204 })).toBe('3 min');
  });

  it('renvoie undefined sans information de durée', () => {
    expect(dureeLabel(undefined, undefined)).toBeUndefined();
  });
});

describe('estMediaImage', () => {
  const base: MediaItem = { id: 'm', type: 'image', label: 'Photo', src: '/images/a.webp' };

  it('accepte les images et les cartes pourvues d’un fichier', () => {
    expect(estMediaImage(base)).toBe(true);
    expect(estMediaImage({ ...base, type: 'carte' })).toBe(true);
  });

  it('refuse un média sans fichier ou de type document', () => {
    expect(estMediaImage({ ...base, src: undefined })).toBe(false);
    expect(estMediaImage({ ...base, type: 'document' })).toBe(false);
  });
});

describe('lienMedia', () => {
  it('utilise url pour un lien externe, src sinon', () => {
    expect(lienMedia({ id: 'l', type: 'lien', label: 'Site', url: 'https://x.fr' })).toBe('https://x.fr');
    expect(lienMedia({ id: 'd', type: 'document', label: 'Pdf', src: '/documents/a.pdf' })).toBe(
      '/documents/a.pdf'
    );
  });
});
