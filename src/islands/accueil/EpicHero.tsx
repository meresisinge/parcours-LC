import { useEffect, useRef, useState } from 'react';

interface Props {
  images: { back?: string; mid?: string; front?: string };
  eyebrow?: string;
  nom: string;
  tagline: string;
  badge?: string;
}

/** Fraction de la piste scrollée au-delà de laquelle le titre s'efface. */
const FIN_TITRE = 0.7;

/**
 * Hauteur de scroll supplémentaire pendant laquelle la scène reste épinglée,
 * en plus du premier écran. La maquette utilisait 140vh : on raccourcit la
 * respiration verticale pour atteindre le seuil plus tôt.
 */
const PISTE_SUPPLEMENTAIRE = '90svh';

/**
 * Amplitude de rotation de la scène sur la piste, en degrés. Cumulée au
 * balancement (±20°), elle reste sous 90° : les calques ne passent jamais de dos.
 */
const ROTATION_MAX = 60;

/**
 * Fenêtres de disparition (fractions de la piste), du plus petit tableau au
 * plus grand : le dernier s'efface juste avant la fin de la piste.
 */
const SORTIES = {
  front: [0.15, 0.45],
  mid: [0.35, 0.7],
  back: [0.6, 1],
} as const;

/** Progression locale 0 → 1 dans une fenêtre, adoucie (ease-in-out). */
function fenetre(p: number, [debut, fin]: readonly [number, number]): number {
  const t = Math.min(Math.max((p - debut) / (fin - debut), 0), 1);
  return t * t * (3 - 2 * t);
}

export default function EpicHero({ images, eyebrow, nom, tagline, badge }: Props) {
  const pisteRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const [titreVisible, setTitreVisible] = useState(true);

  useEffect(() => {
    const piste = pisteRef.current;
    if (!piste) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onScroll = () => {
      const rect = piste.getBoundingClientRect();
      const amplitude = Math.max(piste.offsetHeight - window.innerHeight, 1);
      const parcouru = Math.min(Math.max(-rect.top, 0), amplitude);
      const progression = parcouru / amplitude;

      setTitreVisible(progression < FIN_TITRE);

      if (!reduceMotion && sceneRef.current) {
        sceneRef.current.style.transform = `rotateY(${progression * ROTATION_MAX}deg) rotateX(-4deg)`;
        // Layers drift apart in depth as the visitor scrolls (see .scene3d-layer in global.css).
        sceneRef.current.style.setProperty('--ecart', progression.toFixed(3));
        // Each layer vanishes in turn, smallest first (see .scene3d-layer--* in global.css).
        for (const [calque, plage] of Object.entries(SORTIES)) {
          sceneRef.current.style.setProperty(`--sortie-${calque}`, fenetre(progression, plage).toFixed(3));
        }
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const [premier, ...reste] = nom.split(' ');
  const second = reste.join(' ');

  return (
    <div
      ref={pisteRef}
      className="relative min-h-[calc(100svh+140px)]"
      style={{ height: `calc(100svh + ${PISTE_SUPPLEMENTAIRE})` }}
    >
      <div className="shell-x pointer-events-none sticky top-0 z-5 mx-auto flex h-[100svh] max-w-shell flex-col items-center justify-center gap-7 pt-16 pb-10 wide:flex-row wide:gap-14 wide:pt-0 wide:pb-0">
        <div className="scene3d">
          <div ref={sceneRef} className="scene3d-inner">
            <div className="scene3d-balancement">
              {images.back && (
                <div className="scene3d-layer scene3d-layer--back">
                  <img src={images.back} alt="" />
                </div>
              )}
              {images.mid && (
                <div className="scene3d-layer scene3d-layer--mid">
                  <img src={images.mid} alt="" />
                </div>
              )}
              {images.front && (
                <div className="scene3d-layer scene3d-layer--front">
                  <img src={images.front} alt="" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className={`w-full max-w-[460px] text-left transition-[opacity,transform] duration-600 ease-soft ${
            titreVisible ? 'pointer-events-auto translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          {eyebrow && <div className="eyebrow mb-3">{eyebrow}</div>}
          <h1 className="text-[clamp(32px,6.4vw,68px)] leading-[0.94] font-black">
            <span className="text-navy">{premier}</span>
            {second && (
              <>
                <br />
                <span className="text-blue-bright">{second}</span>
              </>
            )}
          </h1>
          <div className="my-4 h-1 w-14 bg-red" aria-hidden="true" />
          <p className="mb-4 font-serif text-[clamp(15px,2vw,20px)] font-medium text-ink italic">
            {tagline}
          </p>
          {badge && (
            <span className="inline-block rounded-full bg-blue-deep px-3.5 py-2 text-[11px] font-bold tracking-[0.03em] text-white">
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
