'use client';

import React, { useState } from 'react';
import type { OrganisationTypeComparison, OrganisationType } from '@/types/registration-guide';

interface OrgTypeComparisonProps {
  comparisons: OrganisationTypeComparison[];
  selectedType?: OrganisationType;
  onSelectType: (type: OrganisationType) => void;
}

export const OrgTypeComparison: React.FC<OrgTypeComparisonProps> = ({
  comparisons,
  selectedType,
  onSelectType,
}) => {
  const [showOfficialDetails, setShowOfficialDetails] = useState<Record<string, boolean>>({});

  const toggleDetails = (type: string) => {
    setShowOfficialDetails((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Neutral guidance banner */}
      <div
        style={{
          padding: '1rem 1.25rem',
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem',
          color: 'var(--text-primary)',
          lineHeight: '1.5',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem' }}>⚖️</span>
          <div>
            <strong>Neutral Statutory Guidance:</strong> Which structure is appropriate depends on your objectives, location, governance preferences, and applicable law. SahaySetu does not rank or label any structure as &quot;best&quot;. Review the official requirements below and seek professional advice where necessary.
          </div>
        </div>
      </div>

      {/* Comparison Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {comparisons.map((comp) => {
          const isSelected = selectedType === comp.type;
          const isOfficialOpen = Boolean(showOfficialDetails[comp.type]);

          return (
            <div
              key={comp.type}
              style={{
                backgroundColor: '#ffffff',
                border: isSelected ? '2px solid var(--brand-primary)' : '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isSelected ? '0 4px 12px rgba(22, 101, 52, 0.08)' : '0 1px 3px rgba(0,0,0,0.02)',
                position: 'relative',
              }}
            >
              <div>
                {/* Header with Type & Selection badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      backgroundColor: isSelected ? 'var(--bg-tint-emerald)' : 'var(--bg-subtle)',
                      color: isSelected ? 'var(--brand-primary)' : 'var(--text-secondary)',
                    }}
                  >
                    {comp.jurisdiction}
                  </span>

                  {isSelected && (
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--brand-primary)' }}>
                      ✓ Selected in Roadmap
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {comp.title}
                </h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontStyle: 'italic' }}>
                  {comp.tagline}
                </p>

                {/* Key Quick Facts */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-canvas)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.85rem 1rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    fontSize: '0.825rem',
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.725rem', fontWeight: '600' }}>
                      GOVERNING ACT
                    </span>
                    <strong style={{ color: 'var(--text-primary)' }}>{comp.governingAct}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.725rem', fontWeight: '600' }}>
                      REGISTERING AUTHORITY
                    </span>
                    <span style={{ color: 'var(--text-primary)' }}>{comp.registeringAuthority}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.725rem', fontWeight: '600' }}>
                      MINIMUM FOUNDERS / GOVERNANCE
                    </span>
                    <span style={{ color: 'var(--text-primary)' }}>{comp.minimumFounders} • Governed by {comp.managementBody}</span>
                  </div>
                </div>

                {/* Dual Level Description: Simple vs Official */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '0.5rem' }}>
                    {comp.generalRouteSummary.simpleExplanation}
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleDetails(comp.type)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--brand-primary)',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    <span>{isOfficialOpen ? '▼ Hide Official Statutory Details' : '▶ View Official Statutory Details'}</span>
                  </button>

                  {isOfficialOpen && (
                    <div
                      style={{
                        marginTop: '0.5rem',
                        padding: '0.75rem',
                        backgroundColor: 'var(--bg-tint-emerald)',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '0.8rem',
                        color: 'var(--text-primary)',
                        borderLeft: '3px solid var(--brand-primary)',
                        lineHeight: '1.4',
                      }}
                    >
                      {comp.generalRouteSummary.officialDetails}
                    </div>
                  )}
                </div>

                {/* Key Characteristics */}
                <div style={{ marginBottom: '1rem' }}>
                  <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>
                    Key Considerations:
                  </strong>
                  <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    {comp.keyAdvantages.slice(0, 2).map((adv, idx) => (
                      <li key={idx} style={{ marginBottom: '0.25rem' }}>
                        ✓ {adv}
                      </li>
                    ))}
                    {comp.governanceConsiderations.slice(0, 1).map((gov, idx) => (
                      <li key={`gov-${idx}`} style={{ marginBottom: '0.25rem', color: '#9a3412' }}>
                        ℹ️ {gov}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer: Source and Selection Button */}
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>
                    Source: <a href={comp.officialSource.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-primary)', textDecoration: 'underline' }}>{comp.officialSource.domain}</a>
                  </span>
                  <span>Checked: {comp.officialSource.lastChecked}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => onSelectType(comp.type)}
                    className={isSelected ? 'btn-civic btn-civic-primary' : 'btn-civic btn-civic-secondary'}
                    style={{ flex: 1, padding: '0.55rem 0.85rem', fontSize: '0.85rem', fontWeight: '700' }}
                  >
                    {isSelected ? '✓ Exploring This Structure' : `Select ${comp.type}`}
                  </button>
                  <a
                    href={comp.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-civic btn-civic-secondary"
                    style={{ padding: '0.55rem 0.75rem', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                    title={`Open official registration portal for ${comp.type}`}
                  >
                    Official Portal ↗
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
