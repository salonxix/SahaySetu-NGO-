import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QuestionnaireFlow } from '@/components/ngo/registration-guide/QuestionnaireFlow';
import { OrgTypeComparison } from '@/components/ngo/registration-guide/OrgTypeComparison';
import { RoadmapView } from '@/components/ngo/registration-guide/RoadmapView';
import { DocumentChecklistView } from '@/components/ngo/registration-guide/DocumentChecklistView';
import { TaxComplianceSection } from '@/components/ngo/registration-guide/TaxComplianceSection';
import { PortalsDirectory } from '@/components/ngo/registration-guide/PortalsDirectory';
import { NgoDarpanGuideView } from '@/components/ngo/registration-guide/NgoDarpanGuideView';
import { FcraGuideView } from '@/components/ngo/registration-guide/FcraGuideView';
import { AlreadyRegisteredView } from '@/components/ngo/registration-guide/AlreadyRegisteredView';
import { RegistrationGuideView } from '@/components/ngo/registration-guide/RegistrationGuideView';
import { GuideStore } from '@/lib/government-sources/guide-store';
import type { QuestionnaireAnswers } from '@/types/registration-guide';
import type { NgoUser } from '@/types/auth';

const mockNgoUser: NgoUser = {
  id: 'usr_guide_test',
  email: 'founder@ngo.org',
  passwordHash: 'hash',
  role: 'ngo',
  ngoName: 'Aarohan Foundation',
  registrationNumber: 'DL/2022/999888',
  focusSector: 'Education',
  state: 'Delhi',
  city: 'New Delhi',
  contactPerson: 'Meera Sen',
  phoneNumber: '+91 9988776655',
  address: 'Connaught Place',
  verified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('NGO Registration Guide UI Components', () => {
  describe('QuestionnaireFlow', () => {
    it('renders 5 interactive decision steps and triggers update callbacks', () => {
      const handleChange = vi.fn();
      const handleContinue = vi.fn();

      const answers: QuestionnaireAnswers = {
        stage: 'Starting New',
        orgType: 'Trust',
        state: 'Delhi',
        primarySector: 'Education',
        objectives: ['donations', 'schemes'],
      };

      render(
        <QuestionnaireFlow
          answers={answers}
          onChange={handleChange}
          onContinue={handleContinue}
        />
      );

      expect(screen.getByText(/Decision Wizard & Personalization/i)).toBeInTheDocument();
      expect(screen.getByText(/A. Are you starting a new organisation/i)).toBeInTheDocument();
      expect(screen.getByText(/B. What type of organisation/i)).toBeInTheDocument();
      expect(screen.getByText(/C. State of Operation/i)).toBeInTheDocument();

      // Click "Already Registered" option
      const alreadyRegBtn = screen.getByRole('button', { name: /Already registered organisation/i });
      fireEvent.click(alreadyRegBtn);
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({ stage: 'Already Registered' })
      );

      // Click Continue
      const continueBtn = screen.getByRole('button', { name: /Generate My Personalized Guide & Roadmap/i });
      fireEvent.click(continueBtn);
      expect(handleContinue).toHaveBeenCalled();
    });
  });

  describe('OrgTypeComparison', () => {
    it('renders comparative cards with dual-level explanations and allows selection', async () => {
      const comparisons = await GuideStore.getOrganisationTypeComparisons('Delhi');
      const handleSelect = vi.fn();

      render(
        <OrgTypeComparison
          comparisons={comparisons}
          selectedType="Trust"
          onSelectType={handleSelect}
        />
      );

      expect(screen.getByText(/Neutral Statutory Guidance/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Public Charitable Trust/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Society/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Section 8 Company/i).length).toBeGreaterThan(0);

      // Select Section 8
      const section8SelectBtn = screen.getByRole('button', { name: /Select Section 8 Company/i });
      fireEvent.click(section8SelectBtn);
      expect(handleSelect).toHaveBeenCalledWith('Section 8 Company');
    });
  });

  describe('RoadmapView', () => {
    it('renders step-by-step sequential workflow with progressive disclosure', async () => {
      const roadmap = await GuideStore.getStateRegistrationGuide('Delhi', 'Section 8 Company');
      const handleNavigate = vi.fn();

      render(<RoadmapView guide={roadmap} onNavigateTab={handleNavigate} />);

      expect(screen.getByText(/Step-by-Step Registration Roadmap/i)).toBeInTheDocument();
      expect(screen.getByText(/Step 1:/i)).toBeInTheDocument();
      expect(screen.getByText(/What do I do next\?/i)).toBeInTheDocument();

      // Expand step 2
      const step2Header = screen.getByText(/Step 2:/i);
      fireEvent.click(step2Header);
      expect(screen.getAllByText(/SPICe\+ Part A/i).length).toBeGreaterThan(0);
    });
  });

  describe('DocumentChecklistView', () => {
    it('renders dynamic checklist items and calculates completion percentage', async () => {
      const checklist = await GuideStore.getDocumentChecklist('Trust', 'Delhi');
      const handleToggle = vi.fn();

      render(
        <DocumentChecklistView
          documents={checklist}
          checkedIds={[checklist[0].id]}
          onToggleCheck={handleToggle}
          orgType="Trust"
          state="Delhi"
        />
      );

      expect(screen.getByText(/Documents & Information Checklist/i)).toBeInTheDocument();
      expect(screen.getByText(/1 of 5 Ready/i)).toBeInTheDocument();

      // Toggle first item
      const checkbox = screen.getAllByRole('checkbox')[0];
      fireEvent.click(checkbox);
      expect(handleToggle).toHaveBeenCalledWith(checklist[0].id);
    });
  });

  describe('TaxComplianceSection', () => {
    it('renders Form 104 and Form 105 official tax compliance procedures with source attribution', async () => {
      const taxItems = await GuideStore.getTaxComplianceGuide();

      render(<TaxComplianceSection taxGuideItems={taxItems} />);

      expect(screen.getByText(/Statutory Tax Readiness & Donor Deductions/i)).toBeInTheDocument();
      expect(screen.getByText(/Tax & Donation Readiness/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Provisional Registration/i).length).toBeGreaterThan(0);
    });
  });

  describe('PortalsDirectory', () => {
    it('renders verified portals and allows search and filtering', async () => {
      const portals = await GuideStore.getGovernmentPortals();
      const handleSave = vi.fn();

      render(
        <PortalsDirectory
          portals={portals}
          savedPortalIds={[]}
          onToggleSavePortal={handleSave}
        />
      );

      expect(screen.getByText(/Official Government Portals Directory/i)).toBeInTheDocument();

      // Search
      const searchInput = screen.getByPlaceholderText(/Search portals/i);
      fireEvent.change(searchInput, { target: { value: 'Darpan' } });
      expect(screen.getByText(/NGO Darpan Portal/i)).toBeInTheDocument();
      expect(screen.queryByText(/MahaCharity/i)).not.toBeInTheDocument();
    });
  });

  describe('NgoDarpanGuideView & FcraGuideView', () => {
    it('renders NGO Darpan registration steps and official NITI Aayog details', async () => {
      const darpan = await GuideStore.getNgoDarpanGuide();
      render(<NgoDarpanGuideView darpanGuide={darpan} />);

      expect(screen.getByText(/NGO Darpan Registration & Unique ID Guide/i)).toBeInTheDocument();
      expect(screen.getByText(/NITI Aayog & National Informatics Centre/i)).toBeInTheDocument();
      expect(screen.getByText(/Account Creation \(Sign Up\)/i)).toBeInTheDocument();
    });

    it('renders FCRA dual routes (FC-3B prior permission vs FC-3A 5-year registration)', async () => {
      const fcra = await GuideStore.getFcraGuide();
      render(<FcraGuideView fcraGuide={fcra} />);

      expect(screen.getByText(/Foreign Contribution \(FCRA\) Statutory Regulatory Guide/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Form FC-3B/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Form FC-3A/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/State Bank of India \(SBI\)/i).length).toBeGreaterThan(0);
    });
  });

  describe('AlreadyRegisteredView', () => {
    it('renders growth and compliance track for established NGOs', () => {
      const handleNavigate = vi.fn();
      render(
        <AlreadyRegisteredView
          answers={{
            stage: 'Already Registered',
            orgType: 'Trust',
            state: 'Delhi',
            primarySector: 'Education',
            objectives: ['donations', 'schemes'],
          }}
          onNavigateTab={handleNavigate}
        />
      );

      expect(screen.getByText(/Already Registered\? Next Steps for Compliance/i)).toBeInTheDocument();
      expect(screen.getByText(/Regular Income Tax Registration \(Form 105\)/i)).toBeInTheDocument();
      expect(screen.getByText(/NGO Darpan Unique ID \(NITI Aayog\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Publish Needs & Services on SahaySetu/i)).toBeInTheDocument();

      // Click navigate to public profile
      const pubProfileBtn = screen.getByRole('button', { name: /Configure Public Profile/i });
      fireEvent.click(pubProfileBtn);
      expect(handleNavigate).toHaveBeenCalledWith('public-profile');
    });
  });

  describe('RegistrationGuideView Integrated Component', () => {
    beforeEach(() => {
      vi.stubGlobal(
        'fetch',
        vi.fn(async (url: string) => {
          if (url.includes('/api/ngo/registration-guide')) {
            const comparisons = await GuideStore.getOrganisationTypeComparisons('Delhi');
            const roadmap = await GuideStore.getStateRegistrationGuide('Delhi', 'Trust');
            const checklist = await GuideStore.getDocumentChecklist('Trust', 'Delhi');
            const portals = await GuideStore.getGovernmentPortals();
            const taxGuide = await GuideStore.getTaxComplianceGuide();
            const fcraGuide = await GuideStore.getFcraGuide();
            const darpanGuide = await GuideStore.getNgoDarpanGuide();
            const personalizedSchemes = GuideStore.getPersonalizedSchemes('Delhi', 'Education');

            return Promise.resolve({
              ok: true,
              json: () =>
                Promise.resolve({
                  success: true,
                  comparisons,
                  roadmap,
                  checklist,
                  portals,
                  taxGuide,
                  fcraGuide,
                  darpanGuide,
                  personalizedSchemes,
                  userProgress: {
                    answers: {
                      stage: 'Starting New',
                      orgType: 'Trust',
                      state: 'Delhi',
                      primarySector: 'Education',
                      objectives: ['donations', 'schemes'],
                    },
                    checkedDocumentIds: [],
                    savedPortalIds: [],
                    savedSchemeIds: [],
                  },
                }),
            });
          }
          return Promise.reject(new Error('Unknown URL'));
        })
      );
    });

    it('loads data from source API and renders sub-navigation tabs', async () => {
      render(<RegistrationGuideView ngoUser={mockNgoUser} />);

      await waitFor(() => {
        expect(screen.getByText(/NGO Registration & Government Support Guide/i)).toBeInTheDocument();
      });

      expect(screen.getByRole('button', { name: /Decision Flow/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Choose Structure/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Registration Roadmap/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Document Checklist/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Tax & Compliance/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Government Portals/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /NGO Darpan/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Foreign Aid/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Schemes & Support/i })).toBeInTheDocument();

      // Switch to Choose Structure tab
      const structuresTabBtn = screen.getByRole('button', { name: /Choose Structure/i });
      fireEvent.click(structuresTabBtn);

      expect(screen.getByText(/Neutral Statutory Guidance/i)).toBeInTheDocument();
    });
  });
});
