import { describe, expect, it } from 'vitest';
import type { MediaItem, ParcoursConfig } from '../../types/parcours';
import {
  dureeLabel,
  estMediaDistant,
  estMediaImage,
  formatDuree,
  lienMedia,
  resoudreMediasDistants,
  urlMedia,
} from '../media';

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

describe('estMediaDistant / urlMedia', () => {
  const base = 'https://media.meresis.dev';

  it('détecte les audios wav et les images de galerie', () => {
    expect(estMediaDistant('/audio/mairie.wav')).toBe(true);
    expect(estMediaDistant('/images/mairie/anicet-le-pors.jpg')).toBe(true);
    expect(estMediaDistant('/images/mairie.webp')).toBe(false);
    expect(estMediaDistant('/audio/intro.m4a')).toBe(false);
  });

  it('préfixe uniquement les médias distants', () => {
    expect(urlMedia('/audio/mairie.wav', base)).toBe('https://media.meresis.dev/audio/mairie.wav');
    expect(urlMedia('/images/mairie.webp', base)).toBe('/images/mairie.webp');
    expect(urlMedia('https://cdn.example/a.wav', base)).toBe('https://cdn.example/a.wav');
  });
});

describe('resoudreMediasDistants', () => {
  it('réécrit audio et galerie quand mediaBase est défini', () => {
    const raw = {
      version: 1 as const,
      site: { nom: 'T', langue: 'fr', tagline: 't', descriptionSeo: 'd', mediaBase: 'https://media.meresis.dev' },
      lieux: [
        {
          id: 'mairie',
          slug: 'mairie',
          ordre: 1,
          titre: 'Mairie',
          accroche: 'a',
          recit: 'r',
          image: { hero: '/images/mairie.webp' },
          audio: { src: '/audio/mairie.wav' },
          medias: [{ id: 'm1', type: 'image' as const, label: 'Doc', src: '/images/mairie/doc.jpg' }],
        },
      ],
    } satisfies ParcoursConfig;

    const resolved = resoudreMediasDistants(raw);
    expect(resolved.lieux[0]!.audio!.src).toBe('https://media.meresis.dev/audio/mairie.wav');
    expect(resolved.lieux[0]!.medias![0]!.src).toBe('https://media.meresis.dev/images/mairie/doc.jpg');
    expect(resolved.lieux[0]!.image.hero).toBe('/images/mairie.webp');
  });
});
