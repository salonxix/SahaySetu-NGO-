'use client';

import React from 'react';
import type { UserLocation } from '@/types/user-portal';
import Link from 'next/link';

export type UserTab = 'explore' | 'campaigns' | 'events' | 'saved' | 'my-requests';
export type UserMode = 'help_others' | 'need_help';

interface UserHeaderProps {
  userName?: string;
  userLocation: UserLocation;
  onOpenLocationModal: () => void;
  activeTab: UserTab;
  onTabChange: (tab: UserTab) => void;
  mode: UserMode;
  onModeChange: (mode: UserMode) => void;
  savedCount: number;
  totalNgosCount: number;
  activeCampaignsCount: number;
  upcomingEventsCount: number;
  myRequestsCount?: number;
}

export const UserHeader: React.FC<UserHeaderProps> = ({
  userName,
  userLocation,
  onOpenLocationModal,
  activeTab,
  onTabChange,
  mode,
  onModeChange,
  savedCount,
  totalNgosCount,
  activeCampaignsCount,
  upcomingEventsCount,
  myRequestsCount = 0,
}) => {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-light)',
        padding: '1.5rem 0 0 0',
      }}
    >
      <div className="container">
        {/* Top greeting & location banner */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: 'var(--brand-primary)',
                  backgroundColor: 'var(--bg-tint-emerald)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <span>🤝</span> Citizen & Donor Portal
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>•</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {mode === 'need_help' ? 'Direct Assistance Discovery' : 'Community Contribution'}
              </span>
            </div>

            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: '1.2',
              }}
            >
              {userName ? `Namaste, ${userName}` : 'Discover Local Non-Profits & Ways to Connect'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginTop: '0.25rem' }}>
              {mode === 'need_help'
                ? 'Find grassroots non-profits providing direct assistance in education, medical, food, and citizen welfare.'
                : 'Find grassroots organisations in your neighbourhood, explore what they need, and contribute practical help.'}
            </p>
          </div>

          {/* Right Controls: Mode Toggle & Location */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', alignItems: 'flex-end' }}>
            {/* Mode Switch: I Want to Help vs I Need Help */}
            <div
              style={{
                backgroundColor: 'var(--bg-canvas)',
                padding: '0.25rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-medium)',
                display: 'inline-flex',
                gap: '0.25rem',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  onModeChange('help_others');
                  if (activeTab === 'my-requests') onTabChange('explore');
                }}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-xs)',
                  border: 'none',
                  backgroundColor: mode === 'help_others' ? 'var(--brand-primary)' : 'transparent',
                  color: mode === 'help_others' ? '#ffffff' : 'var(--text-secondary)',
                  fontSize: '0.825rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span>🎁</span> I Want to Help
              </button>

              <button
                type="button"
                onClick={() => {
                  onModeChange('need_help');
                  if (activeTab === 'campaigns' || activeTab === 'events') onTabChange('explore');
                }}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-xs)',
                  border: 'none',
                  backgroundColor: mode === 'need_help' ? 'var(--brand-accent)' : 'transparent',
                  color: mode === 'need_help' ? '#ffffff' : 'var(--text-secondary)',
                  fontSize: '0.825rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span>🆘</span> I Need Help
              </button>
            </div>

            {/* Location Selector Pill */}
            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '0.5rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  📍 {userLocation.label}
                </strong>
              </div>
              <button
                type="button"
                onClick={onOpenLocationModal}
                className="btn-civic btn-civic-secondary"
                style={{
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.75rem',
                  whiteSpace: 'nowrap',
                }}
                aria-label="Change current location"
              >
                Change Location
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav
          aria-label="User Portal Navigation"
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            borderBottom: 'none',
            paddingBottom: '0',
          }}
        >
          <button
            type="button"
            onClick={() => onTabChange('explore')}
            aria-selected={activeTab === 'explore'}
            role="tab"
            style={{
              padding: '0.75rem 1.15rem',
              fontSize: '0.9rem',
              fontWeight: activeTab === 'explore' ? '600' : '500',
              color: activeTab === 'explore' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'explore' ? '3px solid var(--brand-primary)' : '3px solid transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.15s ease',
            }}
          >
            <span>🏘️ {mode === 'need_help' ? 'Nearby Support Organisations' : 'Nearby Organisations'}</span>
            <span
              style={{
                fontSize: '0.75rem',
                backgroundColor: activeTab === 'explore' ? 'var(--bg-tint-emerald)' : 'var(--bg-subtle)',
                color: activeTab === 'explore' ? 'var(--brand-primary)' : 'var(--text-muted)',
                padding: '0.1rem 0.45rem',
                borderRadius: '9999px',
                fontWeight: '700',
              }}
            >
              {totalNgosCount}
            </span>
          </button>

          {mode === 'help_others' && (
            <>
              <button
                type="button"
                onClick={() => onTabChange('campaigns')}
                aria-selected={activeTab === 'campaigns'}
                role="tab"
                style={{
                  padding: '0.75rem 1.15rem',
                  fontSize: '0.9rem',
                  fontWeight: activeTab === 'campaigns' ? '600' : '500',
                  color: activeTab === 'campaigns' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  border: 'none',
                  background: 'none',
                  borderBottom: activeTab === 'campaigns' ? '3px solid var(--brand-primary)' : '3px solid transparent',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>📢 Active Campaigns</span>
                {activeCampaignsCount > 0 && (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      backgroundColor: activeTab === 'campaigns' ? 'var(--bg-tint-emerald)' : 'var(--bg-subtle)',
                      color: activeTab === 'campaigns' ? 'var(--brand-primary)' : 'var(--text-muted)',
                      padding: '0.1rem 0.45rem',
                      borderRadius: '9999px',
                      fontWeight: '700',
                    }}
                  >
                    {activeCampaignsCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => onTabChange('events')}
                aria-selected={activeTab === 'events'}
                role="tab"
                style={{
                  padding: '0.75rem 1.15rem',
                  fontSize: '0.9rem',
                  fontWeight: activeTab === 'events' ? '600' : '500',
                  color: activeTab === 'events' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  border: 'none',
                  background: 'none',
                  borderBottom: activeTab === 'events' ? '3px solid var(--brand-primary)' : '3px solid transparent',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>📅 Upcoming Events</span>
                {upcomingEventsCount > 0 && (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      backgroundColor: activeTab === 'events' ? 'var(--bg-tint-emerald)' : 'var(--bg-subtle)',
                      color: activeTab === 'events' ? 'var(--brand-primary)' : 'var(--text-muted)',
                      padding: '0.1rem 0.45rem',
                      borderRadius: '9999px',
                      fontWeight: '700',
                    }}
                  >
                    {upcomingEventsCount}
                  </span>
                )}
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => onTabChange('saved')}
            aria-selected={activeTab === 'saved'}
            role="tab"
            style={{
              padding: '0.75rem 1.15rem',
              fontSize: '0.9rem',
              fontWeight: activeTab === 'saved' ? '600' : '500',
              color: activeTab === 'saved' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'saved' ? '3px solid var(--brand-primary)' : '3px solid transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.15s ease',
            }}
          >
            <span>⭐ Saved Organisations</span>
            {savedCount > 0 && (
              <span
                style={{
                  fontSize: '0.75rem',
                  backgroundColor: activeTab === 'saved' ? 'var(--bg-tint-amber)' : 'var(--bg-subtle)',
                  color: activeTab === 'saved' ? 'var(--brand-accent)' : 'var(--text-muted)',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '9999px',
                  fontWeight: '700',
                }}
              >
                {savedCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange('my-requests')}
            aria-selected={activeTab === 'my-requests'}
            role="tab"
            style={{
              padding: '0.75rem 1.15rem',
              fontSize: '0.9rem',
              fontWeight: activeTab === 'my-requests' ? '600' : '500',
              color: activeTab === 'my-requests' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'my-requests' ? '3px solid var(--brand-primary)' : '3px solid transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.15s ease',
            }}
          >
            <span>📋 My Assistance Requests</span>
            {myRequestsCount > 0 && (
              <span
                style={{
                  fontSize: '0.75rem',
                  backgroundColor: activeTab === 'my-requests' ? 'var(--bg-tint-emerald)' : 'var(--bg-subtle)',
                  color: activeTab === 'my-requests' ? 'var(--brand-primary)' : 'var(--text-muted)',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '9999px',
                  fontWeight: '700',
                }}
              >
                {myRequestsCount}
              </span>
            )}
          </button>

          <Link
            href="/user/profile"
            style={{
              marginLeft: 'auto',
              padding: '0.75rem 1rem',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span>👤</span> My Profile
          </Link>
        </nav>
      </div>
    </div>
  );
};
