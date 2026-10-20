'use client';

import React from 'react';
import type { DashboardTab } from '@/types/ngo';
import type { NgoUser } from '@/types/auth';

interface NgoTopBarProps {
  currentTab: DashboardTab;
  ngoUser: NgoUser | null;
  onOpenMobileNav: () => void;
  actionRequiredCount: number;
}

export const NgoTopBar: React.FC<NgoTopBarProps> = ({
  currentTab,
  ngoUser,
  onOpenMobileNav,
  actionRequiredCount,
}) => {
  const getTabTitle = (tab: DashboardTab) => {
    switch (tab) {
      case 'dashboard':
        return 'Overview';
      case 'registration-guide':
        return 'NGO Registration & Government Support Guide';
      case 'schemes':
        return 'Find Government Schemes';
      case 'saved':
        return 'Saved Opportunities';
      case 'applications':
        return 'Application Tracking';
      case 'documents':
        return 'Statutory & Compliance Documents';
      case 'opportunities':
        return 'CSR & Collaboration Opportunities';
      case 'needs':
        return 'Donation Needs';
      case 'campaigns':
        return 'Active Campaigns';
      case 'events':
        return 'Community Drives & Events';
      case 'volunteer-ops':
        return 'Volunteer Opportunities';
      case 'help-requests':
        return 'Incoming Help Requests';
      case 'public-profile':
        return 'Public Organisation Profile';
      case 'help':
        return 'Help & Guidance';
      default:
        return 'Overview';
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'NGO';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <header
      style={{
        height: '64px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="mobile-nav-trigger"
          aria-label="Open sidebar menu"
          style={{
            display: 'none',
            background: 'none',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.4rem 0.6rem',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          ☰
        </button>

        <div>
          <h1 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            {getTabTitle(currentTab)}
          </h1>
        </div>
      </div>

      {/* Top right: Organisation Status & Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Notification summary */}
        {actionRequiredCount > 0 ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#fef3c7',
              border: '1px solid #fde68a',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.775rem',
              color: '#92400e',
              fontWeight: '600',
            }}
          >
            <span>⚠️</span>
            <span>{actionRequiredCount} Action Required</span>
          </div>
        ) : (
          <div
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span style={{ color: '#059669' }}>●</span> All systems up to date
          </div>
        )}

        {/* User / Organization Profile indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-tint-emerald)',
              color: 'var(--brand-primary)',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '0.8rem',
            }}
            aria-hidden="true"
          >
            {getInitials(ngoUser?.ngoName || 'NGO')}
          </div>

          <div className="topbar-user-details" style={{ textAlign: 'left' }}>
            <strong
              style={{
                display: 'block',
                fontSize: '0.85rem',
                color: 'var(--text-primary)',
                lineHeight: '1.2',
                maxWidth: '180px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {ngoUser?.contactPerson || ngoUser?.ngoName || 'Coordinator'}
            </strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Verified NGO Coordinator
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
