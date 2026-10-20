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

    const volunteerOps = await NgoPublishStore.getVolunteerOps(ngoId);
    return NextResponse.json({ success: true, volunteerOps });
  } catch (error) {
    console.error('Error in GET /api/ngo/volunteer-ops:', error);
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
    if (!body.title || !body.cause || !body.location) {
      return NextResponse.json(
        { success: false, error: 'Title, cause, and location are required' },
        { status: 400 }
      );
    }

    const newOp = await NgoPublishStore.createVolunteerOp(ngoId, ngoName, {
      title: body.title,
      description: body.description || '',
      requiredSkills: body.requiredSkills || ['Volunteering'],
      cause: body.cause,
      location: body.location,
      dateTime: body.dateTime || 'Flexible',
      duration: body.duration || 'Flexible',
      volunteersRequired: Number(body.volunteersRequired) || 1,
      volunteersEnrolled: Number(body.volunteersEnrolled) || 0,
      opportunityType: body.opportunityType || 'One-time',
      contact: body.contact || ngoProfile?.phone_number || ngoUser.phoneNumber || '',
      status: body.status || 'Active',
    });

    return NextResponse.json({ success: true, volunteerOp: newOp });
  } catch (error) {
    console.error('Error in POST /api/ngo/volunteer-ops:', error);
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
      return NextResponse.json({ success: false, error: 'Volunteer Op ID is required' }, { status: 400 });
    }

    const updated = await NgoPublishStore.updateVolunteerOp(ngoId, body.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Volunteer op not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true, volunteerOp: updated });
  } catch (error) {
    console.error('Error in PUT /api/ngo/volunteer-ops:', error);
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
      return NextResponse.json({ success: false, error: 'Volunteer Op ID is required' }, { status: 400 });
    }

    const deleted = await NgoPublishStore.deleteVolunteerOp(ngoId, id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error('Error in DELETE /api/ngo/volunteer-ops:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
