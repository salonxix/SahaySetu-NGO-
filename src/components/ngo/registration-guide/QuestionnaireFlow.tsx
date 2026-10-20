'use client';

import React from 'react';
import type {
  OrganisationType,
  RegistrationStage,
  QuestionnaireAnswers,
} from '@/types/registration-guide';

const STATES_LIST = [
  'Delhi',
  'Karnataka',
  'Maharashtra',
  'Uttar Pradesh',
  'Tamil Nadu',
  'West Bengal',
  'Telangana',
  'Rajasthan',
  'Gujarat',
  'Kerala',
  'Bihar',
  'Madhya Pradesh',
  'Punjab',
  'Haryana',
  'Odisha',
];

const SECTORS_LIST = [
  'Education',
  'Healthcare',
  'Women & Girls',
  'Children',
  'Disability Support',
  'Elderly Care',
  'Environment & Climate',
  'Rural Development',
  'Skill Development',
  'Animal Welfare',
  'Disaster Relief',
  'Art & Culture',
  'Other Social Causes',
];

const OBJECTIVES_OPTIONS = [
  { id: 'donations', label: 'Receive public donations', icon: '🎁' },
  { id: 'schemes', label: 'Apply for government welfare schemes', icon: '🏛️' },
  { id: 'grants', label: 'Receive institutional & CSR grants', icon: '💰' },
  { id: 'gov_collab', label: 'Work directly with government departments', icon: '🤝' },
  { id: 'foreign_aid', label: 'Receive eligible foreign contributions (FCRA)', icon: '🌐' },
  { id: 'tax_exemptions', label: 'Issue donor tax documentation (IT Dept approvals)', icon: '📜' },
  { id: 'public_programmes', label: 'Run community field programmes', icon: '📣' },
  { id: 'volunteers', label: 'Recruit community volunteers', icon: '🙋' },
];

interface QuestionnaireFlowProps {
  answers: QuestionnaireAnswers;
  onChange: (updated: QuestionnaireAnswers) => void;
  onContinue: () => void;
}

export const QuestionnaireFlow: React.FC<QuestionnaireFlowProps> = ({
  answers,
  onChange,
  onContinue,
}) => {
  const handleStageChange = (stage: RegistrationStage) => {
    onChange({ ...answers, stage });
  };

  const handleOrgTypeChange = (orgType: OrganisationType) => {
    onChange({ ...answers, orgType });
  };

  const handleStateChange = (state: string) => {
    onChange({ ...answers, state });
  };

  const handleSectorChange = (primarySector: string) => {
    onChange({ ...answers, primarySector });
  };

  const toggleObjective = (objId: string) => {
    const current = answers.objectives || [];
    const updated = current.includes(objId)
      ? current.filter((id) => id !== objId)
      : [...current, objId];
    onChange({ ...answers, objectives: updated });
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        padding: '1.75rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      }}
    >
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            color: 'var(--brand-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          Decision Wizard & Personalization
        </span>
        <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.2rem 0 0.4rem 0' }}>
          Let&apos;s find the right registration & support path
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
          Answer 5 quick questions to personalize statutory registration roadmaps, document checklists, tax approvals, and government portal instructions.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Question A: Registration Stage */}
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            A. Are you starting a new organisation or already registered? *
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
            {(['Starting New', 'Already Registered'] as RegistrationStage[]).map((stage) => {
              const isSelected = answers.stage === stage;
              return (
                <button
                  key={stage}
                  type="button"
                  onClick={() => handleStageChange(stage)}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: isSelected ? '2px solid var(--brand-primary)' : '1px solid var(--border-medium)',
                    backgroundColor: isSelected ? 'var(--bg-tint-emerald)' : '#ffffff',
                    color: isSelected ? 'var(--brand-primary)' : 'var(--text-primary)',
                    fontWeight: isSelected ? '700' : '500',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{stage === 'Starting New' ? '🌱' : '🏢'}</span>
                  <div>
                    <div>{stage === 'Starting New' ? 'Starting a new organisation' : 'Already registered organisation'}</div>
                    <span style={{ fontSize: '0.75rem', color: isSelected ? 'var(--brand-primary)' : 'var(--text-muted)' }}>
                      {stage === 'Starting New' ? 'Explore legal structures & steps' : 'Tax, Darpan, FCRA & schemes'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Question B: Organisation Type */}
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            B. What type of organisation are you considering or operating? *
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.65rem' }}>
            {(['Trust', 'Society', 'Section 8 Company', 'Not Sure'] as OrganisationType[]).map((type) => {
              const isSelected = answers.orgType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleOrgTypeChange(type)}
                  style={{
                    padding: '0.75rem 0.9rem',
                    borderRadius: 'var(--radius-sm)',
                    border: isSelected ? '2px solid var(--brand-primary)' : '1px solid var(--border-medium)',
                    backgroundColor: isSelected ? 'var(--bg-tint-emerald)' : '#ffffff',
                    color: isSelected ? 'var(--brand-primary)' : 'var(--text-primary)',
                    fontWeight: isSelected ? '700' : '500',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ fontWeight: '700' }}>
                    {isSelected ? '✓ ' : ''}{type === 'Section 8 Company' ? 'Section 8 Non-Profit Co.' : type}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: isSelected ? 'var(--brand-primary)' : 'var(--text-muted)', marginTop: '0.15rem' }}>
                    {type === 'Trust' && 'Trust deed before Sub-Registrar'}
                    {type === 'Society' && '7+ members with democratic rules'}
                    {type === 'Section 8 Company' && 'Central corporate MCA incorporation'}
                    {type === 'Not Sure' && 'Compare all 3 options neutrally'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Question C & D: State and Primary Sector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div>
            <label htmlFor="guide-state-select" style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              C. State of Operation *
            </label>
            <select
              id="guide-state-select"
              value={answers.state}
              onChange={(e) => handleStateChange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.875rem',
                backgroundColor: '#ffffff',
                color: 'var(--text-primary)',
              }}
            >
              {STATES_LIST.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'block' }}>
              State-specific Sub-Registrar & Registry guidelines will be fetched automatically.
            </span>
          </div>

          <div>
            <label htmlFor="guide-sector-select" style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              D. Primary Area of Work (Sector) *
            </label>
            <select
              id="guide-sector-select"
              value={answers.primarySector}
              onChange={(e) => handleSectorChange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.875rem',
                backgroundColor: '#ffffff',
                color: 'var(--text-primary)',
              }}
            >
              {SECTORS_LIST.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'block' }}>
              Used to filter relevant government scheme opportunities.
            </span>
          </div>
        </div>

        {/* Question E: What do you want to do? */}
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            E. What are your key organisational objectives? (Select all that apply)
          </label>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 0.65rem 0' }}>
            Selecting an objective highlights the relevant approvals (e.g. Form 104, NGO Darpan, FCRA) but does not replace official eligibility verification.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0.5rem' }}>
            {OBJECTIVES_OPTIONS.map((opt) => {
              const isChecked = (answers.objectives || []).includes(opt.id);
              return (
                <div
                  key={opt.id}
                  onClick={() => toggleObjective(opt.id)}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: isChecked ? '1px solid var(--brand-primary)' : '1px solid var(--border-medium)',
                    backgroundColor: isChecked ? 'var(--bg-tint-emerald)' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.85rem',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    style={{ cursor: 'pointer' }}
                  />
                  <span>{opt.icon}</span>
                  <span style={{ fontWeight: isChecked ? '700' : '500', color: isChecked ? 'var(--brand-primary)' : 'var(--text-primary)' }}>
                    {opt.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Continue Action */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
          <button
            type="button"
            onClick={onContinue}
            className="btn-civic btn-civic-primary"
            style={{ padding: '0.7rem 1.5rem', fontSize: '0.925rem', fontWeight: '700' }}
          >
            Generate My Personalized Guide & Roadmap →
          </button>
        </div>
      </div>
    </div>
  );
};
