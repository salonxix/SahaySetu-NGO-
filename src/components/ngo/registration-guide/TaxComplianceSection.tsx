'use client';

import React, { useState } from 'react';
import type { TaxComplianceGuideItem } from '@/types/registration-guide';

interface TaxComplianceSectionProps {
  taxGuideItems: TaxComplianceGuideItem[];
}

export const TaxComplianceSection: React.FC<TaxComplianceSectionProps> = ({ taxGuideItems }) => {
  const [expandedFormId, setExpandedFormId] = useState<string>('tax_form_104_provisional');

  const toggleForm = (id: string) => {
    setExpandedFormId((prev) => (prev === id ? '' : id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Overview Banner */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem 1.75rem',
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
          Statutory Tax Readiness & Donor Deductions
        </span>
        <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.2rem 0 0.4rem 0' }}>
          Tax & Donation Readiness (Current Income Tax Department Framework)
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0', lineHeight: '1.5' }}>
          Registered non-profits (Trusts, Societies, and Section 8 Companies) are not automatically exempt from income tax. They must apply electronically for provisional registration (Form 104) and subsequently regular registration (Form 105) through the official Income Tax e-Filing portal.
        </p>

        <div
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.825rem',
            color: 'var(--text-primary)',
          }}
        >
          ℹ️ <strong>Current Official Procedures:</strong> All applications are processed 100% online under current CBDT rules via the Income Tax e-Filing portal without physical interface.
        </div>
      </div>

      {/* Tax Forms Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {taxGuideItems.map((item) => {
          const isOpen = expandedFormId === item.id;

          return (
            <div
              key={item.id}
              style={{
                backgroundColor: '#ffffff',
                border: isOpen ? '2px solid var(--brand-primary)' : '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              {/* Form Card Header Toggle */}
              <div
                onClick={() => toggleForm(item.id)}
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  backgroundColor: isOpen ? 'var(--bg-canvas)' : '#ffffff',
                  borderBottom: isOpen ? '1px solid var(--border-light)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>📜</span>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
                      {item.formName}
                    </span>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.1rem 0 0 0' }}>
                      {item.title}
                    </h4>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <a
                    href={item.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="btn-civic btn-civic-secondary"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <span>e-Filing Portal</span>
                    <span>↗</span>
                  </a>
                  <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
                    {isOpen ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {/* Form Expanded Details */}
              {isOpen && (
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Purpose & Simple Explanation
                    </span>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.5', margin: '0.25rem 0 0 0' }}>
                      {item.formPurpose.simpleExplanation}
                    </p>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-tint-emerald)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--brand-primary)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
                      Official Statutory Details
                    </span>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-primary)', lineHeight: '1.45', margin: '0.25rem 0 0 0' }}>
                      {item.formPurpose.officialDetails}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
                    <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '0.85rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-light)' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.725rem', fontWeight: '700', display: 'block' }}>WHO IT APPLIES TO</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{item.whoItAppliesTo}</strong>
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '0.85rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-light)' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.725rem', fontWeight: '700', display: 'block' }}>TIMING & VALIDITY</span>
                      <strong style={{ color: 'var(--brand-primary)' }}>{item.timingAndValidity}</strong>
                    </div>
                  </div>

                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
                      Step-by-Step e-Filing Process:
                    </strong>
                    <ol style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      {item.applicationProcess.map((step, idx) => (
                        <li key={idx} style={{ marginBottom: '0.35rem' }}>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>
                      Governing Act: <strong>{item.governingAct}</strong>
                    </span>
                    <span>
                      Official Source: <a href={item.officialSource.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-primary)', textDecoration: 'underline' }}>{item.officialSource.domain}</a> (Checked: {item.officialSource.lastChecked})
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
