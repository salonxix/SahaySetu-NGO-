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

    const events = await NgoPublishStore.getEvents(ngoId);
    return NextResponse.json({ success: true, events });
  } catch (error) {
    console.error('Error in GET /api/ngo/events:', error);
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
    if (!body.title || !body.date || !body.location) {
      return NextResponse.json(
        { success: false, error: 'Title, date, and location are required' },
        { status: 400 }
      );
    }

    const newEvent = await NgoPublishStore.createEvent(ngoId, ngoName, {
      title: body.title,
      description: body.description || '',
      date: body.date,
      startTime: body.startTime || '10:00 AM',
      endTime: body.endTime || '02:00 PM',
      location: body.location,
      eventType: body.eventType || 'Community Event',
      participationType: body.participationType || 'Open to All',
      contactInfo: body.contactInfo || ngoProfile?.phone_number || ngoUser.phoneNumber || '',
      status: body.status || 'Active',
    });

    return NextResponse.json({ success: true, event: newEvent });
  } catch (error) {
    console.error('Error in POST /api/ngo/events:', error);
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
      return NextResponse.json({ success: false, error: 'Event ID is required' }, { status: 400 });
    }

    const updated = await NgoPublishStore.updateEvent(ngoId, body.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Event not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true, event: updated });
  } catch (error) {
    console.error('Error in PUT /api/ngo/events:', error);
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
      return NextResponse.json({ success: false, error: 'Event ID is required' }, { status: 400 });
    }

    const deleted = await NgoPublishStore.deleteEvent(ngoId, id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error('Error in DELETE /api/ngo/events:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
