import { useState } from 'react';
import type { Diorama } from '../../types/parcours';
import { iconePath } from '../../lib/icons';
import { formatOrdre, lieuPath } from '../../lib/urls';

/** Projection d'un lieu limitée à ce dont l'explorateur a besoin. */
export interface LieuExplorateur {
  slug: string;
  ordre: number;
  titre: string;
  accroche: string;
  icone?: string;
  dureeLabel?: string;
  focus?: { x: number; y: number; zoom?: number };
}

interface Props {
  lieux: LieuExplorateur[];
  diorama?: Diorama;
  nom: string;
  tagline: string;
}

const ZOOM_DEFAUT = 2.6;

export default function ParcoursExplorer({ lieux, diorama, nom, tagline }: Props) {
  const [slugActif, setSlugActif] = useState(lieux[0]?.slug ?? '');
  const actif = lieux.find((lieu) => lieu.slug === slugActif) ?? lieux[0];

  if (!actif) return null;

  const focus = actif.focus;
  const zoom = focus?.zoom ?? ZOOM_DEFAUT;
  // Recentre l'illustration sur le point du lieu, puis zoome dessus.
  const transformCamera = focus
    ? `scale(${zoom}) translate(${(0.5 - focus.x) * 100}%, ${(0.5 - focus.y) * 100}%)`
    : undefined;

  const [premier, ...reste] = nom.split(' ');
  const second = reste.join(' ');
  const chemin = iconePath(actif.icone);

  return (
    <div className="mx-auto grid max-w-[520px] grid-cols-1 items-center gap-8 px-5 wide:max-w-[1320px] wide:grid-cols-[270px_1fr_260px] wide:px-10">
      <div className="flex min-w-0 flex-col items-center text-center wide:items-start wide:text-left">
        <h2 className="text-[clamp(30px,3.4vw,44px)] leading-[0.96] font-black">
          <span className="text-navy">{premier}</span>
          {second && (
            <>
              <br />
              <span className="text-blue-bright">{second}</span>
            </>
          )}
        </h2>
        <div className="my-3.5 h-1 w-14 bg-red" aria-hidden="true" />
        <p className="mb-4.5 max-w-[260px] text-[14.5px] leading-normal font-medium text-grey">
          {tagline}
        </p>

        <nav className="w-full" aria-label="Liste des lieux du parcours">
          <ol className="m-0 flex list-none flex-row flex-wrap justify-center gap-1.5 p-0 wide:flex-col wide:flex-nowrap wide:justify-start wide:gap-0.5">
            {lieux.map((lieu) => {
              const estActif = lieu.slug === actif.slug;
              return (
                <li key={lieu.slug}>
                  <button
                    type="button"
                    onClick={() => setSlugActif(lieu.slug)}
                    aria-current={estActif ? 'true' : undefined}
                    className={`flex w-full cursor-pointer items-baseline gap-3 rounded-md border-none px-2.5 py-2 text-left ${
                      estActif ? 'bg-[#eaf1fb]' : 'bg-transparent hover:bg-mist'
                    }`}
                  >
                    <span
                      className={`min-w-5 font-display text-[13px] font-extrabold ${
                        estActif ? 'text-red' : 'text-grey'
                      }`}
                    >
                      {formatOrdre(lieu.ordre)}
                    </span>
                    <span
                      className={`text-sm ${
                        estActif ? 'font-bold text-blue-deep' : 'font-semibold text-navy'
                      }`}
                    >
                      {lieu.titre}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      <div className="flex w-full min-w-0 flex-col items-center gap-4">
        <div
          className="relative aspect-[1400/933] w-full max-w-[680px] min-w-0 overflow-hidden rounded-[18px] bg-mist"
          aria-label="Illustration du parcours, le lieu sélectionné est mis en lumière"
        >
          <div className="diorama-camera" style={{ transform: transformCamera }}>
            {diorama?.image && (
              <>
                <img
                  className="diorama-img diorama-img--neutre"
                  src={diorama.imageNeutre ?? diorama.image}
                  alt=""
                  aria-hidden="true"
                />
                <img
                  className={`diorama-img diorama-img--couleur ${focus ? 'is-focused' : ''}`}
                  src={diorama.image}
                  alt={diorama.alt ?? ''}
                  style={
                    focus
                      ? ({
                          '--fx': `${focus.x * 100}%`,
                          '--fy': `${focus.y * 100}%`,
                        } as React.CSSProperties)
                      : undefined
                  }
                />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex min-w-0 justify-center">
        <div className="w-full max-w-full rounded-xl border border-line bg-[#fbfcfe] px-5 pt-5.5 pb-5 wide:max-w-[260px]">
          <div className="mb-4 flex items-center justify-between">
            <span className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg bg-mist text-red">
              {chemin && (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={chemin} />
                </svg>
              )}
            </span>
            <span className="font-display text-sm font-extrabold tracking-[0.04em]">
              <span className="text-red">{formatOrdre(actif.ordre)}</span>{' '}
              <span className="text-grey">/ {lieux.length}</span>
            </span>
          </div>

          <h3 className="mb-2.5 text-[21px] font-black text-navy">{actif.titre}</h3>
          <p className="mb-4.5 text-[13.5px] leading-relaxed text-ink">{actif.accroche}</p>

          <a
            href={lieuPath(actif.slug)}
            className="mb-4.5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-red px-5 py-3 text-[13px] font-bold text-white no-underline hover:bg-red-dark"
          >
            Découvrir la piste
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>

          {actif.dureeLabel && (
            <div className="flex items-center gap-2.5 text-grey">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="shrink-0"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
              </svg>
              <div>
                <div className="text-[13px] font-bold text-navy">{actif.dureeLabel}</div>
                <div className="text-[11px] text-grey">Durée moyenne</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
