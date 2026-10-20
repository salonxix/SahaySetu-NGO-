import { describe, it, expect, beforeEach } from 'vitest';
import { POST as registerNgoHandler } from '@/app/api/auth/register/ngo/route';
import { POST as registerUserHandler } from '@/app/api/auth/register/user/route';
import { POST as loginHandler } from '@/app/api/auth/login/route';
import { POST as logoutHandler } from '@/app/api/auth/logout/route';
import { UserStore, ensureDemoUsers } from '@/lib/auth/store';
import { SESSION_COOKIE_NAME } from '@/lib/auth/session';

describe('Auth API Handlers', () => {
  beforeEach(async () => {
    UserStore.clear();
    await ensureDemoUsers();
  });

  describe('NGO Registration API', () => {
    it('successfully registers an NGO and sets session cookie', async () => {
      const payload = {
        ngoName: 'Seva Sankalp',
        registrationNumber: 'UP/2023/12345',
        focusSector: 'Health & Family Welfare',
        contactPerson: 'Vikram Singh',
        email: 'info@sevasankalp.org',
        phoneNumber: '+91 9876543210',
        state: 'Uttar Pradesh',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      const req = new Request('http://localhost:3000/api/auth/register/ngo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const res = await registerNgoHandler(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.user.ngoName).toBe('Seva Sankalp');
      expect(data.user.role).toBe('ngo');

      const cookieHeader = res.headers.get('set-cookie');
      expect(cookieHeader).toContain(SESSION_COOKIE_NAME);
    });

    it('returns 400 on validation error', async () => {
      const invalidPayload = {
        ngoName: '',
        email: 'bad-email',
      };

      const req = new Request('http://localhost:3000/api/auth/register/ngo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidPayload),
      });

      const res = await registerNgoHandler(req);
      expect(res.status).toBe(400);

      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.fieldErrors).toBeDefined();
    });

    it('returns 409 when registering duplicate email', async () => {
      const duplicatePayload = {
        ngoName: 'Duplicate NGO',
        registrationNumber: 'DL/2021/0284918',
        focusSector: 'Rural Development',
        contactPerson: 'Aarav Sharma',
        email: 'demo@sahaysetungo.org', // Existing demo email
        phoneNumber: '+91 9876543210',
        state: 'Delhi',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      const req = new Request('http://localhost:3000/api/auth/register/ngo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicatePayload),
      });

      const res = await registerNgoHandler(req);
      expect(res.status).toBe(409);
    });
  });

  describe('Citizen Registration API', () => {
    it('successfully registers a citizen user', async () => {
      const payload = {
        fullName: 'Amit Patel',
        email: 'amit@example.com',
        phoneNumber: '+91 9876543210',
        state: 'Gujarat',
        preferredLanguage: 'Gujarati',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      const req = new Request('http://localhost:3000/api/auth/register/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const res = await registerUserHandler(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.user.fullName).toBe('Amit Patel');
      expect(data.user.role).toBe('user');
    });
  });

  describe('Login API', () => {
    it('logs in successfully with valid demo NGO credentials', async () => {
      const req = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'demo@sahaysetungo.org',
          password: 'Password123',
          role: 'ngo',
        }),
      });

      const res = await loginHandler(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.redirectUrl).toBe('/ngo/dashboard');
    });

    it('rejects incorrect password with 401', async () => {
      const req = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'demo@sahaysetungo.org',
          password: 'IncorrectPassword',
        }),
      });

      const res = await loginHandler(req);
      expect(res.status).toBe(401);
    });

    it('rejects role mismatch with 403 when citizen tries NGO login', async () => {
      const req = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'citizen@sahaysetu.org', // Citizen account
          password: 'Password123',
          role: 'ngo', // Trying to log in through NGO portal
        }),
      });

      const res = await loginHandler(req);
      expect(res.status).toBe(403);

      const data = await res.json();
      expect(data.error).toContain('registered as a Citizen');
    });
  });

  describe('Logout API', () => {
    it('clears session cookie on logout', async () => {
      const res = await logoutHandler();
      expect(res.status).toBe(200);

      const cookieHeader = res.headers.get('set-cookie');
      expect(cookieHeader).toContain(SESSION_COOKIE_NAME);
      expect(cookieHeader).toContain('Max-Age=0');
    });
  });
});
