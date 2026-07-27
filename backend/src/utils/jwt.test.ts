import { generateToken, verifyToken } from './jwt';
import jwt from 'jsonwebtoken';

describe('JWT Utility', () => {
  const originalSecret = process.env.JWT_SECRET;
  
  beforeAll(() => {
    process.env.JWT_SECRET = 'test_secret_123';
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  it('should generate and verify a valid token', () => {
    const payload = { id: 1, role: 'admin' as any, email: 'admin@test.com' };
    const token = generateToken(payload);
    
    const decoded = verifyToken(token);
    expect(decoded.id).toBe(1);
    expect(decoded.role).toBe('admin');
  });

  it('should reject a token with an invalid signature', () => {
    const payload = { id: 1, role: 'admin' as any, email: 'admin@test.com' };
    const token = generateToken(payload);
    
    // Tamper with the token (change header or payload)
    const tamperedToken = token.substring(0, token.length - 2) + 'ab';
    
    expect(() => verifyToken(tamperedToken)).toThrow();
  });

  it('should reject a token signed with a different secret', () => {
    const payload = { id: 1, role: 'admin' as any, email: 'admin@test.com' };
    const forgedToken = jwt.sign(payload, 'wrong_secret', { expiresIn: '15m' });
    
    expect(() => verifyToken(forgedToken)).toThrow();
  });
});
