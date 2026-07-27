import { generateQRCode, isValidQRCode } from './qr';

jest.mock('uuid', () => ({
  v4: () => '123e4567-e89b-12d3-a456-426614174000',
  validate: (str: string) => str === '123e4567-e89b-12d3-a456-426614174000'
}));

describe('QR Generator and Validator', () => {
  it('should generate a valid UUIDv4', () => {
    const qr = generateQRCode();
    expect(isValidQRCode(qr)).toBe(true);
  });

  it('should reject invalid QR formats', () => {
    expect(isValidQRCode('1234-abcd')).toBe(false);
    expect(isValidQRCode('invalid-qr-code')).toBe(false);
    expect(isValidQRCode('')).toBe(false);
  });
});
