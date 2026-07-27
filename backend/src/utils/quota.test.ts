import { calculateSisaKuota } from './quota';

describe('Quota Calculation Logic', () => {
  it('should return difference if active bookings are less than max quota', () => {
    expect(calculateSisaKuota(10, 3)).toBe(7);
  });

  it('should return 0 if active bookings equal max quota', () => {
    expect(calculateSisaKuota(5, 5)).toBe(0);
  });

  it('should return 0 (never negative) if active bookings exceed max quota (fail-safe)', () => {
    expect(calculateSisaKuota(5, 7)).toBe(0);
  });
});
