'use client';

import React, { useState } from 'react';
import type { Scheme } from '@/types/ngo';
import type { NgoUser } from '@/types/auth';
import { evaluateSchemeEligibility } from '@/lib/ngo/eligibility-matcher';
import { SchemeDetailModal } from './schemes/SchemeDetailModal';

interface SavedSchemesViewProps {
  savedSchemes: Scheme[];
  onRemoveSaved: (schemeId: string) => void;
  onNavigateToFind: () => void;
  ngoUser?: NgoUser | null;
  onStartApplication?: (scheme: Scheme) => void;
}

export const SavedSchemesView: React.FC<SavedSchemesViewProps> = ({
  savedSchemes,
  onRemoveSaved,
  onNavigateToFind,
  ngoUser = null,
  onStartApplication,
}) => {
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  const selectedEvaluation = selectedScheme
    ? evaluateSchemeEligibility(ngoUser, selectedScheme)
    : null;

  if (savedSchemes.length === 0) {
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
            backgroundColor: 'var(--bg-tint-emerald)',
            color: 'var(--brand-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            margin: '0 auto 1.25rem',
          }}
        >
          📌
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          No saved schemes yet
        </h3>
        <p className="body-text" style={{ maxWidth: '44ch', margin: '0 auto 1.75rem' }}>
          When you bookmark welfare opportunities while browsing the directory, they will be organized here for quick review and team discussions.
        </p>
        <button
          type="button"
          onClick={onNavigateToFind}
          className="btn-civic btn-civic-primary"
        >
          Explore Available Schemes →
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
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Saved Schemes ({savedSchemes.length})
          </h2>
          <p className="body-text" style={{ fontSize: '0.875rem' }}>
            Bookmarked welfare schemes ready for application preparation.
          </p>
        </div>
        <button
          type="button"
          onClick={onNavigateToFind}
          className="btn-civic btn-civic-secondary"
          style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
        >
          + Find More Schemes
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {savedSchemes.map((scheme) => (
          <div
            key={scheme.id}
            style={{
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
              backgroundColor: 'var(--bg-canvas)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ maxWidth: '680px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span className="badge-tag badge-emerald" style={{ fontSize: '0.7rem' }}>
                  {scheme.sector}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  🏛️ {scheme.department}
                </span>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                {scheme.name}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                {scheme.shortDescription}
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <strong>Support:</strong> {scheme.aidType}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {onStartApplication && (
                <button
                  type="button"
                  onClick={() => onStartApplication(scheme)}
                  className="btn-civic btn-civic-primary"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                >
                  Apply Now →
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedScheme(scheme)}
                className="btn-civic btn-civic-secondary"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
              >
                View Guidelines
              </button>
              <button
                type="button"
                onClick={() => onRemoveSaved(scheme.id)}
                className="btn-civic btn-civic-secondary"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', color: '#b91c1c', borderColor: '#fca5a5' }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <SchemeDetailModal
        scheme={selectedScheme}
        matchEvaluation={selectedEvaluation}
        isSaved={true}
        onToggleSave={onRemoveSaved}
        onClose={() => setSelectedScheme(null)}
        onStartApplication={onStartApplication}
      />
    </div>
  );
};
