import React, { useState } from 'react';
import type { NgoApplication } from '@/types/ngo';
import { ApplicationDetailsModal } from './application/ApplicationDetailsModal';

interface ApplicationsViewProps {
  applications: NgoApplication[];
  onNavigateToFind: () => void;
  onResumeDraft?: (app: NgoApplication) => void;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  applications,
  onNavigateToFind,
  onResumeDraft,
}) => {
  const [selectedApp, setSelectedApp] = useState<NgoApplication | null>(null);
  const getStatusBadge = (status: NgoApplication['status']) => {
    switch (status) {
      case 'Action Required':
        return { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5', icon: '⚠️' };
      case 'Under Review':
        return { bg: '#fef3c7', color: '#92400e', border: '#fde68a', icon: '⏳' };
      case 'Submitted':
        return { bg: '#e0f2fe', color: '#075985', border: '#bae6fd', icon: '📩' };
      case 'Approved':
        return { bg: '#dcfce7', color: '#166534', border: '#86efac', icon: '✅' };
      case 'Draft':
      default:
        return { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1', icon: '✏️' };
    }
  };

  if (applications.length === 0) {
    return (
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '4rem 2rem',
          textAlign: 'center',
          maxWidth: '640px',
          margin: '2rem auto',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-tint-blue)',
            color: 'var(--brand-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            margin: '0 auto 1.25rem',
          }}
        >
          📝
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          No active applications yet
        </h3>
        <p className="body-text" style={{ maxWidth: '44ch', margin: '0 auto 1.75rem' }}>
          When you begin drafting or submit a proposal for a government grant, its real-time review stages and next actions will be tracked here.
        </p>
        <button
          type="button"
          onClick={onNavigateToFind}
          className="btn-civic btn-civic-primary"
        >
          Explore Eligible Schemes →
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        padding: '1.75rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Application Tracker ({applications.length})
            </h2>
            <span
              style={{
                fontSize: '0.725rem',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-muted)',
                padding: '0.15rem 0.5rem',
                borderRadius: '9999px',
                fontWeight: '600',
              }}
            >
              Prototype Tracker
            </span>
          </div>
          <p className="body-text" style={{ fontSize: '0.875rem' }}>
            Follow submission milestones, verification stages, and pending queries.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {applications.map((app) => {
          const badge = getStatusBadge(app.status);
          return (
            <div
              key={app.id}
              style={{
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.35rem 1.5rem',
                backgroundColor: 'var(--bg-canvas)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  marginBottom: '0.85rem',
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      color: 'var(--text-muted)',
                      backgroundColor: 'var(--bg-subtle)',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '3px',
                      display: 'inline-block',
                      marginBottom: '0.35rem',
                    }}
                  >
                    Ref: {app.referenceNumber}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {app.schemeTitle}
                  </h3>
                </div>

                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    backgroundColor: badge.bg,
                    color: badge.color,
                    border: `1px solid ${badge.border}`,
                    padding: '0.3rem 0.65rem',
                    borderRadius: '9999px',
                  }}
                >
                  <span>{badge.icon}</span>
                  <span>{app.status}</span>
                </span>
              </div>

              {/* Next Action Box */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block' }}>
                    Next Required Action
                  </span>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', margin: 0, fontWeight: '500' }}>
                    {app.nextAction}
                  </p>
                </div>

                <div style={{ textAlign: 'right', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                  <span>Updated: {app.lastUpdated}</span>
                  {app.submissionDeadline && (
                    <span style={{ display: 'block', color: '#b91c1c', fontWeight: '600' }}>
                      Deadline: {app.submissionDeadline}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.85rem' }}>
                {app.status === 'Draft' && onResumeDraft && (
                  <button
                    type="button"
                    onClick={() => onResumeDraft(app)}
                    className="btn-civic btn-civic-primary"
                    style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                  >
                    ✏️ Continue Draft Application →
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedApp(app)}
                  className="btn-civic btn-civic-secondary"
                  style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                >
                  View Application Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <ApplicationDetailsModal
        application={selectedApp}
        onClose={() => setSelectedApp(null)}
      />
    </div>
  );
};
