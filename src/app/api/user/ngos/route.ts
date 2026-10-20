import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserStore } from '@/lib/db/user-store';
import type {
  DonationType,
  NgoCauseCategory,
  UserLocation,
} from '@/types/user-portal';
import { DEFAULT_USER_LOCATION } from '@/lib/user/distance';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract Location
    const lat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : undefined;
    const lon = searchParams.get('lon') ? parseFloat(searchParams.get('lon')!) : undefined;
    const label = searchParams.get('label') || undefined;
    const city = searchParams.get('city') || undefined;
    const state = searchParams.get('state') || undefined;

    let userLocation: UserLocation | undefined = undefined;
    if (lat !== undefined && !isNaN(lat) && lon !== undefined && !isNaN(lon)) {
      userLocation = {
        label: label || `${city || 'Custom'}, ${state || ''}`,
        city: city || 'Selected Location',
        state: state || '',
        latitude: lat,
        longitude: lon,
        isCustomOrBrowser: true,
      };
    } else {
      userLocation = DEFAULT_USER_LOCATION;
    }

    // Extract Distance filter
    const distanceParam = searchParams.get('distance');
    let maxDistanceKm: number | 'all' = 'all';
    if (distanceParam && distanceParam !== 'all') {
      const parsed = parseFloat(distanceParam);
      if (!isNaN(parsed) && parsed > 0) {
        maxDistanceKm = parsed;
      }
    }

    // Extract Donation Types (comma separated)
    const donationsParam = searchParams.get('donations');
    const donationTypes: DonationType[] = donationsParam
      ? (donationsParam.split(',').map((d) => d.trim()).filter(Boolean) as DonationType[])
      : [];

    // Extract Cause
    const causeParam = searchParams.get('cause') as NgoCauseCategory | 'all' | null;
    const cause = causeParam && causeParam !== 'all' ? causeParam : undefined;

    // Search query
    const searchQuery = searchParams.get('query') || undefined;

    const ngos = await UserStore.getPublicNgos({
      userLocation,
      maxDistanceKm,
      donationTypes: donationTypes.length > 0 ? donationTypes : undefined,
      cause,
      searchQuery,
    });

    return NextResponse.json({
      success: true,
      data: ngos,
      total: ngos.length,
      userLocation,
    });
  } catch (error) {
    console.error('API Error /api/user/ngos:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve nearby organisations.' },
      { status: 500 }
    );
  }
}
