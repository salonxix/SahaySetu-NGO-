import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from '@/lib/auth/security';
import { createSessionToken, verifySessionToken } from '@/lib/auth/session';

describe('Auth Security - Passwords & JWT Sessions', () => {
  it('hashes a password and verifies correctly', async () => {
    const raw = 'SecureP@ss123';
    const hash = await hashPassword(raw);

    expect(hash).not.toBe(raw);
    expect(hash.startsWith('$2')).toBe(true);

    const isValid = await comparePassword(raw, hash);
    expect(isValid).toBe(true);

    const isInvalid = await comparePassword('WrongPassword123', hash);
    expect(isInvalid).toBe(false);
  });

  it('generates and verifies a valid JWT session token for NGO', async () => {
    const sessionData = {
      userId: 'ngo_123',
      email: 'ngo@example.org',
      role: 'ngo' as const,
      displayName: 'Gram Vikas NGO',
    };

    const token = await createSessionToken(sessionData);
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3);

    const verified = await verifySessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe(sessionData.userId);
    expect(verified?.email).toBe(sessionData.email);
    expect(verified?.role).toBe(sessionData.role);
    expect(verified?.displayName).toBe(sessionData.displayName);
  });

  it('generates and verifies a valid JWT session token for Citizen', async () => {
    const sessionData = {
      userId: 'user_456',
      email: 'citizen@example.com',
      role: 'user' as const,
      displayName: 'Pooja Verma',
    };

    const token = await createSessionToken(sessionData);
    const verified = await verifySessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe(sessionData.userId);
    expect(verified?.role).toBe('user');
  });

  it('rejects an invalid or tampered JWT token', async () => {
    const invalidToken = 'invalid.jwt.token';
    const verified = await verifySessionToken(invalidToken);
    expect(verified).toBeNull();
  });
});
