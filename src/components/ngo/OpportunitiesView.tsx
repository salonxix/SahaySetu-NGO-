import React from 'react';
import type { NgoOpportunity } from '@/types/ngo';

interface OpportunitiesViewProps {
  opportunities: NgoOpportunity[];
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  opportunities,
}) => {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        padding: '1.75rem',
      }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Civic Collaborations & CSR Opportunities
          </h2>
          <span
            style={{
              fontSize: '0.725rem',
              backgroundColor: 'var(--bg-tint-blue)',
              color: 'var(--brand-blue)',
              padding: '0.15rem 0.5rem',
              borderRadius: '9999px',
              fontWeight: '600',
            }}
          >
            Prototype Directory
          </span>
        </div>
        <p className="body-text" style={{ fontSize: '0.875rem' }}>
          Explore institutional partnership requests, corporate CSR funding calls, and pro-bono volunteer networks.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }} className="opportunities-grid">
        {opportunities.map((opp) => (
          <div
            key={opp.id}
            style={{
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
              backgroundColor: 'var(--bg-canvas)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge-tag badge-blue" style={{ fontSize: '0.7rem' }}>
                  {opp.partnerType}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Deadline: {opp.deadline}
                </span>
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                {opp.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                {opp.description}
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <strong>Focus Area:</strong> {opp.focusArea}
              </div>
            </div>

            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--brand-primary)', fontWeight: '600' }}>
                Expression of Interest • Prototype Call
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
