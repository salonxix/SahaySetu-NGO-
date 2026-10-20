'use client';

import React from 'react';
import type { NgoApplication } from '@/types/ngo';

interface ApplicationDetailsModalProps {
  application: NgoApplication | null;
  onClose: () => void;
}

export const ApplicationDetailsModal: React.FC<ApplicationDetailsModalProps> = ({
  application,
  onClose,
}) => {
  if (!application) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="app-details-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 80,
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          maxWidth: '680px',
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
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--border-light)',
            backgroundColor: 'var(--bg-canvas)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                color: 'var(--brand-primary)',
                backgroundColor: 'var(--bg-tint-emerald)',
                padding: '0.15rem 0.5rem',
                borderRadius: '4px',
                fontWeight: '700',
              }}
            >
              Ref: {application.referenceNumber}
            </span>
            <h2 id="app-details-title" style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '0.35rem' }}>
              {application.schemeTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close application details"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.4rem',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.2rem',
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.875rem' }}>
          {/* Status & Milestone Box */}
          <div
            style={{
              backgroundColor: 'var(--bg-canvas)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Review Status:</span>
              <span className="badge-tag badge-emerald" style={{ fontSize: '0.75rem' }}>
                {application.status}
              </span>
            </div>
            <div>
              <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Next Action:</strong>
              <p style={{ margin: '0.15rem 0 0', fontWeight: '500', color: 'var(--text-primary)' }}>
                {application.nextAction}
              </p>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Last Updated: {application.lastUpdated}
            </div>
          </div>

          {/* Form Proposal Details if available */}
          {application.formData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                Submitted Proposal Details
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <strong style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Project Title</strong>
                  <span>{application.formData.projectTitle}</span>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Target Beneficiaries</strong>
                  <span>{application.formData.beneficiaryGroup} ({application.formData.targetBeneficiaryCount} people)</span>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Implementation District</strong>
                  <span>{application.formData.targetDistrict}</span>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Grant Requested</strong>
                  <span>₹{Number(application.formData.budgetRequested).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div>
                <strong style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Project Summary</strong>
                <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {application.formData.projectSummary}
                </p>
              </div>

              <div>
                <strong style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Key Outcomes</strong>
                <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {application.formData.expectedOutcomes}
                </p>
              </div>

              <div>
                <strong style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Attached Statutory Documents</strong>
                <ul style={{ paddingLeft: '1.2rem', margin: '0.35rem 0 0', color: 'var(--text-secondary)' }}>
                  {application.formData.readyDocuments.map((doc, idx) => (
                    <li key={idx}>{doc}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-secondary)' }}>
              Standard prototype application record. Review stage updates will be reflected here upon officer evaluation.
            </div>
          )}

          {/* Prototype disclaimer */}
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.775rem',
              color: '#92400e',
            }}
          >
            <strong>Prototype Data Notice:</strong> This application record is simulated for HCI academic evaluation and was not sent to a government ministry.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1rem 1.75rem',
            borderTop: '1px solid var(--border-light)',
            backgroundColor: '#ffffff',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn-civic btn-civic-secondary"
            style={{ padding: '0.5rem 1.25rem' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
