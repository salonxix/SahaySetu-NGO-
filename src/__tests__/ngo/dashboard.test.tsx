import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NgoSidebar } from '@/components/ngo/NgoSidebar';
import { ProfileCompleteness } from '@/components/ngo/ProfileCompleteness';
import { SavedSchemesView } from '@/components/ngo/SavedSchemesView';
import { ApplicationsView } from '@/components/ngo/ApplicationsView';
import { RecommendedSchemes } from '@/components/ngo/RecommendedSchemes';
import { ActionRequired } from '@/components/ngo/ActionRequired';
import { DocumentsView } from '@/components/ngo/DocumentsView';
import { DEMO_APPLICATIONS, DEMO_DOCUMENTS } from '@/lib/ngo/mock-data';
import { SCHEMES_CATALOG } from '@/lib/ngo/mock-schemes';
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

describe('NGO Dashboard Components & Workflows', () => {
  describe('NgoSidebar Navigation', () => {
    it('renders all navigation tabs and logout action', () => {
      const handleTabChange = vi.fn();
      const handleLogout = vi.fn();

      render(
        <NgoSidebar
          currentTab="dashboard"
          onTabChange={handleTabChange}
          ngoUser={mockNgoUser}
          savedCount={2}
          actionRequiredCount={1}
          isOpenMobile={false}
          onCloseMobile={vi.fn()}
          onLogout={handleLogout}
        />
      );

      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Start / Register NGO')).toBeInTheDocument();
      expect(screen.getByText('Find Schemes')).toBeInTheDocument();
      expect(screen.getByText('Saved Schemes')).toBeInTheDocument();
      expect(screen.getByText('Applications')).toBeInTheDocument();
      expect(screen.getByText('Documents')).toBeInTheDocument();
      expect(screen.getByText('Donation Needs')).toBeInTheDocument();
      expect(screen.getByText('Campaigns')).toBeInTheDocument();
      expect(screen.getByText('Events')).toBeInTheDocument();
      expect(screen.getByText('Volunteer Opportunities')).toBeInTheDocument();
      expect(screen.getByText('Incoming Help Requests')).toBeInTheDocument();
      expect(screen.getByText('Public Profile')).toBeInTheDocument();
      expect(screen.getByText('Opportunities')).toBeInTheDocument();
      expect(screen.getByText('Help')).toBeInTheDocument();

      const logoutBtn = screen.getByRole('button', { name: /Sign Out/i });
      expect(logoutBtn).toBeInTheDocument();
      fireEvent.click(logoutBtn);
      expect(handleLogout).toHaveBeenCalled();
    });

    it('triggers tab change when clicked', () => {
      const handleTabChange = vi.fn();
      render(
        <NgoSidebar
          currentTab="dashboard"
          onTabChange={handleTabChange}
          ngoUser={mockNgoUser}
          savedCount={0}
          actionRequiredCount={0}
          isOpenMobile={false}
          onCloseMobile={vi.fn()}
          onLogout={vi.fn()}
        />
      );

      const findSchemesBtn = screen.getByRole('button', { name: /Find Schemes/i });
      fireEvent.click(findSchemesBtn);
      expect(handleTabChange).toHaveBeenCalledWith('schemes');
    });
  });

  describe('ProfileCompleteness Calculator', () => {
    it('renders 100% complete state when all profile fields are present', () => {
      const handleNavigate = vi.fn();
      render(
        <ProfileCompleteness
          ngoUser={mockNgoUser}
          onNavigateToProfile={handleNavigate}
        />
      );

      expect(screen.getByText(/100% Complete/i)).toBeInTheDocument();
    });

    it('calculates partial completeness accurately when fields are missing', () => {
      const partialUser: NgoUser = {
        ...mockNgoUser,
        city: '',
        address: '',
      };

      render(
        <ProfileCompleteness
          ngoUser={partialUser}
          onNavigateToProfile={vi.fn()}
        />
      );

      expect(screen.getByText(/78% Complete/i)).toBeInTheDocument();
      expect(screen.getByText(/Pending fields to update:/i)).toBeInTheDocument();
    });
  });

  describe('ActionRequired Section', () => {
    it('renders urgent tasks and allows navigation', () => {
      const handleNavigate = vi.fn();
      render(
        <ActionRequired
          onNavigate={handleNavigate}
          isProfileIncomplete={true}
          missingDocCount={1}
          pendingAppCount={1}
        />
      );

      expect(screen.getByText(/Needs your attention/i)).toBeInTheDocument();
      expect(screen.getByText(/Action required on ongoing application/i)).toBeInTheDocument();

      const resolveBtn = screen.getByRole('button', { name: /Resolve Application Issue/i });
      fireEvent.click(resolveBtn);
      expect(handleNavigate).toHaveBeenCalledWith('applications');
    });
  });

  describe('RecommendedSchemes', () => {
    it('renders demo recommendations with save toggle', () => {
      const handleToggleSave = vi.fn();
      render(
        <RecommendedSchemes
          schemes={SCHEMES_CATALOG}
          savedSchemeIds={new Set(['sch-01'])}
          onToggleSave={handleToggleSave}
          onExploreAll={vi.fn()}
          ngoUser={mockNgoUser}
        />
      );

      expect(screen.getByText(/Recommended for your NGO/i)).toBeInTheDocument();
      expect(screen.getByText(/Integrated Rural Education Support Grant/i)).toBeInTheDocument();

      const saveBtns = screen.getAllByRole('button', { name: /Save|Saved/i });
      expect(saveBtns.length).toBeGreaterThan(0);
      fireEvent.click(saveBtns[0]);
      expect(handleToggleSave).toHaveBeenCalledWith('sch-01');
    });
  });

  describe('SavedSchemesView Empty States', () => {
    it('renders informative empty state when no schemes are saved', () => {
      const handleFind = vi.fn();
      render(
        <SavedSchemesView
          savedSchemes={[]}
          onRemoveSaved={vi.fn()}
          onNavigateToFind={handleFind}
        />
      );

      expect(screen.getByText(/No saved schemes yet/i)).toBeInTheDocument();
      expect(
        screen.getByText(/When you bookmark welfare opportunities/i)
      ).toBeInTheDocument();

      const exploreBtn = screen.getByRole('button', { name: /Explore Available Schemes/i });
      fireEvent.click(exploreBtn);
      expect(handleFind).toHaveBeenCalled();
    });
  });

  describe('ApplicationsView', () => {
    it('renders application statuses and reference IDs', () => {
      render(
        <ApplicationsView
          applications={DEMO_APPLICATIONS}
          onNavigateToFind={vi.fn()}
        />
      );

      expect(screen.getByText(/Application Tracker/i)).toBeInTheDocument();
      expect(screen.getByText(/SCH-EDU-2026-0891/i)).toBeInTheDocument();
      expect(screen.getByText(/Action Required/i)).toBeInTheDocument();
    });
  });

  describe('DocumentsView', () => {
    it('renders statutory checklist and highlights missing compliance items', () => {
      render(<DocumentsView documents={DEMO_DOCUMENTS} />);

      expect(screen.getByText(/Statutory Document Vault & Compliance/i)).toBeInTheDocument();
      expect(screen.getByText(/NGO Darpan Registration Certificate/i)).toBeInTheDocument();
      expect(screen.getByText(/Annual Audited Financial Statements/i)).toBeInTheDocument();
    });
  });
});
