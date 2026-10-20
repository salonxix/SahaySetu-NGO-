import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ApplicationWizardModal } from '@/components/ngo/application/ApplicationWizardModal';
import { ApplicationDetailsModal } from '@/components/ngo/application/ApplicationDetailsModal';
import { SchemeDetailModal } from '@/components/ngo/schemes/SchemeDetailModal';
import { ApplicationsView } from '@/components/ngo/ApplicationsView';
import { SCHEMES_CATALOG } from '@/lib/ngo/mock-schemes';
import { evaluateSchemeEligibility } from '@/lib/ngo/eligibility-matcher';
import type { NgoUser } from '@/types/auth';
import type { NgoApplication } from '@/types/ngo';

const mockNgoUser: NgoUser = {
  id: 'ngo_123',
  email: 'coordinator@ngo.org',
  passwordHash: 'hash',
  role: 'ngo',
  ngoName: 'Gram Vikas Seva Sansthan',
  registrationNumber: 'DL/2021/0284918',
  focusSector: 'Rural Development',
  contactPerson: 'Aarav Sharma',
  phoneNumber: '+91 9876543210',
  state: 'Delhi',
  city: 'New Delhi',
  address: 'Sector 12, Dwarka',
  verified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('NGO Application Workflow (Phase 6)', () => {
  const scheme = SCHEMES_CATALOG[0]; // Integrated Rural Education Support Grant

  describe('ApplicationWizardModal Flow & Navigation', () => {
    it('renders Step 0 overview with prototype notices and scheme summary', () => {
      render(
        <ApplicationWizardModal
          scheme={scheme}
          ngoUser={mockNgoUser}
          isOpen={true}
          onClose={vi.fn()}
          onSubmitApplication={vi.fn()}
          onSaveDraft={vi.fn()}
          onNavigateToApplications={vi.fn()}
        />
      );

      expect(screen.getByText(/PROTOTYPE APPLICATION/i)).toBeInTheDocument();
      expect(screen.getByText(scheme.name)).toBeInTheDocument();
      expect(screen.getByText(/Prototype Demonstration Notice/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Start Application Form →/i })).toBeInTheDocument();
    });

    it('navigates through steps, displays pre-filled profile, and validates required fields', () => {
      const handleSubmit = vi.fn();
      render(
        <ApplicationWizardModal
          scheme={scheme}
          ngoUser={mockNgoUser}
          isOpen={true}
          onClose={vi.fn()}
          onSubmitApplication={handleSubmit}
          onSaveDraft={vi.fn()}
          onNavigateToApplications={vi.fn()}
        />
      );

      // Step 0 -> Step 1 (Organisation)
      fireEvent.click(screen.getByRole('button', { name: /Start Application Form →/i }));
      expect(screen.getByText(/Pre-filled from your authenticated NGO Profile/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockNgoUser.ngoName)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockNgoUser.registrationNumber)).toBeInTheDocument();

      // Step 1 -> Step 2 (Eligibility)
      fireEvent.click(screen.getByRole('button', { name: /Save & Next →/i }));
      expect(screen.getByText(/Deterministic Criteria Evaluation/i)).toBeInTheDocument();
      expect(screen.getByText(/Eligibility Acknowledgment/i)).toBeInTheDocument();

      // Step 2 -> Step 3 (Project Information)
      fireEvent.click(screen.getByRole('button', { name: /Save & Next →/i }));
      expect(screen.getByText(/Project Proposal & Implementation Details/i)).toBeInTheDocument();

      // Clear required project title to test error validation
      const titleInput = screen.getByLabelText(/Project Title/i);
      fireEvent.change(titleInput, { target: { value: '' } });

      fireEvent.click(screen.getByRole('button', { name: /Save & Next →/i }));
      expect(screen.getByText(/Project proposal title is required/i)).toBeInTheDocument();

      // Fill valid project info
      fireEvent.change(titleInput, { target: { value: 'Rural Children Remedial Learning Program' } });
      fireEvent.change(screen.getByLabelText(/Target Beneficiary Group/i), { target: { value: 'Primary School Children' } });
      fireEvent.change(screen.getByLabelText(/Estimated Beneficiary Count/i), { target: { value: '250' } });
      fireEvent.change(screen.getByLabelText(/Target District \/ Block/i), { target: { value: 'South West Delhi' } });
      fireEvent.change(screen.getByLabelText(/Estimated Budget/i), { target: { value: '500000' } });
      fireEvent.change(screen.getByLabelText(/Project Summary/i), { target: { value: 'Detailed community remedial tutoring program across 5 learning centers.' } });
      fireEvent.change(screen.getByLabelText(/Expected Key Outcomes/i), { target: { value: '250 children supported with learning kits and quarterly progress tracking.' } });

      // Step 3 -> Step 4 (Documents Checklist)
      fireEvent.click(screen.getByRole('button', { name: /Save & Next →/i }));
      expect(screen.getByText(/Mandatory Statutory Documentation Checklist/i)).toBeInTheDocument();

      // Step 4 -> Step 5 (Review & Verify)
      fireEvent.click(screen.getByRole('button', { name: /Save & Next →/i }));
      expect(screen.getByText(/Review Application Before Submission/i)).toBeInTheDocument();
      expect(screen.getByText(/Rural Children Remedial Learning Program/i)).toBeInTheDocument();

      // Test Edit shortcut from Review
      const editButtons = screen.getAllByRole('button', { name: /Edit Section/i });
      expect(editButtons.length).toBe(4);
      fireEvent.click(editButtons[2]); // Edit Step 3
      expect(screen.getByText(/Project Proposal & Implementation Details/i)).toBeInTheDocument();

      // Go back to Review (Step 3 -> Step 4 -> Step 5)
      fireEvent.click(screen.getByRole('button', { name: /Save & Next →/i }));
      fireEvent.click(screen.getByRole('button', { name: /Save & Next →/i }));
      expect(screen.getByText(/Review Application Before Submission/i)).toBeInTheDocument();

      // Submit Prototype Application
      const submitBtn = screen.getByRole('button', { name: /Submit Prototype Application/i });
      fireEvent.click(submitBtn);

      expect(handleSubmit).toHaveBeenCalled();
      expect(screen.getByText(/Application Submitted Successfully/i)).toBeInTheDocument();
      expect(screen.getByText(/SS-DEMO-2026-/i)).toBeInTheDocument();
    });

    it('allows saving incomplete application as draft', () => {
      const handleSaveDraft = vi.fn();
      const handleClose = vi.fn();

      render(
        <ApplicationWizardModal
          scheme={scheme}
          ngoUser={mockNgoUser}
          isOpen={true}
          onClose={handleClose}
          onSubmitApplication={vi.fn()}
          onSaveDraft={handleSaveDraft}
          onNavigateToApplications={vi.fn()}
        />
      );

      // Go to Step 1
      fireEvent.click(screen.getByRole('button', { name: /Start Application Form →/i }));

      const saveDraftBtn = screen.getByRole('button', { name: /Save Draft/i });
      fireEvent.click(saveDraftBtn);

      expect(handleSaveDraft).toHaveBeenCalled();
      expect(handleClose).toHaveBeenCalled();
    });
  });

  describe('SchemeDetailModal Start Application Action', () => {
    it('triggers onStartApplication when button clicked', () => {
      const handleStart = vi.fn();
      const evaluation = evaluateSchemeEligibility(mockNgoUser, scheme);

      render(
        <SchemeDetailModal
          scheme={scheme}
          matchEvaluation={evaluation}
          isSaved={false}
          onToggleSave={vi.fn()}
          onClose={vi.fn()}
          onStartApplication={handleStart}
        />
      );

      const applyBtn = screen.getByRole('button', { name: /Start Prototype Application →/i });
      expect(applyBtn).toBeInTheDocument();
      fireEvent.click(applyBtn);
      expect(handleStart).toHaveBeenCalledWith(scheme);
    });
  });

  describe('ApplicationsView & ApplicationDetailsModal', () => {
    const mockApplications: NgoApplication[] = [
      {
        id: 'app-draft-1',
        schemeTitle: 'Integrated Rural Education Support Grant',
        referenceNumber: 'SS-DRAFT-1234',
        status: 'Draft',
        nextAction: 'Complete Step 3: Project Information',
        lastUpdated: '10 mins ago',
        isSample: true,
      },
      {
        id: 'app-sub-1',
        schemeTitle: 'Grassroots Community Health Worker Subsidy',
        referenceNumber: 'SS-DEMO-2026-9876',
        status: 'Submitted',
        nextAction: 'Under desk appraisal by nodal scheme officer',
        lastUpdated: 'Just now',
        isSample: true,
      },
    ];

    it('renders resume draft button and triggers draft continuation', () => {
      const handleResume = vi.fn();
      render(
        <ApplicationsView
          applications={mockApplications}
          onNavigateToFind={vi.fn()}
          onResumeDraft={handleResume}
        />
      );

      const resumeBtn = screen.getByRole('button', { name: /Continue Draft Application →/i });
      expect(resumeBtn).toBeInTheDocument();
      fireEvent.click(resumeBtn);
      expect(handleResume).toHaveBeenCalledWith(mockApplications[0]);
    });

    it('opens ApplicationDetailsModal and shows submission details', () => {
      render(
        <ApplicationDetailsModal
          application={mockApplications[1]}
          onClose={vi.fn()}
        />
      );

      expect(screen.getByText(/Ref: SS-DEMO-2026-9876/i)).toBeInTheDocument();
      expect(screen.getByText(/Grassroots Community Health Worker Subsidy/i)).toBeInTheDocument();
      expect(screen.getByText(/Under desk appraisal by nodal scheme officer/i)).toBeInTheDocument();
      expect(screen.getByText(/Prototype Data Notice/i)).toBeInTheDocument();
    });
  });
});
