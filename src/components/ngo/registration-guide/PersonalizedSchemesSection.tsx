'use client';

import React from 'react';
import type { Scheme } from '@/types/ngo';

interface PersonalizedSchemesSectionProps {
  schemes: Scheme[];
  state: string;
  sector: string;
  savedSchemeIds?: string[];
  onToggleSaveScheme?: (schemeId: string) => void;
  onExploreCatalog?: () => void;
}

export const PersonalizedSchemesSection: React.FC<PersonalizedSchemesSectionProps> = ({
  schemes,
  state,
  sector,
  savedSchemeIds = [],
  onToggleSaveScheme,
  onExploreCatalog,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem 1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
            <span className="badge-tag badge-emerald" style={{ fontSize: '0.75rem' }}>
              📍 {state}
            </span>
            <span className="badge-tag badge-blue" style={{ fontSize: '0.75rem' }}>
              🎯 {sector}
            </span>
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>
            Relevant Government Schemes & Grants Support ({schemes.length})
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
            Personalized grant opportunities from Central and State Ministries matching your operating state and sector.
          </p>
        </div>

        {onExploreCatalog && (
          <button
            type="button"
            onClick={onExploreCatalog}
            className="btn-civic btn-civic-secondary"
            style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
          >
            Explore Full Scheme Catalog →
          </button>
        )}
      </div>

      {/* Schemes Grid */}
      {schemes.length === 0 ? (
        <div style={{ backgroundColor: '#ffffff', padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🔍</span>
          No specific schemes found matching {sector} in {state}. Explore the full national schemes catalog.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {schemes.map((scheme) => {
            const isSaved = savedSchemeIds.includes(scheme.id);

            return (
              <div
                key={scheme.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', gap: '0.5rem' }}>
                    <span
                      style={{
                        fontSize: '0.725rem',
                        fontWeight: '700',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        backgroundColor: 'var(--bg-tint-emerald)',
                        color: 'var(--brand-primary)',
                      }}
                    >
                      {scheme.sector} • {scheme.aidType}
                    </span>

                    {onToggleSaveScheme && (
                      <button
                        type="button"
                        onClick={() => onToggleSaveScheme(scheme.id)}
                        style={{
                          background: isSaved ? 'var(--bg-tint-amber)' : 'none',
                          border: '1px solid',
                          borderColor: isSaved ? '#fcd34d' : 'var(--border-medium)',
                          borderRadius: '9999px',
                          padding: '0.2rem 0.5rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: isSaved ? '#b45309' : 'var(--text-muted)',
                          cursor: 'pointer',
                        }}
                      >
                        {isSaved ? '★ Saved' : '☆ Save'}
                      </button>
                    )}
                  </div>

                  <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {scheme.name}
                  </h4>

                  <div style={{ fontSize: '0.8rem', color: 'var(--brand-primary)', fontWeight: '600', marginBottom: '0.75rem' }}>
                    🏛️ {scheme.department}
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '0.85rem' }}>
                    {scheme.shortDescription}
                  </p>

                  <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '0.75rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-light)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.725rem', fontWeight: '700' }}>
                      TARGET BENEFICIARIES
                    </span>
                    <span style={{ color: 'var(--text-primary)' }}>{scheme.targetBeneficiaries.join(', ')}</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Verified: {scheme.lastUpdated}</span>
                  <span style={{ color: 'var(--brand-primary)', fontWeight: '600' }}>Status: {scheme.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
