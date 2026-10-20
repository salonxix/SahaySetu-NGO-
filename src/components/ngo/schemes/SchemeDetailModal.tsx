'use client';

import React from 'react';
import type { Scheme, SchemeMatchEvaluation } from '@/types/ngo';

interface SchemeDetailModalProps {
  scheme: Scheme | null;
  matchEvaluation: SchemeMatchEvaluation | null;
  isSaved: boolean;
  onToggleSave: (schemeId: string) => void;
  onClose: () => void;
  onStartApplication?: (scheme: Scheme) => void;
}

export const SchemeDetailModal: React.FC<SchemeDetailModalProps> = ({
  scheme,
  matchEvaluation,
  isSaved,
  onToggleSave,
  onClose,
  onStartApplication,
}) => {
  if (!scheme) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 70,
        padding: '1.25rem',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="scheme-detail-title"
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          maxWidth: '720px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem 1.75rem',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            backgroundColor: 'var(--bg-canvas)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="badge-tag badge-emerald" style={{ fontSize: '0.725rem' }}>
                {scheme.sector}
              </span>
              <span
                style={{
                  fontSize: '0.725rem',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-muted)',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '3px',
                }}
              >
                Prototype Scheme Record
              </span>
            </div>
            <h2 id="scheme-detail-title" style={{ fontSize: '1.35rem', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.3' }}>
              {scheme.name}
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              🏛️ {scheme.department} • Updated: {scheme.lastUpdated}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.4rem',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '0.2rem',
            }}
            aria-label="Close details"
          >
            ✕
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div
          style={{
            padding: '1.75rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem',
            fontSize: '0.9rem',
          }}
        >
          {/* 1. Overview */}
          <section>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              1. Scheme Overview & Objective
            </h3>
            <p className="body-text" style={{ fontSize: '0.925rem', lineHeight: '1.65' }}>
              {scheme.fullDescription}
            </p>
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--bg-tint-emerald)',
                borderRadius: 'var(--radius-sm)',
                color: '#065f46',
                fontWeight: '500',
              }}
            >
              <strong>Support Offered:</strong> {scheme.aidType}
            </div>
          </section>

          {/* 2. Target Beneficiaries & Scope */}
          <section>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              2. Target Beneficiaries & Geographic Scope
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              <div>
                <strong style={{ color: 'var(--text-muted)', fontSize: '0.775rem', display: 'block' }}>
                  Target Beneficiaries
                </strong>
                <ul style={{ paddingLeft: '1.2rem', margin: '0.35rem 0 0', color: 'var(--text-primary)' }}>
                  {scheme.targetBeneficiaries.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong style={{ color: 'var(--text-muted)', fontSize: '0.775rem', display: 'block' }}>
                  Applicable States & UTs
                </strong>
                <span style={{ display: 'block', marginTop: '0.35rem', color: 'var(--text-primary)' }}>
                  {scheme.applicableStates.join(', ')}
                </span>
              </div>
            </div>
          </section>

          {/* 3. Deterministic Eligibility Breakdown */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                3. Eligibility & Profile Match Evaluation
              </h3>
              {matchEvaluation && (
                <span
                  style={{
                    fontSize: '0.775rem',
                    fontWeight: '700',
                    backgroundColor: matchEvaluation.isRecommended ? '#dcfce7' : '#fef3c7',
                    color: matchEvaluation.isRecommended ? '#166534' : '#92400e',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '9999px',
                  }}
                >
                  {matchEvaluation.overallScore}% Deterministic Match
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {matchEvaluation?.criteriaResults.map((crit, idx) => {
                const isMatched = crit.status === 'matched';
                const isNeedsAttention = crit.status === 'needs_attention';
                const icon = isMatched ? '✓' : isNeedsAttention ? '⚠' : '?';
                const badgeColor = isMatched
                  ? { bg: '#dcfce7', text: '#166534', border: '#86efac' }
                  : isNeedsAttention
                    ? { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' }
                    : { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };

                return (
                  <div
                    key={idx}
                    style={{
                      border: `1px solid ${badgeColor.border}`,
                      backgroundColor: badgeColor.bg,
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.65rem',
                    }}
                  >
                    <span style={{ fontWeight: '700', fontSize: '1rem', color: badgeColor.text }}>
                      {icon}
                    </span>
                    <div>
                      <strong style={{ color: badgeColor.text, fontSize: '0.85rem', display: 'block' }}>
                        {crit.label}
                      </strong>
                      <span style={{ color: badgeColor.text, fontSize: '0.825rem' }}>
                        {crit.explanation}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 4. Required Statutory Documents */}
          <section>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              4. Mandatory Statutory Documents
            </h3>
            <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {scheme.requiredDocuments.map((doc, idx) => (
                <li key={idx}>{doc}</li>
              ))}
            </ul>
          </section>

          {/* 5. Application Process */}
          <section>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              5. Step-by-Step Application Process
            </h3>
            <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {scheme.applicationProcess.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </section>

          {/* 6. Source & Non-Partisan Disclaimer */}
          <section
            style={{
              padding: '0.85rem 1rem',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-sm)',
              border: '1px dashed var(--border-medium)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
            }}
          >
            <strong>Information Source & Integrity:</strong> {scheme.officialSource}. This is a demonstration record for educational HCI evaluation. Official application portals will open in subsequent rollout phases.
          </section>
        </div>

        {/* Modal Footer Actions */}
        <div
          style={{
            padding: '1rem 1.75rem',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn-civic btn-civic-secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          >
            Close
          </button>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => onToggleSave(scheme.id)}
              className="btn-civic btn-civic-secondary"
              style={{ padding: '0.55rem 1rem', fontSize: '0.875rem' }}
            >
              {isSaved ? '★ Saved' : '☆ Bookmark & Save Scheme'}
            </button>

            {onStartApplication && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartApplication(scheme);
                }}
                className="btn-civic btn-civic-primary"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.875rem' }}
              >
                Start Prototype Application →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
