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

    const campaigns = await NgoPublishStore.getCampaigns(ngoId);
    return NextResponse.json({ success: true, campaigns });
  } catch (error) {
    console.error('Error in GET /api/ngo/campaigns:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const ngoUser = await getAuthenticatedNgoUser();
    if (!ngoUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized NGO session' }, { status: 401 });
    }

    const db = Database.getInstance();
    const ngoProfile = db.getState().ngo_profiles.find((p) => p.user_id === ngoUser.id);
    const ngoId = ngoProfile?.id || ngoUser.id;
    const ngoName = ngoProfile?.ngo_name || ngoUser.ngoName || 'NGO Partner';

    const body = await req.json();
    if (!body.title || !body.cause || !body.objective) {
      return NextResponse.json(
        { success: false, error: 'Title, cause, and objective are required' },
        { status: 400 }
      );
    }

    const newCampaign = await NgoPublishStore.createCampaign(ngoId, ngoName, {
      title: body.title,
      description: body.description || '',
      cause: body.cause,
      objective: body.objective,
      donationTypesAccepted: body.donationTypesAccepted || ['Money'],
      location: body.location || `${ngoProfile?.city || ngoUser.city || ''}, ${ngoProfile?.state || ngoUser.state || ''}`,
      startDate: body.startDate || new Date().toISOString().slice(0, 10),
      endDate: body.endDate || '',
      targetUnits: body.targetUnits,
      collectedUnits: body.collectedUnits,
      contact: body.contact || ngoProfile?.phone_number || ngoUser.phoneNumber || '',
      status: body.status || 'Active',
    });

    return NextResponse.json({ success: true, campaign: newCampaign });
  } catch (error) {
    console.error('Error in POST /api/ngo/campaigns:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const ngoUser = await getAuthenticatedNgoUser();
    if (!ngoUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized NGO session' }, { status: 401 });
    }

    const db = Database.getInstance();
    const ngoProfile = db.getState().ngo_profiles.find((p) => p.user_id === ngoUser.id);
    const ngoId = ngoProfile?.id || ngoUser.id;

    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Campaign ID is required' }, { status: 400 });
    }

    const updated = await NgoPublishStore.updateCampaign(ngoId, body.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Campaign not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true, campaign: updated });
  } catch (error) {
    console.error('Error in PUT /api/ngo/campaigns:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const ngoUser = await getAuthenticatedNgoUser();
    if (!ngoUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized NGO session' }, { status: 401 });
    }

    const db = Database.getInstance();
    const ngoProfile = db.getState().ngo_profiles.find((p) => p.user_id === ngoUser.id);
    const ngoId = ngoProfile?.id || ngoUser.id;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Campaign ID is required' }, { status: 400 });
    }

    const deleted = await NgoPublishStore.deleteCampaign(ngoId, id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error('Error in DELETE /api/ngo/campaigns:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
