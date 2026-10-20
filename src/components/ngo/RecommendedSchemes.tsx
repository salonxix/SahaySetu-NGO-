'use client';

import React, { useState } from 'react';
import type { Scheme } from '@/types/ngo';
import type { NgoUser } from '@/types/auth';
import { evaluateSchemeEligibility } from '@/lib/ngo/eligibility-matcher';
import { SchemeDetailModal } from './schemes/SchemeDetailModal';

interface RecommendedSchemesProps {
  schemes: Scheme[];
  savedSchemeIds: Set<string>;
  onToggleSave: (schemeId: string) => void;
  onExploreAll: () => void;
  ngoUser?: NgoUser | null;
  onStartApplication?: (scheme: Scheme) => void;
}

export const RecommendedSchemes: React.FC<RecommendedSchemesProps> = ({
  schemes,
  savedSchemeIds,
  onToggleSave,
  onExploreAll,
  ngoUser = null,
  onStartApplication,
}) => {
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  // Take top 4 recommended schemes
  const displaySchemes = schemes.slice(0, 4);

  const selectedEvaluation = selectedScheme
    ? evaluateSchemeEligibility(ngoUser, selectedScheme)
    : null;

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        padding: '1.75rem',
        marginBottom: '1.75rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Recommended for your NGO
            </h3>
            <span
              style={{
                fontSize: '0.725rem',
                backgroundColor: 'var(--bg-tint-emerald)',
                color: 'var(--brand-primary)',
                padding: '0.15rem 0.5rem',
                borderRadius: '9999px',
                fontWeight: '600',
              }}
            >
              Demo Recommendations
            </span>
          </div>
          <p className="body-text" style={{ fontSize: '0.875rem' }}>
            Curated prototype grants and welfare assistance matching your registered focus sectors.
          </p>
        </div>

        <button
          type="button"
          onClick={onExploreAll}
          className="btn-civic btn-civic-secondary"
          style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
        >
          Browse All Schemes ({schemes.length}) →
        </button>
      </div>

      {/* Grid of Recommended Schemes */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.25rem',
        }}
        className="recommended-grid"
      >
        {displaySchemes.map((scheme) => {
          const isSaved = savedSchemeIds.has(scheme.id);
          const evaluation = evaluateSchemeEligibility(ngoUser, scheme);

          return (
            <div
              key={scheme.id}
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
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                  }}
                >
                  <span className="badge-tag badge-emerald" style={{ fontSize: '0.7rem' }}>
                    {scheme.sector}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    📍 {scheme.applicableStates.includes('All India') ? 'All India' : scheme.applicableStates[0]}
                  </span>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  {scheme.name}
                </h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem' }}>
                  🏛️ {scheme.department}
                </span>

                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '0.65rem 0.75rem',
                    fontSize: '0.825rem',
                    marginBottom: '0.75rem',
                  }}
                >
                  <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.725rem' }}>
                    Eligibility Summary
                  </strong>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    {scheme.shortDescription}
                  </p>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <strong>Support:</strong> {scheme.aidType}
                </div>

                {evaluation.matchReasons.length > 0 && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#065f46' }}>
                    ✓ {evaluation.matchReasons[0]}
                  </div>
                )}
              </div>

              {/* Actions: View Details and Save */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '1.25rem',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid var(--border-light)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setSelectedScheme(scheme)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--brand-primary)',
                    fontWeight: '600',
                    fontSize: '0.825rem',
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline',
                  }}
                >
                  View Details & Guidelines
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
                >
                  {isSaved ? '★ Saved' : '☆ Save'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scheme Details Modal */}
      <SchemeDetailModal
        scheme={selectedScheme}
        matchEvaluation={selectedEvaluation}
        isSaved={selectedScheme ? savedSchemeIds.has(selectedScheme.id) : false}
        onToggleSave={onToggleSave}
        onClose={() => setSelectedScheme(null)}
        onStartApplication={onStartApplication}
      />
    </div>
  );
};
