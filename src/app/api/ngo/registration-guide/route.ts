import { NextResponse } from 'next/server';
import { getAuthenticatedNgoUser } from '@/lib/auth/server-auth';
import { GovernmentGuideStore } from '@/lib/government-sources/guide-store';
import type { OrganisationType } from '@/types/registration-guide';

export async function GET(req: Request) {
  try {
    const ngoUser = await getAuthenticatedNgoUser();
    const { searchParams } = new URL(req.url);

    const state = searchParams.get('state') || ngoUser?.state || 'Delhi';
    const orgType = (searchParams.get('orgType') as OrganisationType) || 'Trust';
    const sector = searchParams.get('sector') || ngoUser?.focusSector || 'Education';

    const [
      comparisons,
      roadmap,
      checklist,
      taxGuide,
      fcraGuide,
      darpanGuide,
    ] = await Promise.all([
      GovernmentGuideStore.getOrganisationTypeComparisons(state),
      GovernmentGuideStore.getStateRegistrationGuide(state, orgType),
      GovernmentGuideStore.getDocumentChecklist(orgType, state),
      GovernmentGuideStore.getTaxComplianceGuide(),
      GovernmentGuideStore.getFcraGuide(),
      GovernmentGuideStore.getNgoDarpanGuide(),
    ]);

    const portals = GovernmentGuideStore.getOfficialGovernmentPortals();
    const personalizedSchemes = GovernmentGuideStore.getPersonalizedSchemes(state, sector, orgType);

    const userProgress = ngoUser ? GovernmentGuideStore.getUserProgress(ngoUser.id) : null;

    return NextResponse.json({
      success: true,
      comparisons,
      roadmap,
      checklist,
      portals,
      taxGuide,
      fcraGuide,
      darpanGuide,
      personalizedSchemes,
      userProgress,
    });
  } catch (error) {
    console.error('Error in GET /api/ngo/registration-guide:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve registration guide data from authoritative sources.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const ngoUser = await getAuthenticatedNgoUser();
    if (!ngoUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: NGO authentication required to persist guide progress.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      answers,
      checkedDocumentIds = [],
      savedPortalIds = [],
      savedSchemeIds = [],
      currentStepIndex = 0,
    } = body;

    if (!answers || !answers.orgType || !answers.state) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload: questionnaire answers are required.' },
        { status: 400 }
      );
    }

    const saved = GovernmentGuideStore.saveUserProgress(
      ngoUser.id,
      answers,
      checkedDocumentIds,
      savedPortalIds,
      savedSchemeIds,
      currentStepIndex
    );

    return NextResponse.json({ success: true, progress: saved });
  } catch (error) {
    console.error('Error in POST /api/ngo/registration-guide:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save registration guide progress.' },
      { status: 500 }
    );
  }
}
