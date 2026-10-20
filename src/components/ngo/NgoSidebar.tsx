'use client';

import React from 'react';
import Link from 'next/link';
import type { DashboardTab } from '@/types/ngo';
import type { NgoUser } from '@/types/auth';

interface NgoSidebarProps {
  currentTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  ngoUser: NgoUser | null;
  savedCount: number;
  actionRequiredCount: number;
  activeNeedsCount?: number;
  pendingRequestsCount?: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
}

export const NgoSidebar: React.FC<NgoSidebarProps> = ({
  currentTab,
  onTabChange,
  ngoUser,
  savedCount,
  actionRequiredCount,
  activeNeedsCount = 0,
  pendingRequestsCount = 0,
  isOpenMobile,
  onCloseMobile,
  onLogout,
}) => {
  const navItems: {
    id: DashboardTab;
    label: string;
    icon: string;
    badge?: number;
    badgeVariant?: 'warning' | 'neutral' | 'urgent';
  }[] = [
    { id: 'dashboard', label: 'Overview', icon: '📊' },
    { id: 'registration-guide', label: 'Start / Register NGO', icon: '🏛️' },
    { id: 'schemes', label: 'Find Schemes', icon: '🔍' },
    {
      id: 'saved',
      label: 'Saved Schemes',
      icon: '📌',
      badge: savedCount > 0 ? savedCount : undefined,
      badgeVariant: 'neutral',
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: '📝',
      badge: actionRequiredCount > 0 ? actionRequiredCount : undefined,
      badgeVariant: 'warning',
    },
    { id: 'documents', label: 'Documents', icon: '📁' },
    {
      id: 'needs',
      label: 'Donation Needs',
      icon: '🎁',
      badge: activeNeedsCount > 0 ? activeNeedsCount : undefined,
      badgeVariant: 'neutral',
    },
    { id: 'campaigns', label: 'Campaigns', icon: '📣' },
    { id: 'events', label: 'Events', icon: '📅' },
    { id: 'volunteer-ops', label: 'Volunteer Opportunities', icon: '🙋' },
    {
      id: 'help-requests',
      label: 'Incoming Help Requests',
      icon: '🆘',
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
      badgeVariant: 'warning',
    },
    { id: 'public-profile', label: 'Public Profile', icon: '🏢' },
    { id: 'opportunities', label: 'Opportunities', icon: '🤝' },
    { id: 'help', label: 'Help', icon: '❓' },
  ];

  const handleSelect = (tab: DashboardTab) => {
    onTabChange(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            zIndex: 40,
          }}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation Container */}
      <aside
        className={`ngo-sidebar ${isOpenMobile ? 'sidebar-open' : ''}`}
        style={{
          width: '260px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: 45,
          transition: 'transform 0.25s ease',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                backgroundColor: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '0.9rem',
              }}
            >
              एस
            </div>
            <div>
              <span
                style={{
                  fontSize: '1.15rem',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  display: 'block',
                  lineHeight: '1.2',
                }}
              >
                SahaySetu
              </span>
              <span
                style={{
                  fontSize: '0.725rem',
                  fontWeight: '600',
                  color: 'var(--brand-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                NGO Workspace
              </span>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="mobile-sidebar-close"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              fontSize: '1.2rem',
              cursor: 'pointer',
              color: 'var(--text-muted)',
            }}
            aria-label="Close navigation"
          >
            ✕
          </button>
        </div>

        {/* NGO Info Badge in Sidebar */}
        <div
          style={{
            padding: '1rem 1.5rem',
            backgroundColor: 'var(--bg-subtle)',
            borderBottom: '1px solid var(--border-light)',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
            }}
          >
            Active Organisation
          </span>
          <strong
            style={{
              display: 'block',
              fontSize: '0.9rem',
              color: 'var(--text-primary)',
              marginTop: '0.2rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={ngoUser?.ngoName || 'NGO Partner'}
          >
            {ngoUser?.ngoName || 'NGO Partner'}
          </strong>
          <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
            Darpan: {ngoUser?.registrationNumber || 'Not set'}
          </span>
        </div>

        {/* Navigation Items */}
        <nav
          style={{
            padding: '1rem 0.75rem',
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
          }}
          aria-label="NGO Dashboard Sections"
        >
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: isActive ? 'var(--bg-tint-emerald)' : 'transparent',
                  color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? '600' : '500',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                  transition: 'background-color 0.15s ease',
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ fontSize: '1.05rem' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </span>

                {item.badge !== undefined && (
                  <span
                    style={{
                      fontSize: '0.725rem',
                      fontWeight: '700',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '9999px',
                      backgroundColor:
                        item.badgeVariant === 'warning'
                          ? '#fef3c7'
                          : 'var(--border-light)',
                      color:
                        item.badgeVariant === 'warning'
                          ? '#b45309'
                          : 'var(--text-secondary)',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderTop: '1px solid var(--border-light)',
            backgroundColor: '#ffffff',
          }}
        >
          <button
            type="button"
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.6rem 0.75rem',
              backgroundColor: 'transparent',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
