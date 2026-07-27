/**
 * Validates Indonesian License Plate Format (Plat Nomor)
 * Basic format: 1-2 letters, 1-4 numbers, 1-3 letters.
 * Example: B 1234 ABC, D 1 A, AB 1234 XY
 */
export const isValidPlatNomor = (platNomor: string): boolean => {
  // Regex: 1-2 Letters, optional space, 1-4 Digits, optional space, 1-3 Letters
  const regex = /^[A-Z]{1,2}\s?\d{1,4}\s?[A-Z]{1,3}$/i;
  return regex.test(platNomor.trim());
};
