import { useEffect, useMemo, useRef, useState } from 'react';
import type { AudioRef } from '../../types/parcours';
import { formatDuree } from '../../lib/media';

interface Props {
  audio?: AudioRef;
  /** Durée affichée tant que l'audio n'est pas chargé (ou absent du contenu). */
  dureeSecondes?: number;
  titre: string;
  /** Variante compacte utilisée dans la modal de bienvenue (sans réglage de vitesse). */
  compact?: boolean;
  /** Variante mise en avant de la page épisode : lecteur plus généreux, sans cadre. */
  vedette?: boolean;
  /** Identifiant de l'élément `<audio>`, pour qu'un autre îlot puisse le piloter. */
  elementId?: string;
}

const BARRES_EPISODE = [
  8, 20, 14, 28, 10, 24, 16, 30, 12, 22, 18, 26, 9, 21, 15, 29, 11, 25, 17, 31, 13, 23, 19, 27,
];
const BARRES_COMPACT = [
  7, 18, 12, 26, 9, 22, 14, 28, 11, 20, 16, 24, 8, 19, 13, 27, 10, 23, 15, 29, 12, 21, 17, 25,
];
const VITESSES = [1, 1.25, 0.75];

export default function AudioPlayer({
  audio,
  dureeSecondes,
  titre,
  compact = false,
  vedette = false,
  elementId,
}: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [enLecture, setEnLecture] = useState(false);
  const [position, setPosition] = useState(0);
  const [duree, setDuree] = useState(dureeSecondes ?? audio?.duree ?? 0);
  const [indexVitesse, setIndexVitesse] = useState(0);

  const barres = compact ? BARRES_COMPACT : BARRES_EPISODE;
  const disponible = Boolean(audio?.src);
  const progression = duree > 0 ? Math.min(position / duree, 1) : 0;
  const vitesse = VITESSES[indexVitesse]!;

  useEffect(() => {
    const element = audioRef.current;
    if (element) element.playbackRate = vitesse;
  }, [vitesse]);

  const basculer = () => {
    const element = audioRef.current;
    if (!element) return;
    if (enLecture) {
      element.pause();
    } else {
      void element.play();
    }
  };

  const chercher = (ratio: number) => {
    const element = audioRef.current;
    if (!element || !duree) return;
    element.currentTime = ratio * duree;
    setPosition(element.currentTime);
  };

  const libelleTemps = useMemo(
    () => `${formatDuree(position)} / ${duree ? formatDuree(duree) : '--:--'}`,
    [position, duree]
  );

  return (
    <div
      className={
        vedette
          ? 'flex items-center gap-4 sm:gap-5'
          : `flex items-center gap-4 rounded-[9px] border border-line bg-[#fbfcfe] ${
              compact ? 'px-3.5 py-3' : 'px-4.5 py-4'
            }`
      }
    >
      {audio?.src && (
        <audio
          ref={audioRef}
          id={elementId}
          src={audio.src}
          preload="metadata"
          onPlay={() => setEnLecture(true)}
          onPause={() => setEnLecture(false)}
          onEnded={() => {
            setEnLecture(false);
            setPosition(0);
          }}
          onTimeUpdate={(event) => setPosition(event.currentTarget.currentTime)}
          onLoadedMetadata={(event) => {
            if (Number.isFinite(event.currentTarget.duration)) setDuree(event.currentTarget.duration);
          }}
        />
      )}

      <button
        type="button"
        onClick={basculer}
        disabled={!disponible}
        aria-label={
          disponible
            ? `${enLecture ? 'Mettre en pause' : 'Écouter'} — ${titre}`
            : `Audio à venir — ${titre}`
        }
        className={`flex shrink-0 items-center justify-center rounded-full border-none bg-blue-deep text-white transition-all duration-200 ease-soft ${
          compact ? 'h-9.5 w-9.5' : vedette ? 'h-14 w-14 shadow-[0_8px_22px_rgba(13,71,161,0.32)]' : 'h-11.5 w-11.5'
        } ${
          disponible
            ? 'cursor-pointer hover:bg-blue-bright' + (vedette ? ' hover:scale-[1.04]' : '')
            : 'cursor-not-allowed opacity-40'
        }`}
      >
        {enLecture ? (
          <svg width={vedette ? 19 : 15} height={vedette ? 19 : 15} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="6" y="5" width="4" height="14" />
            <rect x="14" y="5" width="4" height="14" />
          </svg>
        ) : (
          <svg width={vedette ? 19 : 15} height={vedette ? 19 : 15} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <div
        className={`flex min-w-0 flex-1 items-center ${
          compact ? 'h-7 gap-0.5' : vedette ? 'h-12 gap-[3px]' : 'h-9.5 gap-0.5'
        }`}
        aria-hidden="true"
      >
        {barres.map((hauteur, index) => {
          const actif = index / barres.length < progression;
          return (
            <span
              key={index}
              onClick={() => chercher(index / barres.length)}
              className={`wave-bar ${actif ? 'wave-bar--active' : ''} ${
                actif && enLecture ? 'wave-bar--playing' : ''
              } ${disponible ? 'cursor-pointer' : ''}`}
              style={{
                height: `${vedette ? Math.round(hauteur * 1.35) : hauteur}px`,
                animationDelay: actif && enLecture ? `${(index % 4) * 0.08}s` : undefined,
              }}
            />
          );
        })}
      </div>

      <div
        className={`shrink-0 font-semibold text-grey tabular-nums ${
          vedette ? 'text-[13px] text-navy' : 'text-xs'
        }`}
      >
        {libelleTemps}
      </div>

      {!compact && (
        <button
          type="button"
          onClick={() => setIndexVitesse((index) => (index + 1) % VITESSES.length)}
          disabled={!disponible}
          aria-label={`Vitesse de lecture, actuellement ${vitesse}×`}
          className={`shrink-0 rounded-[20px] border border-line bg-white font-bold text-navy transition-colors duration-200 ${
            vedette ? 'px-3 py-2 text-[12.5px]' : 'px-2.5 py-1.5 text-xs'
          } ${
            disponible ? 'cursor-pointer hover:border-blue-deep' : 'cursor-not-allowed opacity-40'
          }`}
        >
          {vitesse}×
        </button>
      )}
    </div>
  );
}
