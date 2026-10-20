import { describe, it, expect, beforeEach } from 'vitest';
import { UserStore } from '@/lib/db/user-store';
import { Database } from '@/lib/db/database';
import { PRESET_LOCATIONS } from '@/lib/user/distance';

describe('User Matching & NGO Filter Logic', () => {
  beforeEach(() => {
    Database.getInstance().reset();
  });

  const cpLocation = PRESET_LOCATIONS[0]; // Connaught Place, Central Delhi

  it('retrieves all NGOs with calculated distances sorted closest first', async () => {
    const ngos = await UserStore.getPublicNgos({ userLocation: cpLocation });
    expect(ngos.length).toBeGreaterThan(0);

    for (let i = 0; i < ngos.length - 1; i++) {
      const d1 = ngos[i].distanceKm ?? 0;
      const d2 = ngos[i + 1].distanceKm ?? 0;
      expect(d1).toBeLessThanOrEqual(d2);
    }
  });

  it('filters NGOs strictly by accepted donation types (e.g. Books)', async () => {
    const ngosAcceptingBooks = await UserStore.getPublicNgos({
      userLocation: cpLocation,
      donationTypes: ['Books'],
    });

    expect(ngosAcceptingBooks.length).toBeGreaterThan(0);
    ngosAcceptingBooks.forEach((ngo) => {
      expect(ngo.acceptedDonationTypes).toContain('Books');
    });
  });

  it('supports multi-select donation types (Books OR Clothes)', async () => {
    const ngos = await UserStore.getPublicNgos({
      userLocation: cpLocation,
      donationTypes: ['Books', 'Clothes'],
    });

    expect(ngos.length).toBeGreaterThan(0);
    ngos.forEach((ngo) => {
      const matches =
        ngo.acceptedDonationTypes.includes('Books') ||
        ngo.acceptedDonationTypes.includes('Clothes');
      expect(matches).toBe(true);
    });
  });

  it('filters NGOs by distance radius (e.g. within 10 km)', async () => {
    const ngosWithin10 = await UserStore.getPublicNgos({
      userLocation: cpLocation,
      maxDistanceKm: 10,
    });

    expect(ngosWithin10.length).toBeGreaterThan(0);
    ngosWithin10.forEach((ngo) => {
      expect(ngo.distanceKm).toBeLessThanOrEqual(10);
    });
  });

  it('filters NGOs by cause category (e.g. Elderly)', async () => {
    const elderlyNgos = await UserStore.getPublicNgos({
      userLocation: cpLocation,
      cause: 'Elderly',
    });

    expect(elderlyNgos.length).toBeGreaterThan(0);
    elderlyNgos.forEach((ngo) => {
      expect(ngo.primaryCauses).toContain('Elderly');
    });
  });

  it('searches across NGO names, causes, and needs items', async () => {
    const searchResults = await UserStore.getPublicNgos({
      userLocation: cpLocation,
      searchQuery: 'storybooks',
    });

    expect(searchResults.length).toBeGreaterThan(0);
    const hasStorybooks = searchResults.some((ngo) =>
      ngo.currentNeeds.some((n) => n.item.toLowerCase().includes('storybooks'))
    );
    expect(hasStorybooks).toBe(true);
  });

  it('toggles saved NGO IDs and persists them per citizen user', async () => {
    const userId = 'usr_test_citizen_01';
    const ngoId = 'ngo-pub-01';

    // 1. Initial save
    const r1 = await UserStore.toggleSaveNgo(userId, ngoId);
    expect(r1.saved).toBe(true);
    expect(r1.savedNgoIds).toContain(ngoId);

    // 2. Query saved list
    const savedList = await UserStore.getSavedNgoIds(userId);
    expect(savedList).toEqual([ngoId]);

    // 3. Toggle to unsave
    const r2 = await UserStore.toggleSaveNgo(userId, ngoId);
    expect(r2.saved).toBe(false);
    expect(r2.savedNgoIds).not.toContain(ngoId);
  });
});
