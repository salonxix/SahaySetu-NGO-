'use client';

import React, { useState } from 'react';
import type { StateRegistrationGuide, RoadmapStep } from '@/types/registration-guide';

interface RoadmapViewProps {
  guide: StateRegistrationGuide;
  onNavigateTab?: (tabId: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ guide, onNavigateTab }) => {
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({ 1: true });

  const toggleStep = (stepNumber: number) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  const expandAll = () => {
    const all: Record<number, boolean> = {};
    guide.steps.forEach((s) => {
      all[s.stepNumber] = true;
    });
    setExpandedSteps(all);
  };

  const collapseAll = () => {
    setExpandedSteps({});
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
            <span className="badge-tag badge-emerald" style={{ fontSize: '0.75rem' }}>
              📍 {guide.state}
            </span>
            <span className="badge-tag badge-blue" style={{ fontSize: '0.75rem' }}>
              🏛️ {guide.organisationType}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Source: <a href={guide.officialSource.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-primary)', textDecoration: 'underline' }}>{guide.officialSource.domain}</a> (Verified: {guide.officialSource.lastChecked})
            </span>
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>
            Step-by-Step Registration Roadmap: {guide.organisationType} in {guide.state}
          </h3>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
            {guide.overview.simpleExplanation}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={expandAll}
            style={{
              padding: '0.45rem 0.75rem',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Expand All Steps
          </button>
          <button
            type="button"
            onClick={collapseAll}
            style={{
              padding: '0.45rem 0.75rem',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Collapse
          </button>
        </div>
      </div>

      {/* Visual Roadmap Sequence */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
        {guide.steps.map((step: RoadmapStep) => {
          const isOpen = Boolean(expandedSteps[step.stepNumber]);

          return (
            <div
              key={step.stepNumber}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                transition: 'border-color 0.15s ease',
              }}
            >
              {/* Step Header Clickable Toggle */}
              <div
                onClick={() => toggleStep(step.stepNumber)}
                style={{
                  padding: '1.15rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  backgroundColor: isOpen ? 'var(--bg-canvas)' : '#ffffff',
                  borderBottom: isOpen ? '1px solid var(--border-light)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: isOpen ? 'var(--brand-primary)' : 'var(--bg-subtle)',
                      color: isOpen ? '#ffffff' : 'var(--brand-primary)',
                      border: '2px solid var(--brand-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '0.95rem',
                      flexShrink: 0,
                    }}
                  >
                    {step.stepNumber}
                  </div>

                  <div>
                    <span style={{ fontSize: '0.725rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
                      STEP {step.stepNumber} • {step.authority}
                    </span>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', margin: '0.1rem 0 0 0' }}>
                      {step.title}
                    </h4>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {step.actionUrl && (
                    <a
                      href={step.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="btn-civic btn-civic-secondary"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <span>{step.actionLabel || 'Official Portal'}</span>
                      <span>↗</span>
                    </a>
                  )}
                  <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
                    {isOpen ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {/* Step Expanded Content */}
              {isOpen && (
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Simple Explanation
                    </span>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.5', margin: '0.25rem 0 0 0' }}>
                      {step.description.simpleExplanation}
                    </p>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--brand-primary)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
                      Official Statutory Details
                    </span>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.45', margin: '0.25rem 0 0 0' }}>
                      {step.description.officialDetails}
                    </p>
                  </div>

                  {step.checklistItems && step.checklistItems.length > 0 && (
                    <div>
                      <strong style={{ fontSize: '0.825rem', color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                        Required at this step:
                      </strong>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.4rem' }}>
                        {step.checklistItems.map((item, i) => (
                          <div
                            key={i}
                            style={{
                              padding: '0.45rem 0.75rem',
                              backgroundColor: '#ffffff',
                              border: '1px solid var(--border-medium)',
                              borderRadius: 'var(--radius-xs)',
                              fontSize: '0.8rem',
                              color: 'var(--text-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                            }}
                          >
                            <span style={{ color: 'var(--brand-primary)', fontWeight: '700' }}>✓</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>
                      Official Authority: <strong>{step.authority}</strong>
                    </span>
                    <span>
                      Source: <a href={step.officialSource.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-primary)', textDecoration: 'underline' }}>{step.officialSource.domain}</a>
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* "What Do I Do Next?" Feature */}
      <div
        style={{
          backgroundColor: 'var(--bg-tint-emerald)',
          border: '1px solid rgba(22, 101, 52, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '1.75rem',
          marginTop: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.3rem' }}>🎯</span>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--brand-primary)', margin: 0 }}>
            What Do I Do Next? (Post-Registration Checklist)
          </h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 1.25rem 0' }}>
          Once your initial registration deed / certificate is issued, follow these verified sequence steps to unlock grants, donor tax receipts, and public discovery:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(22, 101, 52, 0.2)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--brand-primary)', marginBottom: '0.2rem' }}>STEP 1: TAX EXEMPTION</div>
            <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>Apply for Income Tax Form 104</strong>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Obtain provisional tax exemption and donor deduction eligibility on the IT e-Filing portal.</p>
            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('tax')}
                style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: 'var(--brand-primary)', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', padding: 0 }}
              >
                View Tax Guide →
              </button>
            )}
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(22, 101, 52, 0.2)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--brand-primary)', marginBottom: '0.2rem' }}>STEP 2: CENTRAL ID</div>
            <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>Sign Up on NGO Darpan</strong>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Generate your Unique Darpan ID from NITI Aayog to qualify for Central Ministries grants & CSR.</p>
            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('darpan')}
                style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: 'var(--brand-primary)', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', padding: 0 }}
              >
                View Darpan Guide →
              </button>
            )}
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(22, 101, 52, 0.2)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--brand-primary)', marginBottom: '0.2rem' }}>STEP 3: CITIZEN ENGAGEMENT</div>
            <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>Publish on SahaySetu Portal</strong>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Publish donation needs, campaigns, volunteer drives, and help services for ordinary citizens.</p>
            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('public-profile')}
                style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: 'var(--brand-primary)', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', padding: 0 }}
              >
                Publish Profile →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
