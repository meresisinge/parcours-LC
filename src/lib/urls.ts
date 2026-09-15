/** Numéro d'épisode affiché sur deux chiffres (`1` → `01`). */
export function formatOrdre(ordre: number): string {
  return String(ordre).padStart(2, '0');
}

export function lieuPath(slug: string): string {
  return `/lieux/${slug}`;
}

/** URL absolue gravée dans le QR code du lieu. */
export function lieuUrl(slug: string, urlCanonique?: string): string {
  const base = (urlCanonique ?? '').replace(/\/+$/, '');
  return `${base}${lieuPath(slug)}`;
}

export function episodeLabel(ordre: number): string {
  return `ÉPISODE ${formatOrdre(ordre)}`;
}
