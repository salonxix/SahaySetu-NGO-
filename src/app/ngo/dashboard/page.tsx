'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { NgoUser } from '@/types/auth';
import type { DashboardTab, Scheme, NgoApplication } from '@/types/ngo';
import {
  DEMO_APPLICATIONS,
  DEMO_DOCUMENTS,
  DEMO_OPPORTUNITIES,
} from '@/lib/ngo/mock-data';
import { SCHEMES_CATALOG } from '@/lib/ngo/mock-schemes';

import { NgoSidebar } from '@/components/ngo/NgoSidebar';
import { NgoTopBar } from '@/components/ngo/NgoTopBar';
import { WelcomeBanner } from '@/components/ngo/WelcomeBanner';
import { ProfileCompleteness } from '@/components/ngo/ProfileCompleteness';
import { ActionRequired } from '@/components/ngo/ActionRequired';
import { RecommendedSchemes } from '@/components/ngo/RecommendedSchemes';
import { SchemeDiscoveryView } from '@/components/ngo/schemes/SchemeDiscoveryView';
import { SavedSchemesView } from '@/components/ngo/SavedSchemesView';
import { ApplicationsView } from '@/components/ngo/ApplicationsView';
import { DocumentsView } from '@/components/ngo/DocumentsView';
import { OpportunitiesView } from '@/components/ngo/OpportunitiesView';
import { NgoHelpView } from '@/components/ngo/NgoHelpView';
import { ApplicationWizardModal } from '@/components/ngo/application/ApplicationWizardModal';
import { RegistrationGuideView } from '@/components/ngo/registration-guide/RegistrationGuideView';

// New Community Publishing & Two-Way Engagement Components
import { PublishSummaryCards } from '@/components/ngo/PublishSummaryCards';
import { NgoNeedsView } from '@/components/ngo/publish/NgoNeedsView';
import { NgoCampaignsView } from '@/components/ngo/publish/NgoCampaignsView';
import { NgoEventsView } from '@/components/ngo/publish/NgoEventsView';
import { NgoVolunteerOpsView } from '@/components/ngo/publish/NgoVolunteerOpsView';
import { NgoHelpRequestsView } from '@/components/ngo/publish/NgoHelpRequestsView';
import { NgoPublicProfileEditor } from '@/components/ngo/publish/NgoPublicProfileEditor';

function NgoDashboardContent() {
  const { user, loading, logout } = useAuth();
  const searchParams = useSearchParams();

  const [currentTab, setCurrentTab] = useState<DashboardTab>('dashboard');
  const [savedSchemeIds, setSavedSchemeIds] = useState<Set<string>>(new Set(['sch-01']));
  const [applications, setApplications] = useState<NgoApplication[]>(DEMO_APPLICATIONS);
  const [applyingScheme, setApplyingScheme] = useState<Scheme | null>(null);
  const [activeDraft, setActiveDraft] = useState<NgoApplication | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Overview metrics state
  const [overviewMetrics, setOverviewMetrics] = useState({
    activeNeedsCount: 0,
    activeCampaignsCount: 0,
    upcomingEventsCount: 0,
    volunteerOpsCount: 0,
    newHelpRequestsCount: 0,
  });

  // Sync tab from URL
  useEffect(() => {
    const tabParam = searchParams.get('tab') as DashboardTab;
    if (
      tabParam &&
      [
        'dashboard',
        'registration-guide',
        'schemes',
        'saved',
        'applications',
        'documents',
        'needs',
        'campaigns',
        'events',
        'volunteer-ops',
        'help-requests',
        'public-profile',
        'opportunities',
        'help',
      ].includes(tabParam)
    ) {
      setCurrentTab(tabParam);
    }
  }, [searchParams]);

  // Load persistent saved schemes, applications, and overview metrics
  useEffect(() => {
    if (!user || user.role !== 'ngo') return;

    let isMounted = true;

    // 1. Fetch persistent saved schemes
    fetch('/api/ngo/saved-schemes')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.success && Array.isArray(data.savedSchemeIds)) {
          setSavedSchemeIds(new Set(data.savedSchemeIds));
        }
      })
      .catch((err) => console.error('Error fetching saved schemes:', err));

    // 2. Fetch persistent applications
    fetch('/api/ngo/applications')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.success && Array.isArray(data.applications) && data.applications.length > 0) {
          setApplications(data.applications);
        }
      })
      .catch((err) => console.error('Error fetching applications:', err));

    // 3. Fetch Overview metrics
    fetch('/api/ngo/overview-metrics')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.success && data.metrics) {
          setOverviewMetrics(data.metrics);
        }
      })
      .catch((err) => console.error('Error fetching overview metrics:', err));

    return () => {
      isMounted = false;
    };
  }, [user, currentTab]);

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <p>Loading NGO Workspace...</p>
        </div>
      </div>
    );
  }

  const ngoUser = user as unknown as NgoUser;

  // Toggle saving schemes with server persistence
  const handleToggleSave = (schemeId: string) => {
    const wasSaved = savedSchemeIds.has(schemeId);

    // Optimistic UI update
    setSavedSchemeIds((prev) => {
      const next = new Set(prev);
      if (wasSaved) {
        next.delete(schemeId);
      } else {
        next.add(schemeId);
      }
      return next;
    });

    // Server-side persistence sync
    if (wasSaved) {
      fetch(`/api/ngo/saved-schemes?schemeId=${encodeURIComponent(schemeId)}`, {
        method: 'DELETE',
      }).catch((err) => console.error('Failed to unsave scheme:', err));
    } else {
      fetch('/api/ngo/saved-schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schemeId }),
      }).catch((err) => console.error('Failed to save scheme:', err));
    }
  };

  // Start Application Flow
  const handleStartApplication = (scheme: Scheme) => {
    setApplyingScheme(scheme);
    setActiveDraft(null);
    setIsWizardOpen(true);
  };

  // Resume Draft
  const handleResumeDraft = (draft: NgoApplication) => {
    const matchedScheme =
      SCHEMES_CATALOG.find((s) => s.id === draft.schemeId || s.name === draft.schemeTitle) ||
      SCHEMES_CATALOG[0];
    setApplyingScheme(matchedScheme);
    setActiveDraft(draft);
    setIsWizardOpen(true);
  };

  // Submit Application with server persistence
  const handleSubmitApplication = (newApp: NgoApplication) => {
    setApplications((prev) => [newApp, ...prev.filter((a) => a.id !== newApp.id)]);

    fetch('/api/ngo/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'submit', application: newApp }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data.applications) {
          setApplications(data.applications);
        }
      })
      .catch((err) => console.error('Failed to submit application to server:', err));
  };

  // Save Draft with server persistence
  const handleSaveDraft = (draftApp: NgoApplication) => {
    setApplications((prev) => [draftApp, ...prev.filter((a) => a.id !== draftApp.id)]);

    fetch('/api/ngo/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'draft', application: draftApp }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data.applications) {
          setApplications(data.applications);
        }
      })
      .catch((err) => console.error('Failed to save draft application to server:', err));
  };

  const savedSchemes = SCHEMES_CATALOG.filter((s) => savedSchemeIds.has(s.id));
  const missingDocsCount = DEMO_DOCUMENTS.filter((d) => d.status === 'Missing' || d.status === 'Needs Update').length;
  const actionRequiredApps = applications.filter((a) => a.status === 'Action Required').length;

  const isProfileIncomplete = !(
    ngoUser?.ngoName &&
    ngoUser?.registrationNumber &&
    ngoUser?.focusSector &&
    ngoUser?.state &&
    ngoUser?.city &&
    ngoUser?.contactPerson &&
    ngoUser?.phoneNumber &&
    ngoUser?.address
  );

  const totalActionCount =
    (isProfileIncomplete ? 1 : 0) +
    (missingDocsCount > 0 ? 1 : 0) +
    actionRequiredApps;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-canvas)' }}>
      {/* Sidebar Navigation (All 13 Sections) */}
      <NgoSidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        ngoUser={ngoUser}
        savedCount={savedSchemeIds.size}
        actionRequiredCount={totalActionCount}
        activeNeedsCount={overviewMetrics.activeNeedsCount}
        pendingRequestsCount={overviewMetrics.newHelpRequestsCount}
        isOpenMobile={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
        onLogout={logout}
      />

      {/* Main Workspace Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <NgoTopBar
          currentTab={currentTab}
          ngoUser={ngoUser}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          actionRequiredCount={totalActionCount}
        />

        <main style={{ flex: 1, padding: '2rem 1.5rem', maxWidth: '1100px', width: '100%', margin: '0 auto' }}>
          {/* 1. OVERVIEW / DASHBOARD */}
          {currentTab === 'dashboard' && (
            <>
              <WelcomeBanner
                ngoUser={ngoUser}
                pendingActionsCount={totalActionCount}
              />

              <PublishSummaryCards
                metrics={overviewMetrics}
                onNavigate={setCurrentTab}
              />

              <ActionRequired
                onNavigate={setCurrentTab}
                isProfileIncomplete={isProfileIncomplete}
                missingDocCount={missingDocsCount}
                pendingAppCount={actionRequiredApps}
              />

              <ProfileCompleteness
                ngoUser={ngoUser}
                onNavigateToProfile={() => setCurrentTab('public-profile')}
              />

              <RecommendedSchemes
                schemes={SCHEMES_CATALOG}
                savedSchemeIds={savedSchemeIds}
                onToggleSave={handleToggleSave}
                onExploreAll={() => setCurrentTab('schemes')}
                ngoUser={ngoUser}
                onStartApplication={handleStartApplication}
              />

              <div style={{ marginTop: '2rem' }}>
                <ApplicationsView
                  applications={applications}
                  onNavigateToFind={() => setCurrentTab('schemes')}
                  onResumeDraft={handleResumeDraft}
                />
              </div>
            </>
          )}

          {/* 2. REGISTRATION & GOVERNMENT SUPPORT GUIDE */}
          {currentTab === 'registration-guide' && (
            <RegistrationGuideView
              ngoUser={ngoUser}
              onNavigateTab={setCurrentTab}
            />
          )}

          {/* 3. FIND SCHEMES */}
          {currentTab === 'schemes' && (
            <SchemeDiscoveryView
              ngoUser={ngoUser}
              savedSchemeIds={savedSchemeIds}
              onToggleSave={handleToggleSave}
              onStartApplication={handleStartApplication}
            />
          )}

          {/* 3. SAVED SCHEMES */}
          {currentTab === 'saved' && (
            <SavedSchemesView
              savedSchemes={savedSchemes}
              onRemoveSaved={handleToggleSave}
              onNavigateToFind={() => setCurrentTab('schemes')}
              ngoUser={ngoUser}
              onStartApplication={handleStartApplication}
            />
          )}

          {/* 4. APPLICATIONS */}
          {currentTab === 'applications' && (
            <ApplicationsView
              applications={applications}
              onNavigateToFind={() => setCurrentTab('schemes')}
              onResumeDraft={handleResumeDraft}
            />
          )}

          {/* 5. DOCUMENTS */}
          {currentTab === 'documents' && (
            <DocumentsView documents={DEMO_DOCUMENTS} />
          )}

          {/* 6. DONATION NEEDS */}
          {currentTab === 'needs' && <NgoNeedsView />}

          {/* 7. CAMPAIGNS */}
          {currentTab === 'campaigns' && <NgoCampaignsView />}

          {/* 8. EVENTS */}
          {currentTab === 'events' && <NgoEventsView />}

          {/* 9. VOLUNTEER OPPORTUNITIES */}
          {currentTab === 'volunteer-ops' && <NgoVolunteerOpsView />}

          {/* 10. INCOMING HELP REQUESTS */}
          {currentTab === 'help-requests' && <NgoHelpRequestsView />}

          {/* 11. PUBLIC PROFILE */}
          {currentTab === 'public-profile' && (
            <NgoPublicProfileEditor ngoUser={ngoUser} />
          )}

          {/* 12. OPPORTUNITIES */}
          {currentTab === 'opportunities' && (
            <OpportunitiesView opportunities={DEMO_OPPORTUNITIES} />
          )}

          {/* 13. HELP & GUIDE */}
          {currentTab === 'help' && <NgoHelpView />}
        </main>
      </div>

      {/* Application Wizard Modal */}
      <ApplicationWizardModal
        scheme={applyingScheme}
        ngoUser={ngoUser}
        isOpen={isWizardOpen}
        existingDraft={activeDraft}
        onClose={() => {
          setIsWizardOpen(false);
          setApplyingScheme(null);
          setActiveDraft(null);
        }}
        onSubmitApplication={handleSubmitApplication}
        onSaveDraft={handleSaveDraft}
        onNavigateToApplications={() => setCurrentTab('applications')}
      />
    </div>
  );
}

export default function NgoDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="auth-container">
          <div className="auth-card" style={{ textAlign: 'center' }}>
            <p>Loading NGO Workspace...</p>
          </div>
        </div>
      }
    >
      <NgoDashboardContent />
    </Suspense>
  );
}
