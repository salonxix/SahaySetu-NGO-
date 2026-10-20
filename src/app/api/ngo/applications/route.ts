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

    const applications = await NgoDataStore.getApplicationsForNgo(ngoUser.id);
    return NextResponse.json({
      success: true,
      applications,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch applications',
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
    const { action, application } = body;

    if (!application || !application.formData) {
      return NextResponse.json(
        { success: false, error: 'Invalid application payload' },
        { status: 400 }
      );
    }

    let savedApp;
    if (action === 'submit' || application.status === 'Submitted') {
      savedApp = await NgoDataStore.submitApplication(ngoUser.id, {
        id: application.id,
        schemeId: application.schemeId,
        schemeTitle: application.schemeTitle,
        department: application.department,
        formData: application.formData,
      });
    } else {
      // Draft mode
      savedApp = await NgoDataStore.saveDraftApplication(ngoUser.id, {
        id: application.id,
        schemeId: application.schemeId,
        schemeTitle: application.schemeTitle,
        department: application.department,
        formData: application.formData,
      });
    }

    const applications = await NgoDataStore.getApplicationsForNgo(ngoUser.id);

    return NextResponse.json({
      success: true,
      application: savedApp,
      applications,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to persist application',
      },
      { status: 500 }
    );
  }
}
