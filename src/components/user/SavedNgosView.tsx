'use client';

import React from 'react';
import type { PublicNgoOrg } from '@/types/user-portal';
import { NgoCard } from './NgoCard';

interface SavedNgosViewProps {
  savedNgos: PublicNgoOrg[];
  savedNgoIds: string[];
  onToggleSave: (ngoId: string) => void;
  onViewDetails: (ngo: PublicNgoOrg) => void;
  onGetDirections: (ngo: PublicNgoOrg) => void;
  onExploreClick: () => void;
}

export const SavedNgosView: React.FC<SavedNgosViewProps> = ({
  savedNgos,
  savedNgoIds,
  onToggleSave,
  onViewDetails,
  onGetDirections,
  onExploreClick,
}) => {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        padding: '1.75rem',
        marginBottom: '2rem',
      }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            ⭐ Saved Organisations & Shortlist
          </h2>
          <span
            style={{
              fontSize: '0.725rem',
              backgroundColor: 'var(--bg-tint-amber)',
              color: 'var(--brand-accent)',
              padding: '0.15rem 0.55rem',
              borderRadius: '9999px',
              fontWeight: '700',
            }}
          >
            {savedNgos.length} Saved
          </span>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Quickly access and track non-profits you plan to contribute to or volunteer with in future.
        </p>
      </div>

      {savedNgos.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3.5rem 1.5rem',
            backgroundColor: 'var(--bg-canvas)',
            borderRadius: 'var(--radius-sm)',
            border: '1px dashed var(--border-medium)',
          }}
        >
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>⭐</span>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            No saved organisations yet
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.25rem' }}>
            Save organisations you may want to support later by clicking the <strong>Save</strong> button on any organisation card.
          </p>
          <button
            type="button"
            onClick={onExploreClick}
            className="btn-civic btn-civic-primary"
            style={{ padding: '0.55rem 1.25rem', fontSize: '0.875rem' }}
          >
            Explore Nearby Organisations
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {savedNgos.map((ngo) => (
            <NgoCard
              key={ngo.id}
              ngo={ngo}
              isSaved={savedNgoIds.includes(ngo.id)}
              onToggleSave={onToggleSave}
              onViewDetails={onViewDetails}
              onGetDirections={onGetDirections}
            />
          ))}
        </div>
      )}
    </div>
  );
};
