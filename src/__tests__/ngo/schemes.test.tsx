import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SchemeDiscoveryView } from '@/components/ngo/schemes/SchemeDiscoveryView';
import { SchemeCard } from '@/components/ngo/schemes/SchemeCard';
import { SchemeDetailModal } from '@/components/ngo/schemes/SchemeDetailModal';
import { SCHEMES_CATALOG } from '@/lib/ngo/mock-schemes';
import { evaluateSchemeEligibility } from '@/lib/ngo/eligibility-matcher';
import type { NgoUser } from '@/types/auth';

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

describe('Scheme Discovery Experience', () => {
  describe('Deterministic Eligibility Evaluator', () => {
    it('returns high match score when sector and state match NGO profile', () => {
      const ruralScheme = SCHEMES_CATALOG.find((s) => s.id === 'sch-04')!;
      const evaluation = evaluateSchemeEligibility(mockNgoUser, ruralScheme);

      expect(evaluation.overallScore).toBeGreaterThanOrEqual(70);
      expect(evaluation.criteriaResults.length).toBeGreaterThan(0);
      expect(evaluation.matchReasons.length).toBeGreaterThan(0);
      expect(evaluation.matchReasons[0]).toContain('Rural Development');
    });

    it('returns lower score and warning criteria when NGO profile has mismatching sector', () => {
      const disabilityScheme = SCHEMES_CATALOG.find((s) => s.id === 'sch-07')!;
      const evaluation = evaluateSchemeEligibility(mockNgoUser, disabilityScheme);

      expect(evaluation.overallScore).toBeLessThan(70);
      const sectorResult = evaluation.criteriaResults.find((c) => c.criterionId === 'sector-match');
      expect(sectorResult?.status).toBe('needs_attention');
    });

    it('handles unauthenticated/null user gracefully with neutral eligibility status', () => {
      const scheme = SCHEMES_CATALOG[0];
      const evaluation = evaluateSchemeEligibility(null, scheme);

      expect(evaluation.overallScore).toBeLessThanOrEqual(50);
      expect(evaluation.criteriaResults.some((c) => c.status === 'unclear')).toBe(true);
    });
  });

  describe('SchemeDiscoveryView Catalog & Search', () => {
    it('renders search input and all catalog schemes initially', () => {
      render(
        <SchemeDiscoveryView
          ngoUser={mockNgoUser}
          savedSchemeIds={new Set(['sch-01'])}
          onToggleSave={vi.fn()}
        />
      );

      expect(screen.getByPlaceholderText(/Search schemes by name/i)).toBeInTheDocument();
      expect(screen.getByText(/Integrated Rural Education Support Grant/i)).toBeInTheDocument();
      expect(screen.getByText(/Grassroots Community Health Worker Subsidy/i)).toBeInTheDocument();
      expect(screen.getByText(/Showing 8 matching schemes/i)).toBeInTheDocument();
    });

    it('filters schemes dynamically by keyword search', () => {
      render(
        <SchemeDiscoveryView
          ngoUser={mockNgoUser}
          savedSchemeIds={new Set()}
          onToggleSave={vi.fn()}
        />
      );

      const searchInput = screen.getByPlaceholderText(/Search schemes by name/i);
      fireEvent.change(searchInput, { target: { value: 'Water' } });

      expect(screen.getByText(/Decentralized Clean Water Quality Monitoring Aid/i)).toBeInTheDocument();
      expect(screen.queryByText(/Grassroots Community Health Worker Subsidy/i)).not.toBeInTheDocument();
    });

    it('shows empty state when no schemes match filters and allows reset', () => {
      render(
        <SchemeDiscoveryView
          ngoUser={mockNgoUser}
          savedSchemeIds={new Set()}
          onToggleSave={vi.fn()}
        />
      );

      const searchInput = screen.getByPlaceholderText(/Search schemes by name/i);
      fireEvent.change(searchInput, { target: { value: 'NonExistentSchemeQueryXYZ' } });

      expect(screen.getByText(/No schemes found/i)).toBeInTheDocument();

      const clearBtns = screen.getAllByRole('button', { name: /Clear all filters/i });
      fireEvent.click(clearBtns[0]);

      expect(screen.getByText(/Integrated Rural Education Support Grant/i)).toBeInTheDocument();
    });
  });

  describe('SchemeDetailModal & Information Architecture', () => {
    it('opens scheme detail modal and presents structured sections', () => {
      const handleToggleSave = vi.fn();
      const scheme = SCHEMES_CATALOG[0];
      const evaluation = evaluateSchemeEligibility(mockNgoUser, scheme);

      render(
        <SchemeDetailModal
          scheme={scheme}
          matchEvaluation={evaluation}
          isSaved={false}
          onToggleSave={handleToggleSave}
          onClose={vi.fn()}
        />
      );

      expect(screen.getByText(scheme.name)).toBeInTheDocument();
      expect(screen.getByText(/1\. Scheme Overview & Objective/i)).toBeInTheDocument();
      expect(screen.getByText(/2\. Target Beneficiaries & Geographic Scope/i)).toBeInTheDocument();
      expect(screen.getByText(/3\. Eligibility & Profile Match Evaluation/i)).toBeInTheDocument();
      expect(screen.getByText(/4\. Mandatory Statutory Documents/i)).toBeInTheDocument();
      expect(screen.getByText(/5\. Step-by-Step Application Process/i)).toBeInTheDocument();
      expect(screen.getByText(/Prototype Sample Data/i)).toBeInTheDocument();

      // Save button inside modal
      const modalSaveBtn = screen.getByRole('button', { name: /Bookmark & Save Scheme/i });
      fireEvent.click(modalSaveBtn);
      expect(handleToggleSave).toHaveBeenCalledWith(scheme.id);
    });

    it('renders close button and triggers modal closure', () => {
      const handleClose = vi.fn();
      const scheme = SCHEMES_CATALOG[0];

      render(
        <SchemeDetailModal
          scheme={scheme}
          matchEvaluation={null}
          isSaved={false}
          onToggleSave={vi.fn()}
          onClose={handleClose}
        />
      );

      const closeButtons = screen.getAllByRole('button', { name: /Close|✕/i });
      fireEvent.click(closeButtons[0]);
      expect(handleClose).toHaveBeenCalled();
    });
  });

  describe('SchemeCard Interaction', () => {
    it('allows toggling save state on individual card', () => {
      const handleToggleSave = vi.fn();
      const handleSelect = vi.fn();
      const scheme = SCHEMES_CATALOG[0];
      const evaluation = evaluateSchemeEligibility(mockNgoUser, scheme);

      render(
        <SchemeCard
          scheme={scheme}
          isSaved={false}
          matchEvaluation={evaluation}
          onToggleSave={handleToggleSave}
          onViewDetails={handleSelect}
        />
      );

      const saveBtn = screen.getByRole('button', { name: new RegExp(`Save ${scheme.name}`, 'i') });
      fireEvent.click(saveBtn);
      expect(handleToggleSave).toHaveBeenCalledWith(scheme.id);

      const detailsBtn = screen.getByRole('button', { name: /View Full Details & Criteria/i });
      fireEvent.click(detailsBtn);
      expect(handleSelect).toHaveBeenCalledWith(scheme);
    });
  });
});
