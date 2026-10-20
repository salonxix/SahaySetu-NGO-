import React from 'react';
import type { DashboardTab } from '@/types/ngo';

interface ActionItem {
  id: string;
  title: string;
  description: string;
  urgency: 'high' | 'medium';
  actionLabel: string;
  targetTab: DashboardTab;
}

interface ActionRequiredProps {
  onNavigate: (tab: DashboardTab) => void;
  isProfileIncomplete: boolean;
  missingDocCount: number;
  pendingAppCount: number;
}

export const ActionRequired: React.FC<ActionRequiredProps> = ({
  onNavigate,
  isProfileIncomplete,
  missingDocCount,
  pendingAppCount,
}) => {
  const actions: ActionItem[] = [];

  if (pendingAppCount > 0) {
    actions.push({
      id: 'act-app',
      title: 'Action required on ongoing application',
      description: 'Upload audited balance sheet for FY 2024-25 by 30th Sep for the Rural Education Support Grant.',
      urgency: 'high',
      actionLabel: 'Resolve Application Issue',
      targetTab: 'applications',
    });
  }

  if (missingDocCount > 0) {
    actions.push({
      id: 'act-doc',
      title: 'Missing statutory compliance documents',
      description: `${missingDocCount} required compliance document(s) need attention for central grant eligibility.`,
      urgency: 'medium',
      actionLabel: 'Check Document Vault',
      targetTab: 'documents',
    });
  }

  if (isProfileIncomplete) {
    actions.push({
      id: 'act-prof',
      title: 'NGO profile details incomplete',
      description: 'Fill in your city and address details to unlock precise district-level scheme matching.',
      urgency: 'medium',
      actionLabel: 'Update Profile',
      targetTab: 'public-profile',
    });
  }

  if (actions.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #fed7aa',
        borderRadius: 'var(--radius-md)',
        padding: '1.5rem 1.75rem',
        marginBottom: '1.75rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '1.2rem' }}>⚠️</span>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#9a3412' }}>
          Needs your attention ({actions.length})
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {actions.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.25rem',
              backgroundColor: 'var(--bg-tint-amber)',
              border: '1px solid #fed7aa',
              borderRadius: 'var(--radius-sm)',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ maxWidth: '650px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <strong style={{ fontSize: '0.95rem', color: '#7c2d12' }}>
                  {item.title}
                </strong>
                {item.urgency === 'high' && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Urgent
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.875rem', color: '#9a3412', margin: 0 }}>
                {item.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate(item.targetTab)}
              className="btn-civic"
              style={{
                padding: '0.45rem 0.9rem',
                fontSize: '0.85rem',
                backgroundColor: '#9a3412',
                color: '#ffffff',
                border: 'none',
              }}
            >
              {item.actionLabel} →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
