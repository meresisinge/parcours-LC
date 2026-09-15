import { useCallback, useEffect, useState } from 'react';
import type { MediaItem } from '../../types/parcours';
import { estMediaImage } from '../../lib/media';

interface Props {
  titre: string;
  medias: MediaItem[];
}

function IconeDocument({ taille = 26, couleur }: { taille?: number; couleur?: string }) {
  return (
    <svg
      width={taille}
      height={taille}
      viewBox="0 0 24 24"
      fill="none"
      stroke={couleur ?? 'currentColor'}
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M6 2h9l5 5v15H6z" />
      <path d="M15 2v5h5" />
    </svg>
  );
}

export default function MediaLightbox({ titre, medias }: Props) {
  const [actif, setActif] = useState<MediaItem | null>(null);

  const fermer = useCallback(() => setActif(null), []);

  useEffect(() => {
    if (!actif) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') fermer();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [actif, fermer]);

  if (!medias.length) return null;

  return (
    <section className="px-6 pt-11">
      <h3 className="mb-4 text-[17px] font-extrabold">{titre}</h3>

      <div className="grid grid-cols-2 gap-3">
        {medias.map((media) => {
          const image = estMediaImage(media);
          const contenu = (
            <>
              {image ? (
                <img src={media.src} alt={media.alt ?? ''} className="h-full w-full object-cover" />
              ) : (
                <>
                  <IconeDocument />
                  <span className="text-[11px] font-bold tracking-[0.04em]">{media.label}</span>
                </>
              )}
              {media.tag && (
                <span className="absolute top-2 left-2 rounded-[3px] bg-navy/75 px-2 py-0.5 text-[10px] font-bold tracking-[0.05em] text-white">
                  {media.tag}
                </span>
              )}
            </>
          );

          const classes =
            'relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-md border border-line bg-[#fbfcfe] p-0 text-grey';

          return media.type === 'lien' && media.url ? (
            <a
              key={media.id}
              href={media.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${classes} no-underline`}
              aria-label={`${media.label} (nouvelle fenêtre)`}
            >
              {contenu}
            </a>
          ) : (
            <button
              key={media.id}
              type="button"
              className={classes}
              onClick={() => setActif(media)}
              aria-label={`Agrandir : ${media.label}`}
            >
              {contenu}
            </button>
          );
        })}
      </div>

      <div
        className={`fixed inset-0 z-95 flex items-center justify-center bg-navy/95 p-6 transition-opacity duration-250 ${
          actif ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={actif?.label ?? 'Média'}
        aria-hidden={!actif}
        onClick={(event) => {
          if (event.target === event.currentTarget) fermer();
        }}
      >
        <button
          type="button"
          onClick={fermer}
          aria-label="Fermer"
          className="absolute top-5 right-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/40 bg-transparent text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="w-full max-w-[420px]">
          {actif && estMediaImage(actif) ? (
            <figure className="m-0">
              <img src={actif.src} alt={actif.alt ?? actif.label} className="w-full rounded-md" />
              {actif.credit && (
                <figcaption className="mt-2 text-center text-xs text-fog">{actif.credit}</figcaption>
              )}
            </figure>
          ) : (
            actif && (
              <div className="flex flex-col items-center gap-3.5 rounded-lg bg-white p-10 text-center">
                <IconeDocument taille={36} couleur="#0d47a1" />
                <div className="font-bold text-navy">{actif.label}</div>
                <span className="text-xs text-grey">
                  {actif.src ? actif.credit ?? 'Document' : 'Document à venir'}
                </span>
                {actif.src && (
                  <a
                    href={actif.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] font-bold text-blue-deep"
                  >
                    Ouvrir le document
                  </a>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
