'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { GeneralUser } from '@/types/auth';
import type {
  PublicNgoOrg,
  UserLocation,
  DonationType,
  NgoCauseCategory,
  ViewMode,
} from '@/types/user-portal';
import { ALL_HELP_SERVICES, type HelpServiceCategory } from '@/types/ngo-publish';
import { DEFAULT_USER_LOCATION } from '@/lib/user/distance';
import { UserHeader, type UserTab, type UserMode } from '@/components/user/UserHeader';
import { LocationSelectorModal } from '@/components/user/LocationSelectorModal';
import { DonationTypeFilter } from '@/components/user/DonationTypeFilter';
import { UserFilterBar } from '@/components/user/UserFilterBar';
import { NgoInteractiveMap } from '@/components/user/NgoInteractiveMap';
import { NgoCard } from '@/components/user/NgoCard';
import { NgoPublicProfileModal } from '@/components/user/NgoPublicProfileModal';
import { DirectionsModal } from '@/components/user/DirectionsModal';
import { CampaignsView } from '@/components/user/CampaignsView';
import { EventsView } from '@/components/user/EventsView';
import { SavedNgosView } from '@/components/user/SavedNgosView';
import { MyHelpRequestsView } from '@/components/user/MyHelpRequestsView';
import { RequestHelpModal } from '@/components/user/RequestHelpModal';
import { MOCK_PUBLIC_NGOS } from '@/lib/user/mock-ngos';
import { calculateDistanceKm } from '@/lib/user/distance';

export default function UserDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const citizen = user as unknown as GeneralUser;

  // Portal State
  const [userMode, setUserMode] = useState<UserMode>('help_others');
  const [activeTab, setActiveTab] = useState<UserTab>('explore');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [userLocation, setUserLocation] = useState<UserLocation>(DEFAULT_USER_LOCATION);

  // Filter States
  const [distance, setDistance] = useState<number | 'all'>(10);
  const [cause, setCause] = useState<NgoCauseCategory | 'all'>('all');
  const [selectedDonationTypes, setSelectedDonationTypes] = useState<DonationType[]>([]);
  const [selectedHelpService, setSelectedHelpService] = useState<HelpServiceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Data & Saved States
  const [ngos, setNgos] = useState<PublicNgoOrg[]>([]);
  const [savedNgoIds, setSavedNgoIds] = useState<string[]>([]);
  const [myRequestsCount, setMyRequestsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Modals
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [profileModalNgo, setProfileModalNgo] = useState<PublicNgoOrg | null>(null);
  const [directionsModalNgo, setDirectionsModalNgo] = useState<PublicNgoOrg | null>(null);
  const [helpModalNgo, setHelpModalNgo] = useState<PublicNgoOrg | null>(null);

  // 1. Fetch user preferences, initial saved NGOs, and user help requests count
  useEffect(() => {
    async function loadPreferences() {
      try {
        const res = await fetch('/api/user/preferences');
        if (res.ok) {
          const json = await res.json();
          if (json.preferences) {
            if (json.preferences.defaultLocation) {
              setUserLocation(json.preferences.defaultLocation);
            }
            if (json.preferences.preferredDistanceKm) {
              setDistance(json.preferences.preferredDistanceKm);
            }
            if (json.preferences.preferredDonationTypes?.length > 0) {
              setSelectedDonationTypes(json.preferences.preferredDonationTypes);
            }
            if (json.preferences.savedNgoIds) {
              setSavedNgoIds(json.preferences.savedNgoIds);
            }
          }
        }

        // Fetch user help requests count
        const reqRes = await fetch('/api/user/help-requests');
        if (reqRes.ok) {
          const reqJson = await reqRes.json();
          if (reqJson.requests && Array.isArray(reqJson.requests)) {
            setMyRequestsCount(reqJson.requests.length);
          }
        }
      } catch (err) {
        console.error('Failed to load user preferences:', err);
      }
    }

    if (user) {
      loadPreferences();
    }
  }, [user]);

  const fallbackCalculateNgos = useCallback(() => {
    const list = MOCK_PUBLIC_NGOS.map((ngo) => {
      const dist = calculateDistanceKm(
        userLocation.latitude,
        userLocation.longitude,
        ngo.latitude,
        ngo.longitude
      );
      return {
        ...ngo,
        distanceKm: dist,
        activeCampaigns: ngo.activeCampaigns.map((c) => ({ ...c, distanceKm: dist })),
        upcomingEvents: ngo.upcomingEvents.map((e) => ({ ...e, distanceKm: dist })),
      };
    }).filter((ngo) => {
      if (distance !== 'all' && (ngo.distanceKm ?? 0) > distance) return false;
      if (cause !== 'all' && !ngo.primaryCauses.includes(cause)) return false;

      if (userMode === 'help_others') {
        if (selectedDonationTypes.length > 0) {
          const matches = selectedDonationTypes.some((t) => ngo.acceptedDonationTypes.includes(t));
          if (!matches) return false;
        }
      } else if (userMode === 'need_help') {
        if (selectedHelpService !== 'all') {
          const services = ngo.servicesProvided || [];
          const matches = services.some((s) => s.toLowerCase() === selectedHelpService.toLowerCase());
          if (!matches) return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = ngo.name.toLowerCase().includes(q);
        const matchesNeeds = ngo.currentNeeds.some((n) => n.item.toLowerCase().includes(q));
        if (!matchesName && !matchesNeeds) return false;
      }
      return true;
    }).sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

    setNgos(list);
  }, [userLocation, distance, cause, userMode, selectedDonationTypes, selectedHelpService, searchQuery]);

  // 2. Fetch filtered NGOs from backend API
  const fetchNgos = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('lat', String(userLocation.latitude));
      params.set('lon', String(userLocation.longitude));
      params.set('label', userLocation.label);
      params.set('city', userLocation.city);
      params.set('distance', String(distance));
      if (cause !== 'all') params.set('cause', cause);

      if (userMode === 'help_others') {
        if (selectedDonationTypes.length > 0) {
          params.set('donations', selectedDonationTypes.join(','));
        }
      } else if (userMode === 'need_help') {
        if (selectedHelpService !== 'all') {
          params.set('service', selectedHelpService);
        }
      }

      if (searchQuery.trim()) {
        params.set('query', searchQuery.trim());
      }

      const res = await fetch(`/api/user/ngos?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setNgos(data.data || []);
      } else {
        fallbackCalculateNgos();
      }
    } catch {
      fallbackCalculateNgos();
    } finally {
      setLoading(false);
    }
  }, [userLocation, distance, cause, userMode, selectedDonationTypes, selectedHelpService, searchQuery, fallbackCalculateNgos]);

  useEffect(() => {
    fetchNgos();
  }, [fetchNgos]);

  // 3. Handle Save / Bookmark toggle
  const handleToggleSave = async (ngoId: string) => {
    const currentlySaved = savedNgoIds.includes(ngoId);
    const updatedIds = currentlySaved
      ? savedNgoIds.filter((id) => id !== ngoId)
      : [...savedNgoIds, ngoId];

    setSavedNgoIds(updatedIds);
    setFeedbackNotice(currentlySaved ? 'Organisation removed from saved list.' : 'Organisation saved successfully!');
    setTimeout(() => setFeedbackNotice(null), 3500);

    try {
      await fetch('/api/user/saved-ngos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ngoId }),
      });
    } catch (err) {
      console.error('Failed to sync saved NGO:', err);
    }
  };

  // 4. Handle Location Change
  const handleSelectLocation = async (newLoc: UserLocation) => {
    setUserLocation(newLoc);
    try {
      await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ defaultLocation: newLoc }),
      });
    } catch {}
  };

  const handleResetFilters = () => {
    setDistance('all');
    setCause('all');
    setSelectedDonationTypes([]);
    setSelectedHelpService('all');
    setSearchQuery('');
  };

  const hasActiveFilters =
    distance !== 'all' ||
    cause !== 'all' ||
    selectedDonationTypes.length > 0 ||
    selectedHelpService !== 'all' ||
    searchQuery.trim() !== '';

  const allCalculatedNgos = MOCK_PUBLIC_NGOS.map((n) => ({
    ...n,
    distanceKm: calculateDistanceKm(userLocation.latitude, userLocation.longitude, n.latitude, n.longitude),
  }));

  const totalCampaignsCount = ngos.reduce((acc, n) => acc + n.activeCampaigns.length, 0);
  const totalEventsCount = ngos.reduce((acc, n) => acc + n.upcomingEvents.length, 0);
  const savedNgos = allCalculatedNgos.filter((n) => savedNgoIds.includes(n.id));

  if (authLoading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading citizen portal...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '80vh', backgroundColor: 'var(--bg-canvas)' }}>
      {/* User Header with mode toggle, location badge, and tabs */}
      <UserHeader
        userName={citizen?.fullName}
        userLocation={userLocation}
        onOpenLocationModal={() => setLocationModalOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        mode={userMode}
        onModeChange={setUserMode}
        savedCount={savedNgoIds.length}
        totalNgosCount={ngos.length}
        activeCampaignsCount={totalCampaignsCount}
        upcomingEventsCount={totalEventsCount}
        myRequestsCount={myRequestsCount}
      />

      <main className="container" style={{ padding: '2rem 1.5rem 4rem 1.5rem' }}>
        {/* Toast / Feedback Notice */}
        {feedbackNotice && (
          <div
            className="alert-box alert-success"
            style={{
              marginBottom: '1.5rem',
              animation: 'fadeIn 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>✓ {feedbackNotice}</span>
            <button
              type="button"
              onClick={() => setFeedbackNotice(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab 1: Explore / Discover */}
        {activeTab === 'explore' && (
          <div>
            {/* Mode 1: "I Want to Help" Donation Type Filter */}
            {userMode === 'help_others' && (
              <DonationTypeFilter
                selectedTypes={selectedDonationTypes}
                onChange={setSelectedDonationTypes}
              />
            )}

            {/* Mode 2: "I Need Help" Assistance Category Filter */}
            {userMode === 'need_help' && (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem 1.5rem',
                  marginBottom: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                      What kind of assistance do you need?
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
                      Select a service to find verified non-profits offering direct support in your district.
                    </p>
                  </div>
                  {selectedHelpService !== 'all' && (
                    <button
                      type="button"
                      onClick={() => setSelectedHelpService('all')}
                      style={{ background: 'none', border: 'none', color: 'var(--brand-accent)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                    >
                      Show All Services
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedHelpService('all')}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '9999px',
                      border: selectedHelpService === 'all' ? '1px solid var(--brand-accent)' : '1px solid var(--border-medium)',
                      backgroundColor: selectedHelpService === 'all' ? 'var(--bg-tint-amber)' : '#ffffff',
                      color: selectedHelpService === 'all' ? 'var(--brand-accent)' : 'var(--text-secondary)',
                      fontSize: '0.825rem',
                      fontWeight: selectedHelpService === 'all' ? '700' : '500',
                      cursor: 'pointer',
                    }}
                  >
                    🌟 All Services
                  </button>

                  {ALL_HELP_SERVICES.map((srv) => {
                    const isSelected = selectedHelpService === srv.id;
                    return (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => setSelectedHelpService(srv.id)}
                        style={{
                          padding: '0.4rem 0.85rem',
                          borderRadius: '9999px',
                          border: isSelected ? '1px solid var(--brand-accent)' : '1px solid var(--border-medium)',
                          backgroundColor: isSelected ? 'var(--bg-tint-amber)' : '#ffffff',
                          color: isSelected ? 'var(--brand-accent)' : 'var(--text-primary)',
                          fontSize: '0.825rem',
                          fontWeight: isSelected ? '700' : '500',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <span>{srv.icon}</span>
                        <span>{srv.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Filter Bar (Distance, Cause, Search & View Toggle) */}
            <UserFilterBar
              distance={distance}
              onDistanceChange={setDistance}
              cause={cause}
              onCauseChange={setCause}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              totalResults={ngos.length}
              onResetFilters={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
            />

            {/* Mode Banner Feedback */}
            {userMode === 'need_help' && selectedHelpService !== 'all' && (
              <div
                style={{
                  backgroundColor: 'var(--bg-tint-amber)',
                  border: '1px solid #fde68a',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.75rem 1rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.85rem',
                  color: '#92400e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>🆘</span>
                <span>
                  Showing organisations near <strong>{userLocation.label}</strong> providing <strong>{selectedHelpService}</strong>.
                </span>
              </div>
            )}

            {/* Loading Indicator */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                Searching nearby organisations...
              </div>
            ) : ngos.length === 0 ? (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '3.5rem 2rem',
                  textAlign: 'center',
                  maxWidth: '680px',
                  margin: '0 auto',
                }}
              >
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>🔍</span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  No organisations found matching your criteria
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                  {distance !== 'all'
                    ? `No organisations found within ${distance} km of ${userLocation.label}. Try increasing your search radius or resetting filters.`
                    : 'No non-profits currently match the selected cause or search keywords.'}
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {distance !== 'all' && (
                    <button
                      type="button"
                      onClick={() => setDistance('all')}
                      className="btn-civic btn-civic-secondary"
                    >
                      Expand Radius to All Distances
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="btn-civic btn-civic-primary"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            ) : viewMode === 'map' ? (
              <NgoInteractiveMap
                ngos={ngos}
                userLocation={userLocation}
                onSelectNgo={setProfileModalNgo}
                onGetDirections={setDirectionsModalNgo}
              />
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {ngos.map((ngo) => (
                  <NgoCard
                    key={ngo.id}
                    ngo={ngo}
                    isSaved={savedNgoIds.includes(ngo.id)}
                    onToggleSave={handleToggleSave}
                    onViewDetails={setProfileModalNgo}
                    onGetDirections={setDirectionsModalNgo}
                    onRequestHelp={(targetNgo) => setHelpModalNgo(targetNgo)}
                    selectedDonationTypes={selectedDonationTypes}
                    needHelpMode={userMode === 'need_help'}
                    selectedHelpService={selectedHelpService}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Campaigns */}
        {activeTab === 'campaigns' && (
          <CampaignsView
            ngos={ngos}
            onViewNgo={setProfileModalNgo}
          />
        )}

        {/* Tab 3: Events */}
        {activeTab === 'events' && (
          <EventsView
            ngos={ngos}
            onViewNgo={setProfileModalNgo}
            onGetDirections={setDirectionsModalNgo}
          />
        )}

        {/* Tab 4: Saved Organisations */}
        {activeTab === 'saved' && (
          <SavedNgosView
            savedNgos={savedNgos}
            savedNgoIds={savedNgoIds}
            onToggleSave={handleToggleSave}
            onViewDetails={setProfileModalNgo}
            onGetDirections={setDirectionsModalNgo}
            onExploreClick={() => setActiveTab('explore')}
          />
        )}

        {/* Tab 5: My Assistance Requests */}
        {activeTab === 'my-requests' && (
          <MyHelpRequestsView
            onNavigateToExplore={() => {
              setUserMode('need_help');
              setActiveTab('explore');
            }}
          />
        )}
      </main>

      {/* Location Selector Modal */}
      <LocationSelectorModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        currentLocation={userLocation}
        onSelectLocation={handleSelectLocation}
      />

      {/* NGO Public Profile Modal */}
      <NgoPublicProfileModal
        ngo={profileModalNgo}
        isOpen={!!profileModalNgo}
        onClose={() => setProfileModalNgo(null)}
        isSaved={profileModalNgo ? savedNgoIds.includes(profileModalNgo.id) : false}
        onToggleSave={handleToggleSave}
        onGetDirections={(ngo) => {
          setProfileModalNgo(null);
          setDirectionsModalNgo(ngo);
        }}
        onRequestHelp={(ngo) => {
          setProfileModalNgo(null);
          setHelpModalNgo(ngo);
        }}
      />

      {/* Directions Modal */}
      <DirectionsModal
        ngo={directionsModalNgo}
        userLocation={userLocation}
        isOpen={!!directionsModalNgo}
        onClose={() => setDirectionsModalNgo(null)}
      />

      {/* Request Help Modal */}
      <RequestHelpModal
        ngo={helpModalNgo}
        isOpen={!!helpModalNgo}
        onClose={() => setHelpModalNgo(null)}
        defaultCategory={selectedHelpService !== 'all' ? selectedHelpService : 'Education support'}
        onSuccess={() => {
          setFeedbackNotice('Your help request has been sent to the organisation. You can track its status under "My Assistance Requests".');
          setMyRequestsCount((prev) => prev + 1);
          setTimeout(() => setFeedbackNotice(null), 5000);
        }}
      />
    </div>
  );
}
