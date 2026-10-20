import { describe, it, expect } from 'vitest';
import { calculateDistanceKm, formatDistance, PRESET_LOCATIONS } from '@/lib/user/distance';

describe('Distance Calculation & Location Utility', () => {
  it('returns 0 when two points are identical', () => {
    const lat = 28.6304;
    const lon = 77.2177;
    expect(calculateDistanceKm(lat, lon, lat, lon)).toBe(0);
  });

  it('calculates accurate distances between known locations in Delhi NCR', () => {
    // Connaught Place (28.6304, 77.2177) to Hauz Khas (28.5494, 77.2001) is approx 9.1 km
    const cp = { lat: 28.6304, lon: 77.2177 };
    const hauzKhas = { lat: 28.5494, lon: 77.2001 };

    const distance = calculateDistanceKm(cp.lat, cp.lon, hauzKhas.lat, hauzKhas.lon);
    expect(distance).toBeGreaterThan(8.5);
    expect(distance).toBeLessThan(10.0);
    expect(distance).toBe(9.2);
  });

  it('calculates long-distance coordinates accurately (Delhi to Bengaluru)', () => {
    const delhi = { lat: 28.6139, lon: 77.2090 };
    const blr = { lat: 12.9716, lon: 77.5946 };

    const distance = calculateDistanceKm(delhi.lat, delhi.lon, blr.lat, blr.lon);
    // Approx 1740 km
    expect(distance).toBeGreaterThan(1700);
    expect(distance).toBeLessThan(1800);
  });

  it('formats distance appropriately for meters vs kilometers', () => {
    expect(formatDistance(0.35)).toBe('350 m');
    expect(formatDistance(0.8)).toBe('800 m');
    expect(formatDistance(2.4)).toBe('2.4 km');
    expect(formatDistance(15.78)).toBe('15.8 km');
  });

  it('provides rich preset locations covering major Indian urban hubs', () => {
    expect(PRESET_LOCATIONS.length).toBeGreaterThanOrEqual(10);
    const cities = PRESET_LOCATIONS.map((l) => l.city);
    expect(cities).toContain('New Delhi');
    expect(cities).toContain('Bengaluru');
    expect(cities).toContain('Mumbai');
    expect(cities).toContain('Jaipur');
    expect(cities).toContain('Hyderabad');
  });
});
