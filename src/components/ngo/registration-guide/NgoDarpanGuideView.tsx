'use client';

import React from 'react';
import type { NgoDarpanGuideData } from '@/types/registration-guide';

interface NgoDarpanGuideViewProps {
  darpanGuide: NgoDarpanGuideData;
}

export const NgoDarpanGuideView: React.FC<NgoDarpanGuideViewProps> = ({ darpanGuide }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem 1.75rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
              NITI Aayog Official Registry
            </span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.15rem 0 0.35rem 0' }}>
              {darpanGuide.title}
            </h3>
          </div>

          <a
            href={darpanGuide.portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-civic btn-civic-primary"
            style={{ padding: '0.55rem 1rem', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <span>Open NGO Darpan Portal</span>
            <span>↗</span>
          </a>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 1rem 0' }}>
          {darpanGuide.overview.simpleExplanation}
        </p>

        <div style={{ backgroundColor: 'var(--bg-tint-emerald)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--brand-primary)', fontSize: '0.825rem', color: 'var(--text-primary)', lineHeight: '1.45' }}>
          <strong>Official Details:</strong> {darpanGuide.overview.officialDetails}
        </div>
      </div>

      {/* Benefits Grid */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem 1.75rem',
        }}
      >
        <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.85rem' }}>
          Why NGO Darpan is Crucial for Your Organisation:
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
          {darpanGuide.importanceAndBenefits.map((benefit, i) => (
            <div
              key={i}
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: 'var(--bg-canvas)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.825rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.4',
                display: 'flex',
                gap: '0.5rem',
              }}
            >
              <span style={{ color: 'var(--brand-primary)', fontWeight: '700' }}>✓</span>
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step by Step Signup Process */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem 1.75rem',
        }}
      >
        <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Official Darpan Signup & Verification Workflow:
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {darpanGuide.signupSteps.map((step) => (
            <div
              key={step.stepNumber}
              style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
                padding: '1rem',
                backgroundColor: 'var(--bg-canvas)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  flexShrink: 0,
                }}
              >
                {step.stepNumber}
              </div>

              <div>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>
                  {step.title}
                </strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.45' }}>
                  {step.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mandatory Documents & Footer Source */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem 1.75rem',
        }}
      >
        <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Required Scanned Uploads for Darpan:
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {darpanGuide.mandatoryInformation.map((doc, i) => (
            <div key={i} style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-xs)', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
              📄 {doc}
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>
            Official Authority: <strong>{darpanGuide.officialSource.authority}</strong>
          </span>
          <span>
            Source: <a href={darpanGuide.officialSource.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-primary)', textDecoration: 'underline' }}>{darpanGuide.officialSource.domain}</a> (Verified: {darpanGuide.officialSource.lastChecked})
          </span>
        </div>
      </div>
    </div>
  );
};
