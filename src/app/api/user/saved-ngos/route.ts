import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuthenticatedCitizenUser } from '@/lib/auth/server-auth';
import { UserStore } from '@/lib/db/user-store';

export async function GET(request: NextRequest) {
  try {
    const citizen = await getAuthenticatedCitizenUser();
    if (!citizen) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in as a citizen user.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : undefined;
    const lon = searchParams.get('lon') ? parseFloat(searchParams.get('lon')!) : undefined;

    const savedNgoIds = await UserStore.getSavedNgoIds(citizen.id);
    const allNgos = await UserStore.getPublicNgos({
      userLocation:
        lat !== undefined && lon !== undefined
          ? {
              label: 'Selected',
              city: 'Selected',
              state: '',
              latitude: lat,
              longitude: lon,
              isCustomOrBrowser: true,
            }
          : undefined,
    });

    const savedNgos = allNgos.filter((ngo) => savedNgoIds.includes(ngo.id));

    return NextResponse.json({
      success: true,
      savedNgoIds,
      savedNgos,
      total: savedNgos.length,
    });
  } catch (error) {
    console.error('API Error /api/user/saved-ngos GET:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve saved organisations.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const citizen = await getAuthenticatedCitizenUser();
    if (!citizen) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to save organisations.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { ngoId } = body;

    if (!ngoId || typeof ngoId !== 'string') {
      return NextResponse.json(
        { error: 'Valid ngoId string is required.' },
        { status: 400 }
      );
    }

    const result = await UserStore.toggleSaveNgo(citizen.id, ngoId);

    return NextResponse.json({
      success: true,
      saved: result.saved,
      savedNgoIds: result.savedNgoIds,
      message: result.saved
        ? 'Organisation saved to your list.'
        : 'Organisation removed from your saved list.',
    });
  } catch (error) {
    console.error('API Error /api/user/saved-ngos POST:', error);
    return NextResponse.json(
      { error: 'Failed to update saved organisation.' },
      { status: 500 }
    );
  }
}
