'use client';

import React from 'react';
import type { DashboardTab } from '@/types/ngo';

interface PublishSummaryCardsProps {
  metrics: {
    activeNeedsCount: number;
    activeCampaignsCount: number;
    upcomingEventsCount: number;
    volunteerOpsCount: number;
    newHelpRequestsCount: number;
  };
  onNavigate: (tab: DashboardTab) => void;
}

export const PublishSummaryCards: React.FC<PublishSummaryCardsProps> = ({
  metrics,
  onNavigate,
}) => {
  const cards = [
    {
      id: 'needs' as DashboardTab,
      label: 'Donation Needs',
      icon: '🎁',
      count: metrics.activeNeedsCount,
      countLabel: metrics.activeNeedsCount === 1 ? '1 active' : `${metrics.activeNeedsCount} active`,
      emptyMessage: 'No active donation needs yet.',
      actionText: 'Manage Needs',
      color: 'var(--brand-primary)',
      bgTint: 'var(--bg-tint-emerald)',
    },
    {
      id: 'campaigns' as DashboardTab,
      label: 'Campaigns',
      icon: '📣',
      count: metrics.activeCampaignsCount,
      countLabel: metrics.activeCampaignsCount === 1 ? '1 active' : `${metrics.activeCampaignsCount} active`,
      emptyMessage: 'No active campaigns yet.',
      actionText: 'Manage Campaigns',
      color: '#0284c7',
      bgTint: '#f0f9ff',
    },
    {
      id: 'events' as DashboardTab,
      label: 'Upcoming Events',
      icon: '📅',
      count: metrics.upcomingEventsCount,
      countLabel: metrics.upcomingEventsCount === 1 ? '1 scheduled' : `${metrics.upcomingEventsCount} scheduled`,
      emptyMessage: 'No upcoming events yet.',
      actionText: 'Manage Events',
      color: '#7c3aed',
      bgTint: '#f5f3ff',
    },
    {
      id: 'volunteer-ops' as DashboardTab,
      label: 'Volunteer Ops',
      icon: '🙋',
      count: metrics.volunteerOpsCount,
      countLabel: metrics.volunteerOpsCount === 1 ? '1 open' : `${metrics.volunteerOpsCount} open`,
      emptyMessage: 'No volunteer openings yet.',
      actionText: 'Manage Opportunities',
      color: '#d97706',
      bgTint: 'var(--bg-tint-amber)',
    },
    {
      id: 'help-requests' as DashboardTab,
      label: 'Help Requests',
      icon: '🆘',
      count: metrics.newHelpRequestsCount,
      countLabel: metrics.newHelpRequestsCount === 1 ? '1 pending' : `${metrics.newHelpRequestsCount} pending`,
      emptyMessage: 'No pending help requests.',
      actionText: 'Review Requests',
      color: metrics.newHelpRequestsCount > 0 ? '#dc2626' : 'var(--text-secondary)',
      bgTint: metrics.newHelpRequestsCount > 0 ? '#fef2f2' : 'var(--bg-subtle)',
    },
  ];

  return (
    <div style={{ margin: '1.75rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
            Community Publishing & Engagement Summary
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
            Real-time counts of your published needs, community drives, and citizen requests.
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '1rem',
        }}
      >
        {cards.map((card) => {
          const hasItems = card.count > 0;
          return (
            <div
              key={card.id}
              role="button"
              tabIndex={0}
              onClick={() => onNavigate(card.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNavigate(card.id);
                }
              }}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '1.15rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-medium)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-light)';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      backgroundColor: card.bgTint,
                      fontSize: '1.15rem',
                    }}
                  >
                    {card.icon}
                  </span>
                  {hasItems && (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: card.color,
                        backgroundColor: card.bgTint,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '9999px',
                      }}
                    >
                      {card.countLabel}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  {card.label}
                </div>

                {hasItems ? (
                  <div style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                    {card.count}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.35rem', fontStyle: 'italic' }}>
                    {card.emptyMessage}
                  </div>
                )}
              </div>

              <div
                style={{
                  marginTop: '0.9rem',
                  paddingTop: '0.65rem',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.775rem',
                  fontWeight: '600',
                  color: 'var(--brand-primary)',
                }}
              >
                <span>{card.actionText}</span>
                <span>→</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
