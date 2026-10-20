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

    const metrics = await NgoPublishStore.getOverviewMetrics(ngoId);
    return NextResponse.json({ success: true, metrics });
  } catch (error) {
    console.error('Error in GET /api/ngo/overview-metrics:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
