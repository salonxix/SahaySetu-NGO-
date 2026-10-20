import { NextResponse } from 'next/server';
import { getAuthenticatedNgoUser } from '@/lib/auth/server-auth';
import { NgoDataStore } from '@/lib/db/ngo-store';
import { UserStore } from '@/lib/auth/store';

export async function GET() {
  try {
    const ngoUser = await getAuthenticatedNgoUser();
    if (!ngoUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: NGO session required' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: ngoUser,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch profile',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const ngoUser = await getAuthenticatedNgoUser();
    if (!ngoUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: NGO session required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      ngoName,
      contactPerson,
      phoneNumber,
      focusSector,
      state,
      city,
      address,
    } = body;

    await NgoDataStore.updateNgoProfile(ngoUser.id, {
      ngo_name: ngoName !== undefined ? ngoName : ngoUser.ngoName,
      contact_person: contactPerson !== undefined ? contactPerson : ngoUser.contactPerson,
      phone_number: phoneNumber !== undefined ? phoneNumber : ngoUser.phoneNumber,
      focus_sector: focusSector !== undefined ? focusSector : ngoUser.focusSector,
      state: state !== undefined ? state : ngoUser.state,
      city: city !== undefined ? city : ngoUser.city,
      address: address !== undefined ? address : ngoUser.address,
    });

    const refreshedUser = await UserStore.findById(ngoUser.id);

    return NextResponse.json({
      success: true,
      profile: refreshedUser,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update NGO profile',
      },
      { status: 500 }
    );
  }
}
