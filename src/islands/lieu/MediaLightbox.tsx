import { useCallback, useEffect, useState } from 'react';
import type { MediaItem } from '../../types/parcours';
import { estMediaImage } from '../../lib/media';
import { deverrouillerScroll, verrouillerScroll } from '../../lib/scroll-lock';

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
    verrouillerScroll();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') fermer();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      deverrouillerScroll();
    };
  }, [actif, fermer]);

  if (!medias.length) return null;

  return (
    <section className="mt-13">
      <h3 className="mb-4 font-sans text-xs font-bold tracking-[0.08em] text-grey uppercase">{titre}</h3>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {medias.map((media) => {
          const image = estMediaImage(media);
          const phrase = media.label || media.alt || '';
          const contenu = (
            <>
              <span className="absolute inset-0 overflow-hidden rounded-xl">
                {image ? (
                  <img src={media.src} alt={media.alt ?? ''} className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full flex-col items-center justify-center gap-2.5 p-4">
                    <IconeDocument taille={30} />
                    <span className="text-[13.5px] leading-snug font-bold text-navy sm:text-[14.5px]">
                      {media.label}
                    </span>
                  </span>
                )}
              </span>
              {image && phrase && (
                <span
                  role="tooltip"
                  className="pointer-events-none absolute inset-x-2 bottom-2 z-20 hidden translate-y-1 rounded-lg bg-navy/92 px-2.5 py-2 text-left text-[12px] leading-snug font-semibold text-white opacity-0 shadow-[0_8px_20px_rgba(10,31,68,0.28)] backdrop-blur-sm transition-[opacity,transform] duration-200 ease-soft sm:block sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-visible:translate-y-0 sm:group-focus-visible:opacity-100"
                >
                  {phrase}
                </span>
              )}
            </>
          );

          const classes =
            'group relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border border-line bg-[#fbfcfe] text-center text-grey transition-all duration-200 ease-soft hover:-translate-y-0.5 hover:border-blue-deep hover:shadow-[0_10px_24px_rgba(10,31,68,0.1)] focus-visible:border-blue-deep';

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
        className={`fixed inset-0 z-95 flex items-center justify-center bg-navy/95 px-4 pt-18 pb-8 transition-opacity duration-250 sm:p-6 ${
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
          className="absolute top-4 right-4 flex h-11 w-11 sm:top-5 sm:right-5 cursor-pointer items-center justify-center rounded-full border border-white/40 bg-transparent text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="max-h-full w-full max-w-[min(960px,92vw)]">
          {actif && estMediaImage(actif) ? (
            <figure className="m-0">
              <img
                src={actif.src}
                alt={actif.alt ?? actif.label}
                className="mx-auto max-h-[68svh] w-auto max-w-full rounded-lg object-contain sm:max-h-[78vh]"
              />
              <figcaption className="mt-3 text-center text-[13px] font-semibold text-white">
                {actif.label}
                {actif.credit && <span className="ml-2 font-normal text-fog">{actif.credit}</span>}
              </figcaption>
            </figure>
          ) : (
            actif && (
              <div className="flex flex-col items-center gap-3.5 rounded-lg bg-white p-7 text-center sm:p-10">
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
