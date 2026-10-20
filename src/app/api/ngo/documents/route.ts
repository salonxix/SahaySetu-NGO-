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

    const documents = await NgoDataStore.getDocumentsForNgo(ngoUser.id);
    return NextResponse.json({
      success: true,
      documents,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch documents',
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
    const { documentId, status } = body;

    if (!documentId || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing documentId or status' },
        { status: 400 }
      );
    }

    const success = await NgoDataStore.updateDocumentStatus(ngoUser.id, documentId, status);
    const documents = await NgoDataStore.getDocumentsForNgo(ngoUser.id);

    return NextResponse.json({
      success,
      documents,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update document',
      },
      { status: 500 }
    );
  }
}
