'use client';

import React from 'react';
import type { FcraGuideData } from '@/types/registration-guide';

interface FcraGuideViewProps {
  fcraGuide: FcraGuideData;
}

export const FcraGuideView: React.FC<FcraGuideViewProps> = ({ fcraGuide }) => {
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
              Ministry of Home Affairs Statutory Regulation
            </span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.15rem 0 0.35rem 0' }}>
              {fcraGuide.title}
            </h3>
          </div>

          <a
            href={fcraGuide.portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-civic btn-civic-primary"
            style={{ padding: '0.55rem 1rem', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <span>Open MHA FCRA Portal</span>
            <span>↗</span>
          </a>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 1rem 0' }}>
          {fcraGuide.overview.simpleExplanation}
        </p>

        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fef3c7', border: '1px solid #fde68a', borderRadius: 'var(--radius-sm)', fontSize: '0.825rem', color: '#92400e', lineHeight: '1.45' }}>
          ⚠️ <strong>Domestic Contribution Notice:</strong> If your NGO raises funds only within India from Indian citizens and domestic entities, you do <strong>NOT</strong> need FCRA registration. FCRA is required solely for international foreign contributions.
        </div>
      </div>

      {/* Prior Permission vs 5-Year Registration Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#d97706', backgroundColor: 'var(--bg-tint-amber)', padding: '0.15rem 0.55rem', borderRadius: '4px' }}>
              FORM FC-3B
            </span>
            <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.4rem 0 0.35rem 0' }}>
              Prior Permission (Project-Specific)
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '0.85rem' }}>
              {fcraGuide.registrationVsPriorPermission.priorPermission.simpleExplanation}
            </p>

            <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '0.75rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-light)', fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>
              <strong>Official Details:</strong> {fcraGuide.registrationVsPriorPermission.priorPermission.officialDetails}
            </div>
          </div>

          <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            ✓ Ideal for new NGOs receiving an initial grant from an identified foreign donor
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--brand-primary)', backgroundColor: 'var(--bg-tint-emerald)', padding: '0.15rem 0.55rem', borderRadius: '4px' }}>
              FORM FC-3A
            </span>
            <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.4rem 0 0.35rem 0' }}>
              Regular 5-Year Registration
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '0.85rem' }}>
              {fcraGuide.registrationVsPriorPermission.regularRegistration.simpleExplanation}
            </p>

            <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '0.75rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-light)', fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>
              <strong>Official Details:</strong> {fcraGuide.registrationVsPriorPermission.regularRegistration.officialDetails}
            </div>
          </div>

          <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            ✓ Requires 3 years of audited charitable expenditure (minimum ₹15 Lakhs)
          </div>
        </div>
      </div>

      {/* Mandatory SBI Designated Bank Account Requirement */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem 1.75rem',
        }}
      >
        <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span>🏦</span> Mandatory State Bank of India (SBI) New Delhi Account Requirement
        </h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 1rem 0' }}>
          {fcraGuide.designatedBankRequirement}
        </p>

        <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
          Key Statutory Prerequisites:
        </strong>
        <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          {fcraGuide.keyPrerequisites.map((req, i) => (
            <li key={i} style={{ marginBottom: '0.3rem' }}>
              {req}
            </li>
          ))}
        </ul>

        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.85rem', marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>Authority: {fcraGuide.officialSource.authority}</span>
          <span>
            Official Source: <a href={fcraGuide.officialSource.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-primary)', textDecoration: 'underline' }}>{fcraGuide.officialSource.domain}</a> (Checked: {fcraGuide.officialSource.lastChecked})
          </span>
        </div>
      </div>
    </div>
  );
};
