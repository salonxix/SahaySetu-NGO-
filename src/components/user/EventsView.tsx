'use client';

import React from 'react';
import type { PublicNgoOrg, NgoEvent } from '@/types/user-portal';
import { formatDistance } from '@/lib/user/distance';

interface EventsViewProps {
  ngos: PublicNgoOrg[];
  onViewNgo: (ngo: PublicNgoOrg) => void;
  onGetDirections: (ngo: PublicNgoOrg) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  ngos,
  onViewNgo,
  onGetDirections,
}) => {
  const eventsList: { event: NgoEvent; ngo: PublicNgoOrg }[] = [];

  ngos.forEach((ngo) => {
    ngo.upcomingEvents.forEach((event) => {
      eventsList.push({ event, ngo });
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
            📅 Upcoming Donation Drives & Volunteer Camps
          </h2>
          <span
            style={{
              fontSize: '0.725rem',
              backgroundColor: 'var(--bg-tint-emerald)',
              color: 'var(--brand-primary)',
              padding: '0.15rem 0.55rem',
              borderRadius: '9999px',
              fontWeight: '600',
            }}
          >
            {eventsList.length} Scheduled Events
          </span>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Join hands in-person for sorting drives, blood donation camps, sapling plantations, and elder care visits.
        </p>
      </div>

      {eventsList.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem 1.5rem',
            backgroundColor: 'var(--bg-canvas)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-light)',
          }}
        >
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>📅</span>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            No upcoming events found within this search area
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Try extending your location radius or check back soon as local organisations post new weekend drives.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {eventsList.map(({ event, ngo }) => {
            const distanceKm = ngo.distanceKm ?? 0;
            return (
              <div
                key={event.id}
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className="badge-tag badge-emerald" style={{ fontSize: '0.7rem' }}>
                      {event.eventType}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--brand-accent)' }}>
                      📍 {formatDistance(distanceKm)} away
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                    {event.title}
                  </h3>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    Host: <strong>{ngo.name}</strong>
                  </div>

                  {/* Date & Time pill */}
                  <div
                    style={{
                      backgroundColor: 'var(--bg-tint-emerald)',
                      border: '1px solid #a7f3d0',
                      borderRadius: 'var(--radius-xs)',
                      padding: '0.5rem 0.75rem',
                      marginBottom: '0.75rem',
                      fontSize: '0.8rem',
                      color: '#065f46',
                      fontWeight: '600',
                    }}
                  >
                    📅 {event.date} • ⏰ {event.time}
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '0.75rem' }}>
                    {event.description}
                  </p>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    <strong>📍 Venue:</strong> {event.venue}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--brand-primary)', fontWeight: '600', marginBottom: '1rem' }}>
                    👉 Action: {event.participationAction}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-light)' }}>
                  <button
                    type="button"
                    onClick={() => onViewNgo(ngo)}
                    className="btn-civic btn-civic-primary"
                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}
                  >
                    View Org
                  </button>
                  <button
                    type="button"
                    onClick={() => onGetDirections(ngo)}
                    className="btn-civic btn-civic-secondary"
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                  >
                    🧭 Venue Route
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
