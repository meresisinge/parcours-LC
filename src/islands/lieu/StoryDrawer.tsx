import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  titre: string;
  eyebrow: string;
  recit: string;
}

export default function RecitDrawer({ titre, eyebrow, recit }: Props) {
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
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') fermer();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [ouvert, fermer]);

  return (
    <>
      <button
        ref={declencheurRef}
        type="button"
        onClick={() => setOuvert(true)}
        aria-expanded={ouvert}
        aria-controls="recitDrawer"
        className="mt-4.5 flex cursor-pointer items-center gap-2 border-none bg-transparent p-0 text-[13.5px] font-bold text-blue-deep"
      >
        <span>Lire le texte du récit</span>
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          className={`transition-transform duration-250 ease-soft ${ouvert ? 'rotate-90' : ''}`}
          aria-hidden="true"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      <div
        className={`fixed inset-0 z-88 bg-navy/40 transition-opacity duration-300 ease-soft ${
          ouvert ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={fermer}
        aria-hidden="true"
      />

      <aside
        id="recitDrawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recitTitre"
        aria-hidden={!ouvert}
        className={`fixed inset-y-0 right-0 z-89 w-[min(440px,100vw)] overflow-y-auto bg-white px-5.5 py-6.5 shadow-[-16px_0_44px_rgba(10,31,68,.2)] transition-transform duration-[380ms] ease-soft sm:px-8 sm:py-9 ${
          ouvert ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          ref={fermerRef}
          type="button"
          onClick={fermer}
          aria-label="Fermer le texte du récit"
          className="absolute top-3.5 right-3.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-line bg-white text-grey"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="mb-2 text-xs font-extrabold tracking-[0.1em] text-blue-bright">{eyebrow}</div>
        <h3 id="recitTitre" className="mb-5.5 pr-9 text-[23px] leading-[1.05] font-black sm:text-[26px]">
          {titre}
        </h3>
        <div className="text-[15.5px] leading-[1.75] whitespace-pre-line text-ink">{recit}</div>
      </aside>
    </>
  );
}
