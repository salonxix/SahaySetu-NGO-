'use client';

import React from 'react';
import type { Scheme, SchemeMatchEvaluation } from '@/types/ngo';

interface SchemeCardProps {
  scheme: Scheme;
  matchEvaluation: SchemeMatchEvaluation;
  isSaved: boolean;
  onToggleSave: (schemeId: string) => void;
  onViewDetails: (scheme: Scheme) => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  scheme,
  matchEvaluation,
  isSaved,
  onToggleSave,
  onViewDetails,
}) => {
  return (
    <div
      className="scheme-card animate-entrance"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-sm)',
        padding: '1.35rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        {/* Top Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '0.65rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className="badge-tag badge-emerald" style={{ fontSize: '0.7rem' }}>
              {scheme.sector}
            </span>
            {matchEvaluation.isRecommended && (
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                }}
              >
                ★ High Match ({matchEvaluation.overallScore}%)
              </span>
            )}
          </div>

          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            📍 {scheme.applicableStates.includes('All India') ? 'All India' : scheme.applicableStates.slice(0, 2).join(', ')}
          </span>
        </div>

        {/* Scheme Name & Ministry */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem', lineHeight: '1.3' }}>
          {scheme.name}
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.85rem' }}>
          🏛️ {scheme.department}
        </span>

        {/* Short Description */}
        <p className="body-text" style={{ fontSize: '0.875rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          {scheme.shortDescription}
        </p>

        {/* Match Explanation Badges (Explainable) */}
        {matchEvaluation.matchReasons.length > 0 && (
          <div
            style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-xs)',
              padding: '0.5rem 0.75rem',
              fontSize: '0.775rem',
              marginBottom: '1rem',
            }}
          >
            <span style={{ color: 'var(--text-muted)', display: 'block', fontWeight: '600', marginBottom: '0.2rem' }}>
              Why this matches your NGO:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {matchEvaluation.matchReasons.map((reason, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-medium)',
                    color: '#065f46',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '3px',
                    fontWeight: '500',
                  }}
                >
                  ✓ {reason}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border-light)',
          marginTop: '0.75rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <button
          type="button"
          onClick={() => onViewDetails(scheme)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--brand-primary)',
            fontWeight: '600',
            fontSize: '0.85rem',
            cursor: 'pointer',
            padding: 0,
            textDecoration: 'underline',
          }}
        >
          View Full Details & Criteria →
        </button>

        <button
          type="button"
          onClick={() => onToggleSave(scheme.id)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-xs)',
            border: '1px solid',
            borderColor: isSaved ? 'var(--brand-primary)' : 'var(--border-medium)',
            backgroundColor: isSaved ? 'var(--bg-tint-emerald)' : '#ffffff',
            color: isSaved ? 'var(--brand-primary)' : 'var(--text-secondary)',
            fontSize: '0.8rem',
            fontWeight: '600',
            cursor: 'pointer',
          }}
          aria-pressed={isSaved}
          aria-label={isSaved ? `Remove ${scheme.name} from saved` : `Save ${scheme.name}`}
        >
          {isSaved ? '★ Saved' : '☆ Save'}
        </button>
      </div>
    </div>
  );
};
