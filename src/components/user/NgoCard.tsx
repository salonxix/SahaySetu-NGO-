'use client';

import React from 'react';
import type { PublicNgoOrg, DonationType } from '@/types/user-portal';
import { formatDistance } from '@/lib/user/distance';

interface NgoCardProps {
  ngo: PublicNgoOrg;
  isSaved: boolean;
  onToggleSave: (ngoId: string) => void;
  onViewDetails: (ngo: PublicNgoOrg) => void;
  onGetDirections: (ngo: PublicNgoOrg) => void;
  onRequestHelp?: (ngo: PublicNgoOrg) => void;
  selectedDonationTypes?: DonationType[];
  needHelpMode?: boolean;
  selectedHelpService?: string;
}

export const NgoCard: React.FC<NgoCardProps> = ({
  ngo,
  isSaved,
  onToggleSave,
  onViewDetails,
  onGetDirections,
  onRequestHelp,
  selectedDonationTypes = [],
  needHelpMode = false,
  selectedHelpService = 'all',
}) => {
  const distanceKm = ngo.distanceKm ?? 0;
  const acceptingNeeds = ngo.currentNeeds.filter((n) => n.status === 'Accepting');
  const activeCampaign = ngo.activeCampaigns[0];
  const services = ngo.servicesProvided || [];

  // Determine matching service explanation if in Help mode
  const matchedService =
    selectedHelpService !== 'all'
      ? services.find((s) => s.toLowerCase() === selectedHelpService.toLowerCase())
      : services[0];

  return (
    <article
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        position: 'relative',
      }}
      className="ngo-discovery-card"
    >
      <div>
        {/* Top Header: Distance badge, Verified badge & Save button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '0.75rem',
            marginBottom: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: 'var(--brand-accent)',
                backgroundColor: 'var(--bg-tint-amber)',
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              📍 {formatDistance(distanceKm)} away
            </span>

            {ngo.verified && (
              <span
                className="badge-tag badge-emerald"
                style={{ fontSize: '0.7rem' }}
                title="Verified Statutory NGO entity"
              >
                ✓ Darpan Verified
              </span>
            )}
          </div>

          {/* Bookmark / Save Action */}
          <button
            type="button"
            onClick={() => onToggleSave(ngo.id)}
            aria-label={isSaved ? `Remove ${ngo.name} from saved` : `Save ${ngo.name}`}
            style={{
              background: isSaved ? 'var(--bg-tint-amber)' : 'var(--bg-canvas)',
              border: '1px solid',
              borderColor: isSaved ? '#fcd34d' : 'var(--border-medium)',
              color: isSaved ? '#b45309' : 'var(--text-muted)',
              borderRadius: '9999px',
              padding: '0.35rem 0.65rem',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{isSaved ? '★' : '☆'}</span>
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        {/* Organisation Name & Address */}
        <h3
          style={{
            fontSize: '1.2rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            lineHeight: '1.3',
            marginBottom: '0.35rem',
          }}
        >
          {ngo.name}
        </h3>

        <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
          📍 {ngo.address}, {ngo.city} ({ngo.state})
        </div>

        {/* Match Reason Banner if in Help Mode */}
        {needHelpMode && matchedService && (
          <div
            style={{
              backgroundColor: 'var(--bg-tint-emerald)',
              border: '1px solid rgba(22, 101, 52, 0.25)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.5rem 0.75rem',
              fontSize: '0.8rem',
              color: 'var(--brand-primary)',
              fontWeight: '600',
              marginBottom: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>💡</span>
            <span>Shown because this NGO provides <strong>{matchedService}</strong>.</span>
          </div>
        )}

        {/* Causes Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
          {ngo.primaryCauses.map((cause) => (
            <span
              key={cause}
              style={{
                fontSize: '0.725rem',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                padding: '0.15rem 0.5rem',
                borderRadius: '4px',
                fontWeight: '600',
              }}
            >
              {cause}
            </span>
          ))}
        </div>

        {/* About summary */}
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.5',
            marginBottom: '1rem',
          }}
        >
          {ngo.about}
        </p>

        {/* Contribution Type Match Tags or Services Tags */}
        {!needHelpMode ? (
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Accepted Contributions:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {ngo.acceptedDonationTypes.map((type) => {
                const isMatch = selectedDonationTypes.includes(type);
                return (
                  <span
                    key={type}
                    style={{
                      fontSize: '0.725rem',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '9999px',
                      fontWeight: isMatch ? '700' : '500',
                      backgroundColor: isMatch ? 'var(--bg-tint-emerald)' : 'var(--bg-canvas)',
                      color: isMatch ? 'var(--brand-primary)' : 'var(--text-secondary)',
                      border: '1px solid',
                      borderColor: isMatch ? 'var(--brand-primary)' : 'var(--border-light)',
                    }}
                  >
                    {isMatch ? `✓ ${type}` : type}
                  </span>
                );
              })}
            </div>
          </div>
        ) : (
          services.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                Services & Support Available:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {services.map((srv) => (
                  <span
                    key={srv}
                    style={{
                      fontSize: '0.725rem',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                      fontWeight: '600',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-light)',
                    }}
                  >
                    ✓ {srv}
                  </span>
                ))}
              </div>
            </div>
          )
        )}

        {/* Immediate Needs Callout */}
        {!needHelpMode && acceptingNeeds.length > 0 && (
          <div
            style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.8rem' }}>📦</span>
              <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                Urgent Needs ({acceptingNeeds.length}):
              </strong>
            </div>
            <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {acceptingNeeds.slice(0, 2).map((need) => (
                <li key={need.id} style={{ marginBottom: '0.15rem' }}>
                  <strong>{need.item}</strong> ({need.quantityNeeded})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Active Campaign Banner if exists */}
        {!needHelpMode && activeCampaign && (
          <div
            style={{
              backgroundColor: 'var(--bg-tint-blue)',
              border: '1px solid #bfdbfe',
              borderRadius: 'var(--radius-sm)',
              padding: '0.65rem 0.85rem',
              marginBottom: '1.25rem',
              fontSize: '0.8rem',
              color: 'var(--brand-blue)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span>📢</span>
            <span>
              <strong>Active Drive:</strong> {activeCampaign.title}
            </span>
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div
        style={{
          display: 'flex',
          gap: '0.6rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-light)',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={() => onViewDetails(ngo)}
          className="btn-civic btn-civic-primary"
          style={{ flex: 1, padding: '0.55rem 0.85rem', fontSize: '0.875rem' }}
        >
          View Details
        </button>

        {needHelpMode && onRequestHelp && (
          <button
            type="button"
            onClick={() => onRequestHelp(ngo)}
            style={{
              padding: '0.55rem 1rem',
              backgroundColor: 'var(--brand-accent)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            Request Help
          </button>
        )}

        <button
          type="button"
          onClick={() => onGetDirections(ngo)}
          className="btn-civic btn-civic-secondary"
          style={{ padding: '0.55rem 0.85rem', fontSize: '0.875rem' }}
          aria-label={`Get directions to ${ngo.name}`}
        >
          🧭 Directions
        </button>
      </div>
    </article>
  );
};
