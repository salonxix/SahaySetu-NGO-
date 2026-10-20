import type { UserLocation } from '@/types/user-portal';

/**
 * Calculates the great-circle distance between two geographical points on Earth
 * using the Haversine formula.
 * @returns Distance in kilometers, rounded to one decimal place.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (lat1 === lat2 && lon1 === lon2) return 0;

  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return Math.round(d * 10) / 10;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Pre-defined prominent Indian urban locations for seamless manual selection
 * without requiring GPS permissions.
 */
export const PRESET_LOCATIONS: UserLocation[] = [
  {
    label: 'Connaught Place / Central Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    latitude: 28.6304,
    longitude: 77.2177,
    isCustomOrBrowser: false,
  },
  {
    label: 'South Delhi / Hauz Khas',
    city: 'New Delhi',
    state: 'Delhi',
    latitude: 28.5494,
    longitude: 77.2001,
    isCustomOrBrowser: false,
  },
  {
    label: 'Dwarka / West Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    latitude: 28.5921,
    longitude: 77.0460,
    isCustomOrBrowser: false,
  },
  {
    label: 'Noida / Sector 18',
    city: 'Noida',
    state: 'Uttar Pradesh',
    latitude: 28.5708,
    longitude: 77.3271,
    isCustomOrBrowser: false,
  },
  {
    label: 'Gurugram / Cyber Hub',
    city: 'Gurugram',
    state: 'Haryana',
    latitude: 28.4950,
    longitude: 77.0895,
    isCustomOrBrowser: false,
  },
  {
    label: 'Bengaluru / Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    latitude: 12.9784,
    longitude: 77.6408,
    isCustomOrBrowser: false,
  },
  {
    label: 'Bengaluru / Koramangala',
    city: 'Bengaluru',
    state: 'Karnataka',
    latitude: 12.9352,
    longitude: 77.6245,
    isCustomOrBrowser: false,
  },
  {
    label: 'Mumbai / Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    latitude: 19.0596,
    longitude: 72.8295,
    isCustomOrBrowser: false,
  },
  {
    label: 'Mumbai / Andheri East',
    city: 'Mumbai',
    state: 'Maharashtra',
    latitude: 19.1136,
    longitude: 72.8697,
    isCustomOrBrowser: false,
  },
  {
    label: 'Pune / Shivajinagar',
    city: 'Pune',
    state: 'Maharashtra',
    latitude: 18.5314,
    longitude: 73.8446,
    isCustomOrBrowser: false,
  },
  {
    label: 'Jaipur / C-Scheme',
    city: 'Jaipur',
    state: 'Rajasthan',
    latitude: 26.9124,
    longitude: 75.7873,
    isCustomOrBrowser: false,
  },
  {
    label: 'Hyderabad / Banjara Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    latitude: 17.4156,
    longitude: 78.4350,
    isCustomOrBrowser: false,
  },
];

export const DEFAULT_USER_LOCATION: UserLocation = PRESET_LOCATIONS[0];
