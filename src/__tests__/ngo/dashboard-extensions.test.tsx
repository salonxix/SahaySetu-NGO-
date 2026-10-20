import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NgoSidebar } from '@/components/ngo/NgoSidebar';
import { PublishSummaryCards } from '@/components/ngo/PublishSummaryCards';
import type { NgoUser } from '@/types/auth';

const mockNgoUser: NgoUser = {
  id: 'usr_test_01',
  email: 'test@ngo.org',
  passwordHash: 'hash',
  role: 'ngo',
  ngoName: 'Gram Vikas Seva Sansthan',
  registrationNumber: 'DL/2021/0284918',
  focusSector: 'Education',
  state: 'Delhi',
  city: 'New Delhi',
  contactPerson: 'Aarav Sharma',
  phoneNumber: '+91 9876543210',
  address: 'Dwarka',
  verified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('NGO Dashboard 14 Navigation Sections & Overview Cards', () => {
  it('renders all 14 required navigation sections in the sidebar', () => {
    const handleTabChange = vi.fn();
    render(
      <NgoSidebar
        currentTab="dashboard"
        onTabChange={handleTabChange}
        ngoUser={mockNgoUser}
        savedCount={2}
        actionRequiredCount={1}
        activeNeedsCount={3}
        pendingRequestsCount={4}
        isOpenMobile={false}
        onCloseMobile={vi.fn()}
        onLogout={vi.fn()}
      />
    );

    // Verify all 14 items exist
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

    // Verify clicking Donation Needs triggers tab change
    fireEvent.click(screen.getByText('Donation Needs'));
    expect(handleTabChange).toHaveBeenCalledWith('needs');

    // Verify clicking Incoming Help Requests triggers tab change
    fireEvent.click(screen.getByText('Incoming Help Requests'));
    expect(handleTabChange).toHaveBeenCalledWith('help-requests');
  });

  it('renders overview summary cards with real counts and handles empty states gracefully', () => {
    const handleNavigate = vi.fn();
    const metrics = {
      activeNeedsCount: 3,
      activeCampaignsCount: 2,
      upcomingEventsCount: 1,
      volunteerOpsCount: 0,
      newHelpRequestsCount: 4,
    };

    render(<PublishSummaryCards metrics={metrics} onNavigate={handleNavigate} />);

    expect(screen.getByText('Donation Needs')).toBeInTheDocument();
    expect(screen.getByText('3 active')).toBeInTheDocument();
    expect(screen.getByText('2 active')).toBeInTheDocument();
    expect(screen.getByText('1 scheduled')).toBeInTheDocument();
    expect(screen.getByText('4 pending')).toBeInTheDocument();
    expect(screen.getByText('No volunteer openings yet.')).toBeInTheDocument();

    // Navigate when clicked
    fireEvent.click(screen.getByText('Donation Needs'));
    expect(handleNavigate).toHaveBeenCalledWith('needs');
  });
});
