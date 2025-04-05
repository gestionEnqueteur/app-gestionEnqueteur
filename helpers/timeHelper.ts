/**
 * Calcule la différence en millisecondes entre deux dates.
 * @param timeA - Heure de départ
 * @param timeB - Heure d’arrivée
 * @returns number - Différence en millisecondes (timeB - timeA)
 */
export function calculDifferenceTime(timeA: Date, timeB: Date): number {
  return timeB.getTime() - timeA.getTime();
}

/**
 * Convertit une durée (en ms) en minutes.
 * @param ms - Millisecondes
 * @returns - Minutes arrondies vers le bas
 */
export function formatMillisecondsToMinutes(ms: number): number {
  return Math.floor(ms / 1000 / 60);
}

/**
 * Convertit une durée en millisecondes en format "Heures:Minutes"
 * Exemple : 1h02 => "1h02"
 * @param ms - Millisecondes
 * @returns - Texte lisible
 */
export function formatMillisecondsToH_M(ms: number): string {
  const totalMinutes = Math.floor(ms / 1000 / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // forcer l'affichage en 2 chiffres, comme 1h02 au lieu de 1h2
  return `${hours}h${minutes < 10 ? "0" + minutes : minutes}`;
}
