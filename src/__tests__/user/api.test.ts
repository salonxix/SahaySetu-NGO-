import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET as getNgosRoute } from '@/app/api/user/ngos/route';
import { GET as getSavedNgosRoute, POST as postSavedNgosRoute } from '@/app/api/user/saved-ngos/route';
import { GET as getPreferencesRoute, POST as postPreferencesRoute } from '@/app/api/user/preferences/route';
import { Database } from '@/lib/db/database';
import { NextRequest } from 'next/server';
import * as serverAuth from '@/lib/auth/server-auth';
import type { PublicNgoOrg } from '@/types/user-portal';
import type { GeneralUser } from '@/types/auth';

describe('User Portal API Endpoints', () => {
  beforeEach(() => {
    Database.getInstance().reset();
    vi.restoreAllMocks();
  });

  const mockCitizenUser: GeneralUser = {
    id: 'usr_demo_citizen_01',
    email: 'citizen@sahaysetu.org',
    passwordHash: 'mocked_hashed_pass',
    role: 'user',
    fullName: 'Pooja Verma',
    state: 'Delhi NCR',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('GET /api/user/ngos returns filtered NGOs with distances', async () => {
    const req = new NextRequest('http://localhost:3000/api/user/ngos?lat=28.6304&lon=77.2177&distance=10&donations=Books');
    const res = await getNgosRoute(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);
    json.data.forEach((n: PublicNgoOrg) => {
      expect(n.distanceKm).toBeLessThanOrEqual(10);
      expect(n.acceptedDonationTypes).toContain('Books');
    });
  });

  it('GET /api/user/saved-ngos requires citizen authentication', async () => {
    vi.spyOn(serverAuth, 'getAuthenticatedCitizenUser').mockResolvedValue(null);

    const req = new NextRequest('http://localhost:3000/api/user/saved-ngos');
    const res = await getSavedNgosRoute(req);
    expect(res.status).toBe(401);
  });

  it('POST /api/user/saved-ngos toggles save status for authenticated citizen', async () => {
    vi.spyOn(serverAuth, 'getAuthenticatedCitizenUser').mockResolvedValue(mockCitizenUser);

    const req = new NextRequest('http://localhost:3000/api/user/saved-ngos', {
      method: 'POST',
      body: JSON.stringify({ ngoId: 'ngo-pub-01' }),
    });

    const res = await postSavedNgosRoute(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.saved).toBe(true);
    expect(json.savedNgoIds).toContain('ngo-pub-01');
  });

  it('GET & POST /api/user/preferences manages user preferences', async () => {
    vi.spyOn(serverAuth, 'getAuthenticatedCitizenUser').mockResolvedValue(mockCitizenUser);

    const getRes = await getPreferencesRoute();
    expect(getRes.status).toBe(200);
    const getJson = await getRes.json();
    expect(getJson.success).toBe(true);

    const updateReq = new NextRequest('http://localhost:3000/api/user/preferences', {
      method: 'POST',
      body: JSON.stringify({
        preferredDistanceKm: 25,
        preferredDonationTypes: ['Clothes', 'Books'],
      }),
    });

    const postRes = await postPreferencesRoute(updateReq);
    expect(postRes.status).toBe(200);
    const postJson = await postRes.json();
    expect(postJson.success).toBe(true);
    expect(postJson.preferences.preferredDistanceKm).toBe(25);
    expect(postJson.preferences.preferredDonationTypes).toEqual(['Clothes', 'Books']);
  });
});
