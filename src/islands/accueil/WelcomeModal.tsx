import { useCallback, useEffect, useRef, useState } from 'react';
import type { Bienvenue } from '../../types/parcours';
import AudioPlayer from '../lieu/AudioPlayer';
import { deverrouillerScroll, verrouillerScroll } from '../../lib/scroll-lock';

interface Props {
  bienvenue: Bienvenue;
  /** Ancre du bouton d'action (section parcours de l'accueil). */
  cible?: string;
}

const CLE_SESSION = 'lc:bienvenue-vue';

export default function WelcomeModal({ bienvenue, cible = '#parcours' }: Props) {
  const [ouvert, setOuvert] = useState(false);
  const fermerRef = useRef<HTMLButtonElement>(null);
  const precedemmentFocus = useRef<HTMLElement | null>(null);

  const fermer = useCallback(() => {
    setOuvert(false);
    precedemmentFocus.current?.focus();
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem(CLE_SESSION)) return;
    const timer = window.setTimeout(() => {
      precedemmentFocus.current = document.activeElement as HTMLElement | null;
      sessionStorage.setItem(CLE_SESSION, '1');
      setOuvert(true);
    }, 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ouvert) return;
    fermerRef.current?.focus();
    verrouillerScroll();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') fermer();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      deverrouillerScroll();
    };
  }, [ouvert, fermer]);

  return (
    <div
      className={`fixed inset-0 z-90 flex items-center justify-center overflow-y-auto bg-navy/55 p-4 transition-opacity duration-400 ease-soft sm:p-6 ${
        ouvert ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bienvenueTitre"
      aria-hidden={!ouvert}
      onClick={(event) => {
        if (event.target === event.currentTarget) fermer();
      }}
    >
      <div
        className={`relative my-auto w-full max-w-[440px] rounded-2xl bg-white px-5 pt-7 pb-6 shadow-[0_30px_60px_rgba(10,31,68,.35)] transition-[transform,opacity] duration-400 ease-soft sm:rounded-[10px] sm:px-8 sm:pt-9 sm:pb-7 ${
          ouvert ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-[.98] opacity-0'
        }`}
      >
        <button
          ref={fermerRef}
          type="button"
          onClick={fermer}
          aria-label="Fermer la présentation"
          className="absolute top-3 right-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-line bg-white text-grey"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {bienvenue.badge && (
          <span className="mb-4 inline-block rounded-full bg-blue-deep px-3.5 py-2 text-[11px] font-bold tracking-[0.03em] text-white">
            {bienvenue.badge}
          </span>
        )}

        {bienvenue.titre && (
          <h3 id="bienvenueTitre" className="mb-2.5 pr-10 text-[21px] leading-tight font-black sm:text-2xl">
            {bienvenue.titre}
          </h3>
        )}

        {bienvenue.texte && (
          <p className="mb-4.5 text-[14.5px] leading-relaxed text-ink">{bienvenue.texte}</p>
        )}

        <div className="mb-5">
          <AudioPlayer
            compact
            audio={bienvenue.audio}
            titre={bienvenue.audio?.titre ?? 'Introduction'}
            dureeSecondes={bienvenue.audio?.duree}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={cible}
            onClick={fermer}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full bg-red px-5 py-3.5 text-[13px] font-bold text-white no-underline hover:bg-red-dark sm:w-auto sm:py-3"
          >
            {bienvenue.ctaLabel ?? 'Découvrir le parcours'}
          </a>
        </div>
      </div>
    </div>
  );
}
