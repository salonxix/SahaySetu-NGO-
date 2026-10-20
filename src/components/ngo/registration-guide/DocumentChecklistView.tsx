'use client';

import React from 'react';
import type { DocumentChecklistItem, OrganisationType } from '@/types/registration-guide';

interface DocumentChecklistViewProps {
  documents: DocumentChecklistItem[];
  checkedIds: string[];
  onToggleCheck: (id: string) => void;
  orgType: OrganisationType;
  state: string;
}

export const DocumentChecklistView: React.FC<DocumentChecklistViewProps> = ({
  documents,
  checkedIds,
  onToggleCheck,
  orgType,
  state,
}) => {
  const completedCount = documents.filter((d) => checkedIds.includes(d.id)).length;
  const progressPercent = documents.length > 0 ? Math.round((completedCount / documents.length) * 100) : 0;

  // Group by category
  const categories = Array.from(new Set(documents.map((d) => d.category)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header & Progress Bar */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem 1.75rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
              Statutory Preparation Checklist
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.15rem 0 0.25rem 0' }}>
              Documents & Information Checklist ({orgType} • {state})
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              Only items officially mandated by statutory authorities for {orgType} in {state} are listed below. Check off documents as you gather them.
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--brand-primary)' }}>
              {completedCount} of {documents.length} Ready
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>
              ({progressPercent}% Complete)
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div
          style={{
            height: '8px',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: '9999px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              backgroundColor: progressPercent === 100 ? '#059669' : 'var(--brand-primary)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Categorized Document Checklist Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {categories.map((category) => {
          const categoryDocs = documents.filter((d) => d.category === category);
          return (
            <div
              key={category}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem 1.5rem',
              }}
            >
              <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>📁</span> {category} ({categoryDocs.length})
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {categoryDocs.map((doc) => {
                  const isChecked = checkedIds.includes(doc.id);
                  return (
                    <div
                      key={doc.id}
                      onClick={() => onToggleCheck(doc.id)}
                      style={{
                        padding: '1rem 1.25rem',
                        borderRadius: 'var(--radius-sm)',
                        border: isChecked ? '1px solid var(--brand-primary)' : '1px solid var(--border-medium)',
                        backgroundColor: isChecked ? 'var(--bg-tint-emerald)' : 'var(--bg-canvas)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.85rem',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // Click handled by parent div
                        style={{ marginTop: '0.25rem', cursor: 'pointer', width: '16px', height: '16px' }}
                      />

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <strong style={{ fontSize: '0.925rem', color: isChecked ? 'var(--brand-primary)' : 'var(--text-primary)', textDecoration: isChecked ? 'line-through' : 'none' }}>
                            {doc.name}
                          </strong>

                          <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                            Source: <a href={doc.officialSource.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: 'var(--brand-primary)', textDecoration: 'underline' }}>{doc.officialSource.domain}</a>
                          </span>
                        </div>

                        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: '0 0 0.35rem 0', lineHeight: '1.4' }}>
                          <strong>Why Required:</strong> {doc.whyRequired}
                        </p>

                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {doc.applicableOrgTypes.map((t) => (
                            <span
                              key={t}
                              style={{
                                fontSize: '0.7rem',
                                padding: '0.1rem 0.4rem',
                                borderRadius: '4px',
                                backgroundColor: '#ffffff',
                                border: '1px solid var(--border-light)',
                                color: 'var(--text-secondary)',
                              }}
                            >
                              Applies to: {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
