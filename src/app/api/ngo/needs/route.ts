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

    const needs = await NgoPublishStore.getNeeds(ngoId);
    return NextResponse.json({ success: true, needs });
  } catch (error) {
    console.error('Error in GET /api/ngo/needs:', error);
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
    if (!body.title || !body.category || !body.itemsRequired) {
      return NextResponse.json(
         { success: false, error: 'Title, category, and itemsRequired are required' },
         { status: 400 }
      );
    }

    const newNeed = await NgoPublishStore.createNeed(ngoId, ngoName, {
      title: body.title,
      category: body.category,
      causeCategory: body.causeCategory,
      description: body.description || '',
      itemsRequired: body.itemsRequired,
      quantityNeeded: body.quantityNeeded,
      quantityCollected: body.quantityCollected,
      location: body.location || `${ngoProfile?.city || ngoUser.city || ''}, ${ngoProfile?.state || ngoUser.state || ''}`,
      preferredContributionType: body.preferredContributionType || body.category,
      startDate: body.startDate,
      endDate: body.endDate,
      dropoffInfo: body.dropoffInfo,
      acceptsCourier: Boolean(body.acceptsCourier),
      contactInfo: body.contactInfo || ngoProfile?.phone_number || ngoUser.phoneNumber || '',
      status: body.status || 'Accepting',
      urgency: body.urgency || 'Regular',
    });

    return NextResponse.json({ success: true, need: newNeed });
  } catch (error) {
    console.error('Error in POST /api/ngo/needs:', error);
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
      return NextResponse.json({ success: false, error: 'Need ID is required' }, { status: 400 });
    }

    const updatedNeed = await NgoPublishStore.updateNeed(ngoId, body.id, body);
    if (!updatedNeed) {
      return NextResponse.json({ success: false, error: 'Need not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true, need: updatedNeed });
  } catch (error) {
    console.error('Error in PUT /api/ngo/needs:', error);
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
    const needId = searchParams.get('id');
    if (!needId) {
      return NextResponse.json({ success: false, error: 'Need ID is required' }, { status: 400 });
    }

    const deleted = await NgoPublishStore.deleteNeed(ngoId, needId);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error('Error in DELETE /api/ngo/needs:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
