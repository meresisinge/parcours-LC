import { useRef, useState } from 'react';
import type { Diorama } from '../../types/parcours';
import { iconePath } from '../../lib/icons';
import { formatOrdre, lieuPath } from '../../lib/urls';

/** Projection d'un lieu limitée à ce dont l'explorateur a besoin. */
export interface PlaceExplorerItem {
  slug: string;
  ordre: number;
  titre: string;
  accroche: string;
  icone?: string;
  dureeLabel?: string;
  focus?: { x: number; y: number; zoom?: number };
}

interface Props {
  lieux: PlaceExplorerItem[];
  diorama?: Diorama;
  nom: string;
  tagline: string;
}

const ZOOM_DEFAUT = 2.6;
const LARGEUR_PANNEAU = '260px';

export default function TrailExplorer({ lieux, diorama, nom, tagline }: Props) {
  const [slugActif, setSlugActif] = useState<string | null>(null);
  const actif = slugActif ? lieux.find((lieu) => lieu.slug === slugActif) : undefined;

  // Le dernier lieu sélectionné reste monté le temps de la fermeture du panneau.
  const dernier = useRef<PlaceExplorerItem | undefined>(undefined);
  if (actif) dernier.current = actif;
  const carte = actif ?? dernier.current;

  const focus = carte?.focus;
  const zoom = actif?.focus?.zoom ?? ZOOM_DEFAUT;
  // Recentre l'illustration sur le point du lieu, puis zoome dessus.
  const transformCamera =
    actif && actif.focus
      ? `scale(${zoom}) translate(${(0.5 - actif.focus.x) * 100}%, ${(0.5 - actif.focus.y) * 100}%)`
      : undefined;

  const [premier, ...reste] = nom.split(' ');
  const second = reste.join(' ');
  const chemin = carte ? iconePath(carte.icone) : undefined;

  const selectionner = (slug: string) => setSlugActif((precedent) => (precedent === slug ? null : slug));

  return (
    <div className="shell-x mx-auto max-w-[520px] wide:max-w-shell">
      {/* Marge nulle en vue d'ensemble (tout est aligné), elle s'ouvre
          doucement dès qu'une étape est sélectionnée. */}
      <header
        className={`flex flex-col items-center gap-4 text-center transition-[margin] duration-500 ease-soft wide:flex-row wide:items-end wide:justify-between wide:text-left ${
          actif ? 'mb-6 wide:mb-8' : 'mb-0'
        }`}
      >
        <div className="flex flex-col items-center wide:items-start">
          <h2 className="text-[clamp(30px,3.4vw,44px)] leading-[0.96] font-black">
            <span className="text-navy">{premier}</span>
            {second && (
              <>
                {' '}
                <span className="text-blue-bright">{second}</span>
              </>
            )}
          </h2>
          <div className="my-3.5 h-1 w-14 bg-red" aria-hidden="true" />
          <p className="max-w-[420px] text-[14.5px] leading-normal font-medium text-grey">{tagline}</p>
        </div>

        <button
          type="button"
          onClick={() => setSlugActif(null)}
          tabIndex={actif ? 0 : -1}
          aria-hidden={actif ? undefined : 'true'}
          className={`cursor-pointer rounded-full border border-line bg-mist px-3.5 py-2 text-[11px] font-bold tracking-[0.03em] text-navy uppercase transition-all duration-300 ease-soft hover:border-blue-deep hover:bg-white ${
            actif ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'
          }`}
        >
          Voir l&apos;image entière
        </button>
      </header>

      <div
        className="trail-grid"
        style={{ '--panel-w': actif ? LARGEUR_PANNEAU : '0px' } as React.CSSProperties}
      >
        <div className="trail-list flex min-w-0 flex-col items-center text-center wide:items-start wide:text-left">
          <p
            className={`mb-2.5 hidden items-center gap-2 text-[11px] font-bold tracking-[0.08em] uppercase transition-colors duration-300 wide:flex ${
              actif ? 'text-grey' : 'text-blue-deep'
            }`}
          >
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                actif ? 'bg-fog' : 'animate-pulse bg-red'
              }`}
            />
            Sélectionnez une étape
          </p>

          <nav className="w-full" aria-label="Liste des lieux du parcours">
            <ol className="m-0 flex list-none flex-row flex-wrap justify-center gap-1.5 p-0 wide:flex-col wide:flex-nowrap wide:justify-start wide:gap-0.5">
              {lieux.map((lieu) => {
                const estActif = lieu.slug === slugActif;
                return (
                  <li key={lieu.slug}>
                    <button
                      type="button"
                      onClick={() => selectionner(lieu.slug)}
                      aria-current={estActif ? 'true' : undefined}
                      className={`group flex w-full cursor-pointer items-baseline gap-2.5 rounded-lg border-none px-3 py-2.5 text-left transition-colors duration-200 wide:gap-3 wide:px-2.5 wide:py-2 ${
                        estActif ? 'bg-[#eaf1fb]' : 'bg-transparent hover:bg-mist'
                      }`}
                    >
                      <span
                        className={`min-w-5 font-display text-[13px] font-extrabold transition-colors duration-200 ${
                          estActif ? 'text-red' : 'text-grey'
                        }`}
                      >
                        {formatOrdre(lieu.ordre)}
                      </span>
                      <span
                        className={`text-sm transition-colors duration-200 ${
                          estActif ? 'font-bold text-blue-deep' : 'font-semibold text-navy'
                        }`}
                      >
                        {lieu.titre}
                      </span>
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className={`ml-auto hidden shrink-0 transition-all duration-200 wide:block ${
                          estActif
                            ? 'translate-x-0 text-red opacity-100'
                            : '-translate-x-1 text-grey opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                        }`}
                      >
                        <path d="M9 6l6 6-6 6" />
                      </svg>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        {/* Cadre étiré sur la hauteur de la ligne ; la scène garde le ratio
            exact de l'illustration, donc les repères restent alignés. */}
        <div className="diorama-frame flex w-full min-w-0 items-center wide:col-start-2">
          <div
            className="relative aspect-[1400/933] w-full overflow-hidden rounded-[18px] bg-mist"
            aria-label={
              actif
                ? 'Illustration du parcours, le lieu sélectionné est mis en lumière'
                : 'Illustration complète du parcours — sélectionnez une étape dans la liste'
            }
          >
            {diorama?.image && (
              <>
                <div className="diorama-camera" style={{ transform: transformCamera }}>
                  <img className="diorama-img" src={diorama.image} alt={diorama.alt ?? ''} />
                  <img
                    className={`diorama-img diorama-img--neutre ${actif ? 'is-focused' : ''} ${
                      diorama.imageNeutre ? '[filter:none]' : ''
                    }`}
                    src={diorama.imageNeutre ?? diorama.image}
                    alt=""
                    aria-hidden="true"
                    style={
                      focus
                        ? ({
                            '--fx': `${focus.x * 100}%`,
                            '--fy': `${focus.y * 100}%`,
                          } as React.CSSProperties)
                        : undefined
                    }
                  />
                </div>

                {/* Repères cliquables : invitent au geste tant qu'aucune étape n'est choisie. */}
                <div className="diorama-pois" data-dim={actif ? 'true' : 'false'} aria-hidden="true">
                  {lieux.map(
                    (lieu, index) =>
                      lieu.focus && (
                        <button
                          key={lieu.slug}
                          type="button"
                          tabIndex={-1}
                          onClick={() => selectionner(lieu.slug)}
                          title={lieu.titre}
                          className="diorama-poi flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-red font-display text-[11px] font-extrabold text-white shadow-[0_3px_10px_rgb(10_31_68/0.35)] hover:bg-red-dark wide:h-6 wide:w-6 wide:text-[10px]"
                          style={
                            {
                              left: `${lieu.focus.x * 100}%`,
                              top: `${lieu.focus.y * 100}%`,
                              '--poi-delay': `${index * 0.22}s`,
                            } as React.CSSProperties
                          }
                        >
                          {formatOrdre(lieu.ordre)}
                        </button>
                      ),
                  )}
                </div>

                {/* Invitation flottante, effacée dès qu'une étape est sélectionnée. */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-x-0 bottom-3 flex justify-center transition-all duration-400 ease-soft ${
                    actif ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
                  }`}
                >
                  <span className="flex items-center gap-2 rounded-full bg-navy/85 px-3.5 py-2 text-[11px] font-bold tracking-[0.04em] text-white uppercase backdrop-blur-sm">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0"
                    >
                      <path d="M9 11.5V5a1.8 1.8 0 013.6 0v6M12.6 11V9.2a1.8 1.8 0 013.6 0V11M16.2 11.2V10a1.8 1.8 0 013.6 0v4.5A6.5 6.5 0 0113.3 21h-1a5 5 0 01-3.6-1.6L5 15.6a1.9 1.9 0 012.7-2.6L9 14" />
                    </svg>
                    Sélectionnez une étape
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div
          className={`trail-panel w-full min-w-0 wide:col-start-3 ${actif ? 'is-open' : ''}`}
          aria-hidden={actif ? undefined : 'true'}
        >
          <div className="h-full min-h-0 overflow-hidden">
            {carte && (
              <div className="flex h-full w-full flex-col rounded-xl border border-line bg-[#fbfcfe] px-5 pt-5.5 pb-5">
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
                    <span className="text-red">{formatOrdre(carte.ordre)}</span>{' '}
                    <span className="text-grey">/ {lieux.length}</span>
                  </span>
                </div>

                <h3 className="mb-2.5 text-[21px] font-black text-navy">{carte.titre}</h3>
                <p className="mb-4.5 flex-1 text-[13.5px] leading-relaxed text-ink">{carte.accroche}</p>

                <a
                  href={lieuPath(carte.slug)}
                  tabIndex={actif ? 0 : -1}
                  className="cta-attention mb-4.5 flex w-full cursor-pointer items-center justify-center rounded-full bg-red px-5 py-3 text-[13px] font-bold text-white no-underline transition-colors hover:bg-red-dark"
                >
                  <span className="relative z-10 inline-flex items-center gap-1.5">
                    <span className="cta-attention-label" data-text="Découvrir la piste">
                      Découvrir la piste
                    </span>
                    <svg
                      className="h-4 w-4 shrink-0 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m9 6 6 6-6 6" />
                    </svg>
                  </span>
                </a>

                {carte.dureeLabel && (
                  <div className="mt-auto flex items-center gap-2.5 text-grey">
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
                      <div className="text-[13px] font-bold text-navy">{carte.dureeLabel}</div>
                      <div className="text-[11px] text-grey">Durée moyenne</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
