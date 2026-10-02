/**
 * Verrou de défilement du document, partagé par les surcouches (tiroir du récit,
 * visionneuse de médias) : évite le double défilement quand une modale est ouverte.
 * Compteur de références pour supporter deux surcouches imbriquées.
 */
let references = 0;
let paddingInitial = '';

export function verrouillerScroll(): void {
  if (typeof document === 'undefined') return;
  references += 1;
  if (references > 1) return;

  const corps = document.body;
  // Compense la disparition de l'ascenseur pour éviter un saut horizontal.
  const largeurAscenseur = window.innerWidth - document.documentElement.clientWidth;
  paddingInitial = corps.style.paddingRight;
  corps.style.overflow = 'hidden';
  if (largeurAscenseur > 0) corps.style.paddingRight = `${largeurAscenseur}px`;
}

export function deverrouillerScroll(): void {
  if (typeof document === 'undefined') return;
  references = Math.max(0, references - 1);
  if (references > 0) return;

  const corps = document.body;
  corps.style.overflow = '';
  corps.style.paddingRight = paddingInitial;
}
