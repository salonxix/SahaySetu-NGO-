import React from 'react';
import type { NgoUser } from '@/types/auth';

interface ProfileCompletenessProps {
  ngoUser: NgoUser | null;
  onNavigateToProfile: () => void;
}

export const ProfileCompleteness: React.FC<ProfileCompletenessProps> = ({
  ngoUser,
  onNavigateToProfile,
}) => {
  const fields = [
    { key: 'ngoName', label: 'NGO Name', value: ngoUser?.ngoName },
    { key: 'registrationNumber', label: 'Darpan / Reg ID', value: ngoUser?.registrationNumber },
    { key: 'focusSector', label: 'Primary Focus Sector', value: ngoUser?.focusSector },
    { key: 'contactPerson', label: 'Contact Person Name', value: ngoUser?.contactPerson },
    { key: 'email', label: 'Official Email', value: ngoUser?.email },
    { key: 'phoneNumber', label: 'Contact Phone', value: ngoUser?.phoneNumber },
    { key: 'state', label: 'Operating State', value: ngoUser?.state },
    { key: 'city', label: 'City / District', value: ngoUser?.city },
    { key: 'address', label: 'Registered Address', value: ngoUser?.address },
  ];

  const completedCount = fields.filter((f) => Boolean(f.value && f.value.trim().length > 0)).length;
  const totalCount = fields.length;
  const percentage = Math.round((completedCount / totalCount) * 100);
  const isComplete = completedCount === totalCount;

  if (isComplete) {
    return (
      <div
        style={{
          backgroundColor: 'var(--bg-tint-emerald)',
          border: '1px solid #a7f3d0',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.25rem' }}>✅</span>
          <div>
            <strong style={{ color: '#065f46', fontSize: '0.95rem' }}>
              NGO Profile 100% Complete ({completedCount}/{totalCount} fields verified)
            </strong>
            <p style={{ color: '#047857', fontSize: '0.85rem' }}>
              Your profile is fully configured for automated scheme matching and eligibility verification.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onNavigateToProfile}
          className="btn-civic btn-civic-secondary"
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.825rem', borderColor: '#059669' }}
        >
          View Profile Details
        </button>
      </div>
    );
  }

  const missingFields = fields.filter((f) => !f.value || f.value.trim().length === 0);

  return (
    <div
      className="card animate-entrance"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        padding: '1.5rem 1.75rem',
        marginBottom: '1.75rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '1rem' }}>📋</span>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Complete your NGO profile
            </h3>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '0.15rem 0.5rem',
                borderRadius: '9999px',
                backgroundColor: 'var(--bg-tint-amber)',
                color: 'var(--brand-accent)',
              }}
            >
              {percentage}% Complete ({completedCount}/{totalCount} fields)
            </span>
          </div>
          <p className="body-text" style={{ fontSize: '0.875rem' }}>
            A complete profile helps SahaySetu identify schemes and grants that may be relevant to your organization.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToProfile}
          className="btn-civic btn-civic-primary"
          style={{ padding: '0.55rem 1rem', fontSize: '0.875rem' }}
        >
          Complete Profile →
        </button>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          height: '6px',
          backgroundColor: 'var(--border-light)',
          borderRadius: '3px',
          overflow: 'hidden',
          marginBottom: '1rem',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: 'var(--brand-primary)',
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* Missing items checklist */}
      <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
        <span>Pending fields to update: </span>
        <strong style={{ color: 'var(--text-secondary)' }}>
          {missingFields.map((f) => f.label).join(', ')}
        </strong>
      </div>
    </div>
  );
};
