import { NextResponse } from 'next/server';
import { getAuthenticatedCitizenUser } from '@/lib/auth/server-auth';
import { NgoPublishStore } from '@/lib/db/ngo-publish-store';
import { Database } from '@/lib/db/database';

export async function GET() {
  try {
    const citizenUser = await getAuthenticatedCitizenUser();
    if (!citizenUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized citizen session' }, { status: 401 });
    }

    const requests = await NgoPublishStore.getUserHelpRequests(citizenUser.id);
    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error('Error in GET /api/user/help-requests:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const citizenUser = await getAuthenticatedCitizenUser();
    if (!citizenUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized citizen session' }, { status: 401 });
    }

    const db = Database.getInstance();
    const citizenProfile = db.getState().citizen_profiles.find((p) => p.user_id === citizenUser.id);

    const body = await req.json();
    if (!body.ngoId || !body.category || !body.needTitle || !body.needDescription) {
      return NextResponse.json(
        { success: false, error: 'NGO ID, category, need title, and description are required' },
        { status: 400 }
      );
    }

    const helpRequest = await NgoPublishStore.createHelpRequest(citizenUser.id, {
      citizenName: body.citizenName || citizenProfile?.full_name || citizenUser.fullName || 'Anonymous Citizen',
      citizenPhone: body.citizenPhone || citizenProfile?.phone_number || citizenUser.phoneNumber || '',
      citizenEmail: body.citizenEmail || citizenUser.email,
      ngoId: body.ngoId,
      ngoName: body.ngoName,
      category: body.category,
      needTitle: body.needTitle,
      needDescription: body.needDescription,
      itemsRequested: body.itemsRequested,
      location: body.location || `${citizenProfile?.state || 'Local Area'}`,
      urgency: body.urgency || 'Within a week',
    });

    return NextResponse.json({ success: true, request: helpRequest });
  } catch (error) {
    console.error('Error in POST /api/user/help-requests:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
