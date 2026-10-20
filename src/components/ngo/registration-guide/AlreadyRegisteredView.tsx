'use client';

import React from 'react';
import type { QuestionnaireAnswers } from '@/types/registration-guide';

interface AlreadyRegisteredViewProps {
  answers: QuestionnaireAnswers;
  onNavigateTab: (tabId: string) => void;
}

export const AlreadyRegisteredView: React.FC<AlreadyRegisteredViewProps> = ({
  answers,
  onNavigateTab,
}) => {
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
        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
          Operating NGO Growth & Compliance Roadmap
        </span>
        <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.2rem 0 0.35rem 0' }}>
          Already Registered? Next Steps for Compliance, Grants & Public Reach
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
          Since your organisation ({answers.orgType} in {answers.state}) is already legally established, follow the statutory acceleration milestones below to unlock government grants, tax deduction certificates, and citizen engagement.
        </p>
      </div>

      {/* 5 Critical Action Tracks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {/* Track 1: NGO Darpan */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🆔</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
                CENTRAL GRANTS PREREQUISITE
              </span>
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              NGO Darpan Unique ID (NITI Aayog)
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '1rem' }}>
              If you haven&apos;t enrolled on ngodarpan.gov.in yet, complete your profile to obtain your Unique Darpan ID. Required for all Central Ministries grants and corporate CSR funds.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('darpan')}
            className="btn-civic btn-civic-primary"
            style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem', fontWeight: '700' }}
          >
            Open Darpan Guide →
          </button>
        </div>

        {/* Track 2: Tax Form 105 Regular Exemption */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '1.25rem' }}>📜</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
                5-YEAR TAX APPROVAL
              </span>
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              Regular Income Tax Registration (Form 105)
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '1rem' }}>
              Once you have commenced active charitable projects, transition from provisional registration to full 5-year regular registration via Form 105 on the e-Filing portal.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('tax')}
            className="btn-civic btn-civic-primary"
            style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem', fontWeight: '700' }}
          >
            View Tax Forms Guide →
          </button>
        </div>

        {/* Track 3: Foreign Aid (FCRA) */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🌐</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#d97706', textTransform: 'uppercase' }}>
                INTERNATIONAL FUNDING
              </span>
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              Foreign Contribution (FCRA) Review
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '1rem' }}>
              If you plan to receive international grants or overseas donations, review MHA requirements for Prior Permission (Form FC-3B) or 5-Year Registration (Form FC-3A).
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('fcra')}
            className="btn-civic btn-civic-secondary"
            style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
          >
            Open FCRA Guide →
          </button>
        </div>

        {/* Track 4: Welfare Schemes */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🏛️</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
                GOVERNMENT GRANTS
              </span>
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              Explore Matching Welfare Schemes
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '1rem' }}>
              Discover active grant programs, subsidies, and partnership tenders tailored for {answers.primarySector} in {answers.state}.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('schemes')}
            className="btn-civic btn-civic-primary"
            style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem', fontWeight: '700' }}
          >
            View Matching Schemes →
          </button>
        </div>

        {/* Track 5: SahaySetu Public Publishing */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🎁</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
                CITIZEN ENGAGEMENT
              </span>
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              Publish Needs & Services on SahaySetu
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '1rem' }}>
              Make your NGO discoverable by ordinary citizens and donors nearby. Publish donation needs, campaigns, events, and direct help services.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('public-profile')}
            className="btn-civic btn-civic-primary"
            style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem', fontWeight: '700' }}
          >
            Configure Public Profile →
          </button>
        </div>
      </div>
    </div>
  );
};
