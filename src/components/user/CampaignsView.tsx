'use client';

import React from 'react';
import type { PublicNgoOrg, NgoCampaign } from '@/types/user-portal';
import { formatDistance } from '@/lib/user/distance';

interface CampaignsViewProps {
  ngos: PublicNgoOrg[];
  onViewNgo: (ngo: PublicNgoOrg) => void;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({ ngos, onViewNgo }) => {
  // Aggregate campaigns from all currently filtered/nearby NGOs
  const campaignsList: { campaign: NgoCampaign; ngo: PublicNgoOrg }[] = [];

  ngos.forEach((ngo) => {
    ngo.activeCampaigns.forEach((campaign) => {
      campaignsList.push({ campaign, ngo });
    });
  });

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
            📢 Active Community Campaigns & Drives
          </h2>
          <span
            style={{
              fontSize: '0.725rem',
              backgroundColor: 'var(--bg-tint-blue)',
              color: 'var(--brand-blue)',
              padding: '0.15rem 0.55rem',
              borderRadius: '9999px',
              fontWeight: '600',
            }}
          >
            {campaignsList.length} Active Drives
          </span>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Targeted community initiatives with specific collection targets, deadlines, and direct local drop-offs.
        </p>
      </div>

      {campaignsList.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem 1.5rem',
            backgroundColor: 'var(--bg-canvas)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-light)',
          }}
        >
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>📢</span>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            No active campaigns found within this filter radius
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Try increasing your search distance or clearing cause filters to explore campaigns across wider regions.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {campaignsList.map(({ campaign, ngo }) => {
            const distanceKm = ngo.distanceKm ?? 0;
            return (
              <div
                key={campaign.id}
                style={{
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.35rem',
                  backgroundColor: 'var(--bg-canvas)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <span className="badge-tag badge-blue" style={{ fontSize: '0.7rem' }}>
                      {campaign.cause}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--brand-accent)' }}>
                      📍 {formatDistance(distanceKm)} away
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                    {campaign.title}
                  </h3>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    Organised by <strong>{ngo.name}</strong>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '1rem' }}>
                    {campaign.description}
                  </p>

                  {/* Target & Progress */}
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-xs)',
                      padding: '0.75rem 1rem',
                      marginBottom: '0.85rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.825rem',
                    }}
                  >
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.725rem', display: 'block' }}>Target Goal</span>
                      <strong>{campaign.targetAmountOrUnits}</strong>
                    </div>
                    {campaign.collectedAmountOrUnits && (
                      <div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.725rem', display: 'block' }}>Progress</span>
                        <strong style={{ color: 'var(--brand-primary)' }}>{campaign.collectedAmountOrUnits}</strong>
                      </div>
                    )}
                  </div>

                  {/* Needed Items */}
                  {campaign.needsRequested.length > 0 && (
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                      <strong>Items Needed:</strong> {campaign.needsRequested.join(', ')}
                    </div>
                  )}
                </div>

                <div style={{ paddingTop: '0.85rem', borderTop: '1px solid var(--border-light)' }}>
                  <button
                    type="button"
                    onClick={() => onViewNgo(ngo)}
                    className="btn-civic btn-civic-primary"
                    style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }}
                  >
                    View Campaign & Organisation
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
