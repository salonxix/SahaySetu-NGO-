import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuthenticatedCitizenUser } from '@/lib/auth/server-auth';
import { UserStore } from '@/lib/db/user-store';

export async function GET() {
  try {
    const citizen = await getAuthenticatedCitizenUser();
    if (!citizen) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in as a citizen user.' },
        { status: 401 }
      );
    }

    const preferences = await UserStore.getUserPreferences(citizen.id);
    return NextResponse.json({
      success: true,
      preferences,
    });
  } catch (error) {
    console.error('API Error /api/user/preferences GET:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve user preferences.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const citizen = await getAuthenticatedCitizenUser();
    if (!citizen) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in as a citizen user.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { defaultLocation, preferredDonationTypes, preferredCauses, preferredDistanceKm } = body;

    const updated = await UserStore.updateUserPreferences(citizen.id, {
      defaultLocation,
      preferredDonationTypes,
      preferredCauses,
      preferredDistanceKm,
    });

    return NextResponse.json({
      success: true,
      preferences: updated,
      message: 'Preferences updated successfully.',
    });
  } catch (error) {
    console.error('API Error /api/user/preferences POST:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences.' },
      { status: 500 }
    );
  }
}
