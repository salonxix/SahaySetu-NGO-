import { describe, it, expect, beforeEach } from 'vitest';
import { Database } from '@/lib/db/database';
import { UserStore } from '@/lib/auth/store';
import { hashPassword } from '@/lib/auth/security';

describe('Database & User Persistence Layer', () => {
  beforeEach(() => {
    UserStore.clear();
  });

  it('initializes database singleton and auto-seeds default demo users', async () => {
    const db = Database.getInstance();
    expect(db).toBeDefined();

    const demoNgo = await UserStore.findByEmail('demo@sahaysetungo.org');
    expect(demoNgo).not.toBeNull();
    expect(demoNgo?.role).toBe('ngo');
    if (demoNgo && demoNgo.role === 'ngo') {
      expect(demoNgo.ngoName).toBe('Gram Vikas Seva Sansthan');
      expect(demoNgo.registrationNumber).toBe('DL/2021/0284918');
    }

    const demoCitizen = await UserStore.findByEmail('citizen@sahaysetu.org');
    expect(demoCitizen).not.toBeNull();
    expect(demoCitizen?.role).toBe('user');
    if (demoCitizen && demoCitizen.role === 'user') {
      expect(demoCitizen.fullName).toBe('Pooja Verma');
    }
  });

  it('creates and persists a new NGO user with relational profile', async () => {
    const passwordHash = await hashPassword('SecretPass123!');
    const newNgo = await UserStore.createNgoUser({
      email: 'test.ngo@example.org',
      passwordHash,
      role: 'ngo',
      ngoName: 'Pratham Shiksha Foundation',
      registrationNumber: 'MH/2024/001928',
      focusSector: 'Education',
      contactPerson: 'Sunita Rao',
      phoneNumber: '+91 9988776655',
      state: 'Maharashtra',
      city: 'Pune',
      address: 'Kothrud, Pune',
      verified: false,
    });

    expect(newNgo.id).toBeDefined();
    expect(newNgo.email).toBe('test.ngo@example.org');

    // Retrieve by email
    const fetched = await UserStore.findByEmail('test.ngo@example.org');
    expect(fetched).not.toBeNull();
    expect(fetched?.role).toBe('ngo');
    if (fetched && fetched.role === 'ngo') {
      expect(fetched.ngoName).toBe('Pratham Shiksha Foundation');
      expect(fetched.contactPerson).toBe('Sunita Rao');
    }

    // Retrieve by ID
    const fetchedById = await UserStore.findById(newNgo.id);
    expect(fetchedById).not.toBeNull();
    expect(fetchedById?.email).toBe('test.ngo@example.org');
  });

  it('prevents duplicate registration with the same email', async () => {
    const passwordHash = await hashPassword('Password123');
    await expect(
      UserStore.createNgoUser({
        email: 'demo@sahaysetungo.org', // Existing demo email
        passwordHash,
        role: 'ngo',
        ngoName: 'Duplicate NGO',
        registrationNumber: 'DL/999/999',
        focusSector: 'Health',
        contactPerson: 'Test',
        phoneNumber: '+91 9999999999',
        state: 'Delhi',
      })
    ).rejects.toThrow('An account with this email address already exists');
  });

  it('sanitizes user object before returning to client (never exposes passwordHash)', async () => {
    const user = await UserStore.findByEmail('demo@sahaysetungo.org');
    expect(user).not.toBeNull();
    if (user) {
      const sanitized = UserStore.sanitizeUser(user);
      expect('passwordHash' in sanitized).toBe(false);
      expect(sanitized.email).toBe('demo@sahaysetungo.org');
    }
  });
});
