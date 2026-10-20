import { describe, it, expect, beforeEach } from 'vitest';
import { UserStore, ensureDemoUsers } from '@/lib/auth/store';
import { hashPassword } from '@/lib/auth/security';

describe('UserStore Service', () => {
  beforeEach(async () => {
    UserStore.clear();
    await ensureDemoUsers();
  });

  it('finds pre-seeded demo users', async () => {
    const demoNgo = await UserStore.findByEmail('demo@sahaysetungo.org');
    expect(demoNgo).not.toBeNull();
    expect(demoNgo?.role).toBe('ngo');

    const demoCitizen = await UserStore.findByEmail('citizen@sahaysetu.org');
    expect(demoCitizen).not.toBeNull();
    expect(demoCitizen?.role).toBe('user');
  });

  it('creates and retrieves a new NGO user', async () => {
    const passwordHash = await hashPassword('Pass1234');
    const created = await UserStore.createNgoUser({
      role: 'ngo',
      ngoName: 'Udaan Foundation',
      registrationNumber: 'MH/2022/9999',
      focusSector: 'Education',
      contactPerson: 'Sonia Mehta',
      email: 'contact@udaan.org',
      phoneNumber: '+91 9988776655',
      state: 'Maharashtra',
      passwordHash,
    });

    expect(created.id).toBeDefined();
    expect(created.email).toBe('contact@udaan.org');

    const found = await UserStore.findByEmail('contact@udaan.org');
    expect(found).not.toBeNull();
    expect(found?.role).toBe('ngo');
  });

  it('prevents duplicate registration with existing email', async () => {
    const passwordHash = await hashPassword('Pass1234');
    await expect(
      UserStore.createGeneralUser({
        role: 'user',
        fullName: 'Test User',
        email: 'citizen@sahaysetu.org', // already registered demo user
        passwordHash,
      })
    ).rejects.toThrow('already exists');
  });

  it('sanitizes user output without exposing passwordHash', async () => {
    const demoUser = await UserStore.findByEmail('citizen@sahaysetu.org');
    expect(demoUser).not.toBeNull();

    if (demoUser) {
      const sanitized = UserStore.sanitizeUser(demoUser);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((sanitized as any).passwordHash).toBeUndefined();
      expect(sanitized.email).toBe('citizen@sahaysetu.org');
    }
  });
});
