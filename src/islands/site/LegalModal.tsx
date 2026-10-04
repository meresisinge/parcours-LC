import { useCallback, useEffect, useRef, useState } from 'react';
import { deverrouillerScroll, verrouillerScroll } from '../../lib/scroll-lock';
import type { MentionsSection } from '../../types/parcours';

interface Props {
  titre: string;
  sections: MentionsSection[];
  declencheurLabel: string;
}

export default function LegalModal({ titre, sections, declencheurLabel }: Props) {
  const [ouvert, setOuvert] = useState(false);
  const declencheurRef = useRef<HTMLButtonElement>(null);
  const fermerRef = useRef<HTMLButtonElement>(null);

  const fermer = useCallback(() => {
    setOuvert(false);
    declencheurRef.current?.focus();
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
    <>
      <button
        ref={declencheurRef}
        type="button"
        className="cursor-pointer border-none bg-transparent p-0 text-xs font-semibold text-grey hover:text-navy"
        onClick={() => setOuvert(true)}
      >
        {declencheurLabel}
      </button>

      <div
        className={`fixed inset-0 z-90 flex items-center justify-center bg-navy/55 p-4 transition-opacity duration-400 ease-soft sm:p-6 ${
          ouvert ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={(event) => {
          if (event.target === event.currentTarget) fermer();
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mentionsTitre"
        aria-hidden={!ouvert}
      >
        <div
          className={`relative w-full max-w-[440px] rounded-2xl bg-white px-5 pt-7 pb-6 sm:rounded-[10px] sm:px-8 sm:pt-9 sm:pb-7 shadow-[0_30px_60px_rgba(10,31,68,.35)] transition-[transform,opacity] duration-400 ease-soft ${
            ouvert ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-[.98] opacity-0'
          }`}
        >
          <button
            ref={fermerRef}
            type="button"
            className="absolute top-3 right-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-line bg-white text-grey"
            onClick={fermer}
            aria-label="Fermer les mentions légales"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <h3 id="mentionsTitre" className="mb-2.5 pr-10 text-[19px] font-black">
            {titre}
          </h3>

          <div className="max-h-[58svh] overflow-y-auto overscroll-contain text-[13.5px] leading-relaxed text-ink">
            {sections.map((section) => (
              <section key={section.titre}>
                <h4 className="mt-4 mb-1.5 text-[13px] font-bold">{section.titre}</h4>
                {section.paragraphes.map((paragraphe, index) => (
                  <p key={index} className="mb-1">
                    {paragraphe}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
