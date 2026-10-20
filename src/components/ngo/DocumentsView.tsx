import React from 'react';
import type { NgoDocumentItem } from '@/types/ngo';

interface DocumentsViewProps {
  documents: NgoDocumentItem[];
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ documents }) => {
  const getDocStatusBadge = (status: NgoDocumentItem['status']) => {
    switch (status) {
      case 'Uploaded':
        return { bg: '#dcfce7', color: '#166534', label: 'Uploaded & Verified', icon: '✓' };
      case 'Needs Update':
        return { bg: '#fef3c7', color: '#92400e', label: 'Action / Renewal Needed', icon: '⚠️' };
      case 'Missing':
      default:
        return { bg: '#fee2e2', color: '#991b1b', label: 'Missing', icon: '✕' };
    }
  };

  const missingCount = documents.filter((d) => d.status === 'Missing').length;
  const updateCount = documents.filter((d) => d.status === 'Needs Update').length;

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
            Statutory Document Vault & Compliance
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
            Compliance Checklist
          </span>
        </div>
        <p className="body-text" style={{ fontSize: '0.875rem' }}>
          Maintain critical non-profit registrations and tax orders for rapid grant verification.
        </p>
      </div>

      {/* Summary notice banner */}
      {(missingCount > 0 || updateCount > 0) && (
        <div
          style={{
            backgroundColor: 'var(--bg-tint-amber)',
            border: '1px solid #fed7aa',
            borderRadius: 'var(--radius-sm)',
            padding: '0.85rem 1.15rem',
            fontSize: '0.875rem',
            color: '#9a3412',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}
        >
          <span>ℹ️</span>
          <span>
            {missingCount} missing document(s) and {updateCount} document(s) nearing expiration. Central schemes require these certificates to be active.
          </span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {documents.map((doc) => {
          const badge = getDocStatusBadge(doc.status);
          return (
            <div
              key={doc.id}
              style={{
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.15rem 1.25rem',
                backgroundColor: 'var(--bg-canvas)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span
                    style={{
                      fontSize: '0.725rem',
                      fontWeight: '600',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {doc.category}
                  </span>
                  {doc.isRequired && (
                    <span style={{ fontSize: '0.7rem', color: '#b91c1c', fontWeight: '600' }}>
                      *Mandatory
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {doc.name}
                </h3>

                {doc.notes && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {doc.notes}
                  </p>
                )}
                {doc.validTill && (
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.15rem' }}>
                    Validity: {doc.validTill}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span
                  style={{
                    fontSize: '0.775rem',
                    fontWeight: '700',
                    backgroundColor: badge.bg,
                    color: badge.color,
                    padding: '0.25rem 0.6rem',
                    borderRadius: '9999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <span>{badge.icon}</span>
                  <span>{badge.label}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
