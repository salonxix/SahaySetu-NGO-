import React from 'react';
import type { NgoUser } from '@/types/auth';

interface WelcomeBannerProps {
  ngoUser: NgoUser | null;
  pendingActionsCount: number;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  ngoUser,
  pendingActionsCount,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const name =
    ngoUser?.contactPerson ||
    ngoUser?.ngoName ||
    'NGO Coordinator';

  return (
    <div
      className="card animate-entrance"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        padding: '1.75rem 2rem',
        marginBottom: '1.75rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: '600',
              color: 'var(--brand-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              display: 'block',
              marginBottom: '0.25rem',
            }}
          >
            Organisation Dashboard
          </span>
          <h2 style={{ fontSize: '1.65rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            {getGreeting()}, {name}.
          </h2>
          <p className="body-text" style={{ fontSize: '0.95rem' }}>
            {pendingActionsCount > 0
              ? `Here’s what needs your attention today across schemes, compliance, and ongoing applications.`
              : `All your applications and compliance documents are up to date. You can explore new opportunities below.`}
          </p>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-light)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            minWidth: '220px',
          }}
        >
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.15rem' }}>
            Registered Entity
          </div>
          <strong style={{ color: 'var(--text-primary)', display: 'block' }}>
            {ngoUser?.ngoName || 'Gram Vikas Seva Sansthan'}
          </strong>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.775rem' }}>
            Sector: {ngoUser?.focusSector || 'Rural Development'}
          </span>
        </div>
      </div>
    </div>
  );
};
