'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { NgoUser } from '@/types/auth';
import type {
  OrganisationType,
  OrganisationTypeComparison,
  StateRegistrationGuide,
  DocumentChecklistItem,
  GovernmentPortalItem,
  TaxComplianceGuideItem,
  FcraGuideData,
  NgoDarpanGuideData,
  QuestionnaireAnswers,
} from '@/types/registration-guide';
import type { Scheme, DashboardTab } from '@/types/ngo';
import { QuestionnaireFlow } from './QuestionnaireFlow';
import { OrgTypeComparison } from './OrgTypeComparison';
import { RoadmapView } from './RoadmapView';
import { DocumentChecklistView } from './DocumentChecklistView';
import { TaxComplianceSection } from './TaxComplianceSection';
import { PortalsDirectory } from './PortalsDirectory';
import { NgoDarpanGuideView } from './NgoDarpanGuideView';
import { FcraGuideView } from './FcraGuideView';
import { PersonalizedSchemesSection } from './PersonalizedSchemesSection';
import { AlreadyRegisteredView } from './AlreadyRegisteredView';

type GuideSubTab =
  | 'questionnaire'
  | 'structures'
  | 'roadmap'
  | 'checklist'
  | 'tax'
  | 'portals'
  | 'darpan'
  | 'fcra'
  | 'schemes'
  | 'already_registered';

interface RegistrationGuideViewProps {
  ngoUser: NgoUser | null;
  onNavigateTab?: (tab: DashboardTab) => void;
}

export const RegistrationGuideView: React.FC<RegistrationGuideViewProps> = ({
  ngoUser,
  onNavigateTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<GuideSubTab>('questionnaire');
  const [loading, setLoading] = useState<boolean>(true);
  const [savingProgress, setSavingProgress] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Questionnaire state
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    stage: 'Starting New',
    orgType: 'Trust',
    state: ngoUser?.state || 'Delhi',
    primarySector: ngoUser?.focusSector || 'Education',
    objectives: ['donations', 'schemes', 'grants', 'tax_exemptions'],
  });

  // Data state from API / authoritative store
  const [comparisons, setComparisons] = useState<OrganisationTypeComparison[]>([]);
  const [roadmap, setRoadmap] = useState<StateRegistrationGuide | null>(null);
  const [checklist, setChecklist] = useState<DocumentChecklistItem[]>([]);
  const [portals, setPortals] = useState<GovernmentPortalItem[]>([]);
  const [taxGuide, setTaxGuide] = useState<TaxComplianceGuideItem[]>([]);
  const [fcraGuide, setFcraGuide] = useState<FcraGuideData | null>(null);
  const [darpanGuide, setDarpanGuide] = useState<NgoDarpanGuideData | null>(null);
  const [personalizedSchemes, setPersonalizedSchemes] = useState<Scheme[]>([]);

  // User progress state
  const [checkedDocumentIds, setCheckedDocumentIds] = useState<string[]>([]);
  const [savedPortalIds, setSavedPortalIds] = useState<string[]>([]);
  const [savedSchemeIds, setSavedSchemeIds] = useState<string[]>([]);

  const fetchGuideData = useCallback(async (currentAnswers: QuestionnaireAnswers) => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        state: currentAnswers.state,
        orgType: currentAnswers.orgType,
        sector: currentAnswers.primarySector,
        stage: currentAnswers.stage,
      });

      const res = await fetch(`/api/ngo/registration-guide?${q.toString()}`);
      const data = await res.json();

      if (data?.success) {
        setComparisons(data.comparisons || []);
        setRoadmap(data.roadmap || null);
        setChecklist(data.checklist || []);
        setPortals(data.portals || []);
        setTaxGuide(data.taxGuide || []);
        setFcraGuide(data.fcraGuide || null);
        setDarpanGuide(data.darpanGuide || null);
        setPersonalizedSchemes(data.personalizedSchemes || []);

        if (data.userProgress) {
          if (data.userProgress.answers) {
            setAnswers(data.userProgress.answers);
          }
          setCheckedDocumentIds(data.userProgress.checkedDocumentIds || []);
          setSavedPortalIds(data.userProgress.savedPortalIds || []);
          setSavedSchemeIds(data.userProgress.savedSchemeIds || []);
        }
      }
    } catch (err) {
      console.error('Error fetching registration guide:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuideData(answers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveProgress = async () => {
    setSavingProgress(true);
    setSaveSuccessMsg(null);
    try {
      const res = await fetch('/api/ngo/registration-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          checkedDocumentIds,
          savedPortalIds,
          savedSchemeIds,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccessMsg('Progress saved successfully! You can return anytime.');
        setTimeout(() => setSaveSuccessMsg(null), 4000);
      }
    } catch (err) {
      console.error('Error saving progress:', err);
    } finally {
      setSavingProgress(false);
    }
  };

  const handleToggleDocument = (docId: string) => {
    setCheckedDocumentIds((prev) => {
      const updated = prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId];
      return updated;
    });
  };

  const handleToggleSavePortal = (portalId: string) => {
    setSavedPortalIds((prev) =>
      prev.includes(portalId) ? prev.filter((id) => id !== portalId) : [...prev, portalId]
    );
  };

  const handleToggleSaveScheme = (schemeId: string) => {
    setSavedSchemeIds((prev) =>
      prev.includes(schemeId) ? prev.filter((id) => id !== schemeId) : [...prev, schemeId]
    );
  };

  const handleQuestionnaireContinue = () => {
    fetchGuideData(answers);
    if (answers.stage === 'Already Registered') {
      setActiveSubTab('already_registered');
    } else if (answers.orgType === 'Not Sure') {
      setActiveSubTab('structures');
    } else {
      setActiveSubTab('roadmap');
    }
  };

  const handleSelectOrgTypeFromComparison = (orgType: OrganisationType) => {
    const updated = { ...answers, orgType };
    setAnswers(updated);
    fetchGuideData(updated);
    setActiveSubTab('roadmap');
  };

  const handleInternalNavigate = (tab: string) => {
    if (tab === 'public-profile' && onNavigateTab) {
      onNavigateTab('public-profile');
    } else if (tab === 'schemes' && onNavigateTab) {
      onNavigateTab('schemes');
    } else {
      setActiveSubTab(tab as GuideSubTab);
    }
  };

  const subTabs: { id: GuideSubTab; label: string; icon: string }[] = [
    { id: 'questionnaire', label: 'Decision Flow', icon: '🧭' },
    { id: 'structures', label: 'Choose Structure', icon: '⚖️' },
    { id: 'roadmap', label: 'Registration Roadmap', icon: '🗺️' },
    { id: 'checklist', label: 'Document Checklist', icon: '📋' },
    { id: 'tax', label: 'Tax & Compliance', icon: '📜' },
    { id: 'portals', label: 'Government Portals', icon: '🏛️' },
    { id: 'darpan', label: 'NGO Darpan', icon: '🆔' },
    { id: 'fcra', label: 'Foreign Aid (FCRA)', icon: '🌐' },
    { id: 'schemes', label: 'Schemes & Support', icon: '🎁' },
  ];

  if (answers.stage === 'Already Registered') {
    subTabs.splice(1, 0, { id: 'already_registered', label: 'Already Registered Track', icon: '🏢' });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Main Title & Action Bar */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem 1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '1.35rem' }}>🏛️</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              NGO Registration & Government Support Guide
            </h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
            Source-driven, official government guidance for starting, registering, and operating non-profit organisations across India.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={handleSaveProgress}
            disabled={savingProgress}
            className="btn-civic btn-civic-primary"
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem', fontWeight: '700' }}
          >
            {savingProgress ? 'Saving...' : '💾 Save My Progress'}
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div
          style={{
            padding: '0.85rem 1rem',
            backgroundColor: 'var(--bg-tint-emerald)',
            border: '1px solid var(--brand-primary)',
            color: 'var(--brand-primary)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
            fontWeight: '600',
          }}
        >
          ✓ {saveSuccessMsg}
        </div>
      )}

      {/* Mandatory Statutory Legal Disclaimer Notice */}
      <div
        style={{
          padding: '0.85rem 1.25rem',
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
        }}
      >
        <span style={{ fontSize: '1.1rem' }}>⚖️</span>
        <div>
          <strong>Statutory Notice:</strong> Government rules, forms, and eligibility requirements can change. SahaySetu provides an official source-based guidance layer and does not replace official government instructions or professional legal/tax advice. Always verify the final requirement on the linked official government portals.
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '0.25rem',
        }}
      >
        {subTabs.map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: isActive ? 'var(--brand-primary)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: isActive ? '700' : '500',
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Retrieving official registration guidelines & statutory requirements...
        </div>
      ) : (
        <div>
          {activeSubTab === 'questionnaire' && (
            <QuestionnaireFlow
              answers={answers}
              onChange={(updated) => setAnswers(updated)}
              onContinue={handleQuestionnaireContinue}
            />
          )}

          {activeSubTab === 'already_registered' && (
            <AlreadyRegisteredView
              answers={answers}
              onNavigateTab={handleInternalNavigate}
            />
          )}

          {activeSubTab === 'structures' && (
            <OrgTypeComparison
              comparisons={comparisons}
              selectedType={answers.orgType}
              onSelectType={handleSelectOrgTypeFromComparison}
            />
          )}

          {activeSubTab === 'roadmap' && roadmap && (
            <RoadmapView
              guide={roadmap}
              onNavigateTab={handleInternalNavigate}
            />
          )}

          {activeSubTab === 'checklist' && (
            <DocumentChecklistView
              documents={checklist}
              checkedIds={checkedDocumentIds}
              onToggleCheck={handleToggleDocument}
              orgType={answers.orgType}
              state={answers.state}
            />
          )}

          {activeSubTab === 'tax' && (
            <TaxComplianceSection taxGuideItems={taxGuide} />
          )}

          {activeSubTab === 'portals' && (
            <PortalsDirectory
              portals={portals}
              savedPortalIds={savedPortalIds}
              onToggleSavePortal={handleToggleSavePortal}
            />
          )}

          {activeSubTab === 'darpan' && darpanGuide && (
            <NgoDarpanGuideView darpanGuide={darpanGuide} />
          )}

          {activeSubTab === 'fcra' && fcraGuide && (
            <FcraGuideView fcraGuide={fcraGuide} />
          )}

          {activeSubTab === 'schemes' && (
            <PersonalizedSchemesSection
              schemes={personalizedSchemes}
              state={answers.state}
              sector={answers.primarySector}
              savedSchemeIds={savedSchemeIds}
              onToggleSaveScheme={handleToggleSaveScheme}
              onExploreCatalog={() => onNavigateTab && onNavigateTab('schemes')}
            />
          )}
        </div>
      )}
    </div>
  );
};
