'use client';

import React from 'react';
import type { DonationType } from '@/types/user-portal';

interface DonationTypeFilterProps {
  selectedTypes: DonationType[];
  onChange: (types: DonationType[]) => void;
}

interface DonationOption {
  type: DonationType;
  icon: string;
  label: string;
}

export const DONATION_OPTIONS: DonationOption[] = [
  { type: 'Books', icon: '📚', label: 'Books' },
  { type: 'Clothes', icon: '👕', label: 'Clothes' },
  { type: 'Stationery', icon: '✏️', label: 'Stationery' },
  { type: 'Food', icon: '🍲', label: 'Food & Rations' },
  { type: 'Medicines', icon: '💊', label: 'Medicines & Hygiene' },
  { type: 'Toys', icon: '🧸', label: 'Toys' },
  { type: 'Electronics', icon: '💻', label: 'Electronics & Devices' },
  { type: 'Furniture', icon: '🪑', label: 'Furniture & Aids' },
  { type: 'Volunteer time', icon: '🤝', label: 'Volunteer Time' },
  { type: 'Money', icon: '💳', label: 'Monetary Support' },
  { type: 'Other', icon: '📦', label: 'Other Items' },
];

export const DonationTypeFilter: React.FC<DonationTypeFilterProps> = ({
  selectedTypes,
  onChange,
}) => {
  const toggleType = (type: DonationType) => {
    if (selectedTypes.includes(type)) {
      onChange(selectedTypes.filter((t) => t !== type));
    } else {
      onChange([...selectedTypes, type]);
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '0.85rem',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>🎁</span> What would you like to contribute?
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Select one or more items to filter organisations accepting these donations.
          </p>
        </div>

        {selectedTypes.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                backgroundColor: 'var(--bg-tint-emerald)',
                color: 'var(--brand-primary)',
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                fontWeight: '600',
              }}
            >
              {selectedTypes.length} type{selectedTypes.length > 1 ? 's' : ''} selected
            </span>
            <button
              type="button"
              onClick={handleClearAll}
              style={{
                fontSize: '0.775rem',
                color: 'var(--text-muted)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Clear selection
            </button>
          </div>
        )}
      </div>

      {/* Donation Type Pills / Chips */}
      <div
        role="group"
        aria-label="Filter by contribution type"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        {DONATION_OPTIONS.map((opt) => {
          const isSelected = selectedTypes.includes(opt.type);
          return (
            <button
              key={opt.type}
              type="button"
              onClick={() => toggleType(opt.type)}
              aria-pressed={isSelected}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: isSelected ? '600' : '500',
                border: '1px solid',
                borderColor: isSelected ? 'var(--brand-primary)' : 'var(--border-medium)',
                backgroundColor: isSelected ? 'var(--brand-primary)' : 'var(--bg-canvas)',
                color: isSelected ? '#ffffff' : 'var(--text-primary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
              {isSelected && <span style={{ fontSize: '0.75rem', marginLeft: '0.1rem' }}>✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
