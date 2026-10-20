import { NextResponse } from 'next/server';
import { getAuthenticatedNgoUser } from '@/lib/auth/server-auth';
import { NgoDataStore } from '@/lib/db/ngo-store';

export async function GET() {
  try {
    const ngoUser = await getAuthenticatedNgoUser();
    if (!ngoUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: NGO session required' },
        { status: 401 }
      );
    }

    const savedSchemeIds = await NgoDataStore.getSavedSchemeIdsForNgo(ngoUser.id);
    return NextResponse.json({
      success: true,
      savedSchemeIds,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch saved schemes',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const ngoUser = await getAuthenticatedNgoUser();
    if (!ngoUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: NGO session required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { schemeId } = body;

    if (!schemeId || typeof schemeId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid schemeId' },
        { status: 400 }
      );
    }

    await NgoDataStore.saveSchemeForNgo(ngoUser.id, schemeId);
    const savedSchemeIds = await NgoDataStore.getSavedSchemeIdsForNgo(ngoUser.id);

    return NextResponse.json({
      success: true,
      savedSchemeIds,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save scheme',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const ngoUser = await getAuthenticatedNgoUser();
    if (!ngoUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: NGO session required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    let schemeId = searchParams.get('schemeId');

    if (!schemeId) {
      try {
        const body = await request.json();
        schemeId = body.schemeId;
      } catch {
        // Handled below
      }
    }

    if (!schemeId || typeof schemeId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid schemeId' },
        { status: 400 }
      );
    }

    await NgoDataStore.unsaveSchemeForNgo(ngoUser.id, schemeId);
    const savedSchemeIds = await NgoDataStore.getSavedSchemeIdsForNgo(ngoUser.id);

    return NextResponse.json({
      success: true,
      savedSchemeIds,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to remove saved scheme',
      },
      { status: 500 }
    );
  }
}
