import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserDashboardPage from '@/app/user/dashboard/page';
import { UserStore } from '@/lib/db/user-store';
import { DEFAULT_USER_LOCATION } from '@/lib/user/distance';
import type { DonationType, NgoCauseCategory } from '@/types/user-portal';

// Mock AuthContext
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'usr_demo_citizen_01',
      fullName: 'Pooja Verma',
      email: 'citizen@sahaysetu.org',
      role: 'user',
      state: 'Delhi NCR',
    },
    loading: false,
    logout: vi.fn(),
  }),
}));

describe('User / Donor Dashboard Experience', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    // Mock global fetch to route to UserStore logic in jsdom
    global.fetch = vi.fn().mockImplementation(async (url: string | URL | Request) => {
      const urlStr = url.toString();

      if (urlStr.includes('/api/user/preferences')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            preferences: {
              defaultLocation: DEFAULT_USER_LOCATION,
              preferredDistanceKm: 10,
              preferredDonationTypes: [],
              savedNgoIds: [],
            },
          }),
        };
      }

      if (urlStr.includes('/api/user/saved-ngos')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            savedNgoIds: [],
          }),
        };
      }

      if (urlStr.includes('/api/user/ngos')) {
        const u = new URL(urlStr, 'http://localhost:3000');
        const lat = parseFloat(u.searchParams.get('lat') || '28.6304');
        const lon = parseFloat(u.searchParams.get('lon') || '77.2177');
        const distance = u.searchParams.get('distance') || '10';
        const donations = u.searchParams.get('donations')
          ? (u.searchParams.get('donations')?.split(',') as DonationType[])
          : undefined;
        const cause = (u.searchParams.get('cause') as NgoCauseCategory) || undefined;
        const query = u.searchParams.get('query') || undefined;

        const ngos = await UserStore.getPublicNgos({
          userLocation: {
            label: 'Selected Location',
            city: 'Delhi',
            state: 'Delhi',
            latitude: lat,
            longitude: lon,
            isCustomOrBrowser: true,
          },
          maxDistanceKm: distance === 'all' ? 'all' : Number(distance),
          donationTypes: donations,
          cause,
          searchQuery: query,
        });

        return {
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            data: ngos,
            total: ngos.length,
          }),
        };
      }

      return {
        ok: false,
        status: 404,
        json: async () => ({ error: 'Not found' }),
      };
    }) as unknown as typeof fetch;
  });

  it('renders dashboard with citizen greeting, location pill, and navigation tabs', async () => {
    render(<UserDashboardPage />);

    expect(screen.getByText(/Namaste, Pooja Verma/i)).toBeInTheDocument();
    expect(screen.getByText(/📍 Connaught Place \/ Central Delhi/i)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Nearby Organisations/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Active Campaigns/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Upcoming Events/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Saved Organisations/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/Searching nearby organisations.../i)).not.toBeInTheDocument();
    });
  });

  it('allows user to open location modal and pick a different hub', async () => {
    render(<UserDashboardPage />);

    await waitFor(() => {
      expect(screen.queryByText(/Searching nearby organisations.../i)).not.toBeInTheDocument();
    });

    const changeLocBtn = screen.getByRole('button', { name: /Change current location/i });
    fireEvent.click(changeLocBtn);

    expect(screen.getByText(/Choose Your Location/i)).toBeInTheDocument();
    expect(screen.getByText(/Privacy Guarantee/i)).toBeInTheDocument();

    // Select South Delhi / Hauz Khas
    const southDelhiBtn = screen.getByText(/📍 South Delhi \/ Hauz Khas/i);
    fireEvent.click(southDelhiBtn);

    // Modal closes and location pill updates
    await waitFor(() => {
      expect(screen.getByText(/📍 South Delhi \/ Hauz Khas/i)).toBeInTheDocument();
    });
  });

  it('filters organisations by contribution type when clicked (e.g. Books)', async () => {
    render(<UserDashboardPage />);

    await waitFor(() => {
      expect(screen.queryByText(/Searching nearby organisations.../i)).not.toBeInTheDocument();
    });

    // Click on Books chip
    const booksButton = screen.getByRole('button', { name: /Books/i });
    fireEvent.click(booksButton);

    await waitFor(() => {
      expect(screen.getByText(/1 type selected/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Accepted Contributions:/i).length).toBeGreaterThan(0);
    });
  });

  it('switches between List View and Map View', async () => {
    render(<UserDashboardPage />);

    await waitFor(() => {
      expect(screen.queryByText(/Searching nearby organisations.../i)).not.toBeInTheDocument();
    });

    const mapBtn = screen.getByRole('button', { name: /Map View/i });
    fireEvent.click(mapBtn);

    await waitFor(() => {
      expect(screen.getByText(/Interactive Community Proximity Map/i)).toBeInTheDocument();
      expect(screen.getByRole('img', { name: /Interactive map showing nearby NGOs/i })).toBeInTheDocument();
    });

    const listBtn = screen.getByRole('button', { name: /List View/i });
    fireEvent.click(listBtn);

    const viewBtns = await screen.findAllByRole('button', { name: /View Details/i });
    expect(viewBtns.length).toBeGreaterThan(0);
  });

  it('opens NGO public profile modal and displays current needs with statuses', async () => {
    render(<UserDashboardPage />);

    const viewButtons = await screen.findAllByRole('button', { name: /View Details/i });
    expect(viewButtons.length).toBeGreaterThan(0);

    // Click View Organisation on first visible card
    fireEvent.click(viewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Statutory Published Needs Checklist/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Accepting Contributions/i).length).toBeGreaterThan(0);
    });

    // Switch to Contact tab inside modal
    const contactTab = screen.getByRole('tab', { name: /Services & Contact/i });
    fireEvent.click(contactTab);

    expect(screen.getByText(/Help Services & Contact Channels/i)).toBeInTheDocument();
    expect(screen.getByText(/Get Step-by-Step Directions/i)).toBeInTheDocument();
  });

  it('opens Directions modal with transit estimates and external links', async () => {
    render(<UserDashboardPage />);

    const dirButtons = await screen.findAllByRole('button', { name: /Get directions to/i });
    expect(dirButtons.length).toBeGreaterThan(0);

    fireEvent.click(dirButtons[0]);

    expect(await screen.findByRole('heading', { name: /Route & Directions/i })).toBeInTheDocument();
    expect(screen.getByText(/Open in Google Maps/i)).toBeInTheDocument();
    expect(screen.getByText(/Open in OpenStreetMap/i)).toBeInTheDocument();
  });

  it('allows saving an organisation and viewing it under Saved Organisations tab', async () => {
    render(<UserDashboardPage />);

    const saveButtons = await screen.findAllByRole('button', { name: /^Save /i });
    expect(saveButtons.length).toBeGreaterThan(0);

    // Save first NGO
    fireEvent.click(saveButtons[0]);

    // Switch to Saved tab
    const savedTab = screen.getByRole('tab', { name: /Saved Organisations/i });
    fireEvent.click(savedTab);

    await waitFor(() => {
      expect(screen.getByText(/⭐ Saved Organisations & Shortlist/i)).toBeInTheDocument();
      expect(screen.getByText(/1 Saved/i)).toBeInTheDocument();
    });
  });

  it('displays empty state with recovery actions when filter yields no results', async () => {
    render(<UserDashboardPage />);

    const viewButtons = await screen.findAllByRole('button', { name: /View Details/i });
    expect(viewButtons.length).toBeGreaterThan(0);

    // Search something nonexistent
    const searchInput = screen.getByPlaceholderText(/Search by name, cause, needs.../i);
    fireEvent.change(searchInput, { target: { value: 'nonexistentxyz123' } });

    expect(await screen.findByText(/No organisations found matching your criteria/i)).toBeInTheDocument();
    const resetButtons = screen.getAllByRole('button', { name: /Reset All Filters/i });
    expect(resetButtons.length).toBeGreaterThan(0);

    // Click Reset
    fireEvent.click(resetButtons[0]);
    await waitFor(() => {
      expect(screen.queryByText(/No organisations found matching your criteria/i)).not.toBeInTheDocument();
    });
  });
});
