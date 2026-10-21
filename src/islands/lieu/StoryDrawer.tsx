import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { deverrouillerScroll, verrouillerScroll } from "../../lib/scroll-lock";

interface Props {
  titre: string;
  eyebrow: string;
  recit: string;
  /** Libellé de durée affiché en repère de lecture. */
  dureeLabel?: string;
  /** Identifiant de l'élément `<audio>` du lecteur de la page, piloté depuis l'en-tête. */
  audioId?: string;
}

const VITESSES = [1, 1.25, 0.75];

export default function StoryDrawer({
  titre,
  eyebrow,
  recit,
  dureeLabel,
  audioId,
}: Props) {
  const [ouvert, setOuvert] = useState(false);
  const declencheurRef = useRef<HTMLButtonElement>(null);
  const fermerRef = useRef<HTMLButtonElement>(null);
  const corpsRef = useRef<HTMLDivElement>(null);
  const [audioEnLecture, setAudioEnLecture] = useState(false);
  const [audioPresent, setAudioPresent] = useState(false);
  const [indexVitesse, setIndexVitesse] = useState(0);
  const vitesse = VITESSES[indexVitesse]!;

  const paragraphes = useMemo(
    () =>
      recit
        .split(/\n{2,}/)
        .map((bloc) => bloc.trim())
        .filter(Boolean),
    [recit],
  );

  // Le lecteur vit dans un autre îlot : on le pilote par son élément <audio>.
  const elementAudio = useCallback(
    () =>
      audioId
        ? (document.getElementById(audioId) as HTMLAudioElement | null)
        : null,
    [audioId],
  );

  useEffect(() => {
    const element = elementAudio();
    if (!element) return;
    setAudioPresent(true);
    setAudioEnLecture(!element.paused && !element.ended);

    const majEtat = () => setAudioEnLecture(!element.paused && !element.ended);
    const majVitesse = () => {
      const index = VITESSES.findIndex(
        (valeur) => Math.abs(valeur - element.playbackRate) < 0.01,
      );
      if (index >= 0) setIndexVitesse(index);
    };
    majVitesse();

    element.addEventListener("play", majEtat);
    element.addEventListener("pause", majEtat);
    element.addEventListener("ended", majEtat);
    element.addEventListener("ratechange", majVitesse);
    return () => {
      element.removeEventListener("play", majEtat);
      element.removeEventListener("pause", majEtat);
      element.removeEventListener("ended", majEtat);
      element.removeEventListener("ratechange", majVitesse);
    };
  }, [elementAudio, ouvert]);

  const basculerAudio = useCallback(() => {
    const element = elementAudio();
    if (!element) return;
    if (element.paused || element.ended) void element.play();
    else element.pause();
  }, [elementAudio]);

  const basculerVitesse = useCallback(() => {
    const element = elementAudio();
    if (!element) return;
    const suivant = (indexVitesse + 1) % VITESSES.length;
    element.playbackRate = VITESSES[suivant]!;
    setIndexVitesse(suivant);
  }, [elementAudio, indexVitesse]);

  const fermer = useCallback(() => {
    setOuvert(false);
    declencheurRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!ouvert) return;
    fermerRef.current?.focus();
    corpsRef.current?.scrollTo({ top: 0 });
    verrouillerScroll();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") fermer();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      deverrouillerScroll();
    };
  }, [ouvert, fermer]);

  return (
    <>
      <button
        ref={declencheurRef}
        type="button"
        onClick={() => setOuvert(true)}
        aria-expanded={ouvert}
        aria-controls="recitDrawer"
        className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-line bg-mist/60 px-4 py-3 text-left transition-colors duration-200 hover:border-blue-deep hover:bg-white"
      >
        <span className="flex items-center gap-2.5">
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 text-blue-deep"
            aria-hidden="true"
          >
            <path d="M4 19.5V5a2 2 0 012-2h11v15H6a2 2 0 00-2 2.5Z" />
            <path d="M8 7h6M8 11h6" />
          </svg>
          <span className="text-[13.5px] font-bold text-navy">
            Lire le texte du récit
          </span>
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 text-grey transition-transform duration-200 ease-soft group-hover:translate-x-0.5 group-hover:text-blue-deep"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>

      <div
        className={`fixed inset-0 z-88 bg-navy/45 backdrop-blur-[2px] transition-opacity duration-300 ease-soft ${
          ouvert ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={fermer}
        aria-hidden="true"
      />

      {/* Colonne de lecture : un seul conteneur défilant (le corps), en-tête figé. */}
      <aside
        id="recitDrawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recitTitre"
        aria-hidden={!ouvert}
        inert={!ouvert}
        className={`fixed inset-y-0 right-0 z-89 flex w-full flex-col bg-white shadow-[-18px_0_54px_rgba(10,46,68,0.22)] transition-transform duration-[420ms] ease-soft sm:w-[min(560px,92vw)] wide:w-[min(680px,52vw)] ${
          ouvert ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="shrink-0 border-b border-line bg-white/95 px-5 pt-5 pb-4 backdrop-blur-sm sm:px-9 sm:pt-7 sm:pb-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-1.5 text-[11px] font-extrabold tracking-[0.1em] text-blue-bright">
                {eyebrow}
              </div>
              <h3
                id="recitTitre"
                className="text-[22px] leading-[1.1] font-black sm:text-[27px]"
              >
                {titre}
              </h3>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {audioPresent && (
                <>
                  <button
                    type="button"
                    onClick={basculerVitesse}
                    aria-label={`Vitesse de lecture, actuellement ${vitesse}×`}
                    title={`Vitesse ${vitesse}×`}
                    className="inline-flex h-9 cursor-pointer items-center justify-center rounded-full border border-line bg-white px-3 text-[12px] font-bold text-navy transition-colors duration-200 hover:border-blue-deep"
                  >
                    {vitesse}×
                  </button>
                  <button
                    type="button"
                    onClick={basculerAudio}
                    aria-label={
                      audioEnLecture
                        ? "Mettre le récit sonore en pause"
                        : "Écouter le récit sonore"
                    }
                    title={audioEnLecture ? "Pause" : "Écouter"}
                    className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-full border-none bg-gradient-to-br from-red to-red-dark px-3 text-[11.5px] leading-[2] font-bold tracking-[0.04em] text-white uppercase transition-all duration-200 hover:from-red-dark hover:to-[#9e1e1c]"
                  >
                    {audioEnLecture ? (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="block shrink-0"
                        aria-hidden="true"
                      >
                        <rect x="6" y="5" width="4" height="14" />
                        <rect x="14" y="5" width="4" height="14" />
                      </svg>
                    ) : (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="block shrink-0"
                        aria-hidden="true"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                    {audioEnLecture ? "Pause" : "Écouter"}
                  </button>
                </>
              )}

              <button
                ref={fermerRef}
                type="button"
                onClick={fermer}
                aria-label="Fermer le texte du récit"
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-white text-grey transition-colors duration-200 hover:border-navy hover:text-navy"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
          </div>

          {dureeLabel && (
            <div className="mt-3 flex items-center gap-2 text-[11.5px] font-semibold tracking-[0.04em] text-grey uppercase">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                className="shrink-0"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
              </svg>
              {dureeLabel} de lecture
            </div>
          )}
        </header>

        <div
          ref={corpsRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-9 sm:py-8"
        >
          <div className="mx-auto max-w-[62ch]">
            {paragraphes.map((paragraphe, index) => (
              <p
                key={index}
                className={`mb-5 whitespace-pre-line text-ink last:mb-0 ${
                  index === 0
                    ? "text-[17px] leading-[1.7] font-medium text-navy"
                    : "text-[16px] leading-[1.8]"
                }`}
              >
                {paragraphe}
              </p>
            ))}
          </div>

          <div className="mx-auto mt-9 max-w-[62ch] border-t border-line pt-5">
            <button
              type="button"
              onClick={fermer}
              className="cursor-pointer border-none bg-transparent p-0 text-[13px] font-bold text-blue-deep"
            >
              ← Revenir à l&apos;écoute
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
