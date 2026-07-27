import { isValidPlatNomor } from './validation';

describe('Validation Utilities', () => {
  describe('Plat Nomor Validation', () => {
    it('should return true for valid formats', () => {
      expect(isValidPlatNomor('B 1234 ABC')).toBe(true);
      expect(isValidPlatNomor('D 1 A')).toBe(true);
      expect(isValidPlatNomor('AB 1234 XY')).toBe(true);
      expect(isValidPlatNomor('B1234ABC')).toBe(true); // Without spaces
      expect(isValidPlatNomor('b 1234 abc')).toBe(true); // Case insensitive
    });

    it('should return false for invalid formats', () => {
      expect(isValidPlatNomor('1234 ABC')).toBe(false); // Missing prefix letter
      expect(isValidPlatNomor('B 12345 ABC')).toBe(false); // Too many digits
      expect(isValidPlatNomor('B 1234 ABCD')).toBe(false); // Too many suffix letters
      expect(isValidPlatNomor('B')).toBe(false); // Too short
      expect(isValidPlatNomor('')).toBe(false);
    });
  });
});
