import { NextResponse } from 'next/server';
import { getAuthenticatedNgoUser } from '@/lib/auth/server-auth';
import { NgoPublishStore } from '@/lib/db/ngo-publish-store';
import { Database } from '@/lib/db/database';

export async function GET() {
  try {
    const ngoUser = await getAuthenticatedNgoUser();
    if (!ngoUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized NGO session' }, { status: 401 });
    }

    const db = Database.getInstance();
    const ngoProfile = db.getState().ngo_profiles.find((p) => p.user_id === ngoUser.id);
    const ngoId = ngoProfile?.id || ngoUser.id;

    const requests = await NgoPublishStore.getIncomingHelpRequests(ngoId);
    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error('Error in GET /api/ngo/help-requests:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const ngoUser = await getAuthenticatedNgoUser();
    if (!ngoUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized NGO session' }, { status: 401 });
    }

    const db = Database.getInstance();
    const ngoProfile = db.getState().ngo_profiles.find((p) => p.user_id === ngoUser.id);
    const ngoId = ngoProfile?.id || ngoUser.id;

    const body = await req.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ success: false, error: 'Request ID and status are required' }, { status: 400 });
    }

    const updated = await NgoPublishStore.updateHelpRequestStatus(
      ngoId,
      body.id,
      body.status,
      body.ngoNotes
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Request not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true, request: updated });
  } catch (error) {
    console.error('Error in PATCH /api/ngo/help-requests:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
