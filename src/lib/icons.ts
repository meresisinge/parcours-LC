/**
 * Tracés SVG des icônes de lieux (viewBox 24×24, stroke `currentColor`).
 * Données pures : consommées aussi bien par les composants Astro que par les îlots React.
 */
export const ICONES: Record<string, string> = {
  mairie: 'M4 21h16M5 21V10l7-5 7 5v11M9 21v-6h6v6',
  ecole: 'M2 9l10-5 10 5-10 5-10-5Z M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5',
  monument: 'M12 2l3 7h-6l3-7Z M9 9h6v11H9z M6 20h12',
  poste: 'M3 7l9 6 9-6 M4 5h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2z',
  culte: 'M4 21h16 M6 21V11a6 6 0 0112 0v10 M12 5V2',
  biblio: 'M4 19.5V5a2 2 0 012-2h11v15H6a2 2 0 00-2 2.5Z M8 7h6',
  rue: 'M8 2v20M8 6h9l-2 2 2 2H8',
  ccas: 'M12 20s-7-4.4-9.3-8.8C1.3 8 3 5 6.3 5c1.8 0 3.2 1 3.7 2 .5-1 1.9-2 3.7-2C17 5 18.7 8 17.3 11.2 15 15.6 12 20 12 20Z',
  salle: 'M9 18V5l11-2v13 M6 15a3 3 0 100 6 3 3 0 000-6z M17 13a3 3 0 100 6 3 3 0 000-6z',
  bus: 'M5 5h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z M3 11h18M7 17v2M17 17v2',
};

export function iconePath(icone?: string): string | undefined {
  if (!icone) return undefined;
  return ICONES[icone];
}
