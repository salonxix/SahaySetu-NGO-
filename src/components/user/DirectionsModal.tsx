'use client';

import React, { useEffect } from 'react';
import type { PublicNgoOrg, UserLocation } from '@/types/user-portal';
import { formatDistance } from '@/lib/user/distance';

interface DirectionsModalProps {
  ngo: PublicNgoOrg | null;
  userLocation: UserLocation;
  isOpen: boolean;
  onClose: () => void;
}

export const DirectionsModal: React.FC<DirectionsModalProps> = ({
  ngo,
  userLocation,
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !ngo) return null;

  const distanceKm = ngo.distanceKm ?? 0;

  // Approximate transit calculations based on Indian urban traffic norms
  const driveMinutes = Math.max(5, Math.round((distanceKm / 25) * 60 + 5));
  const transitMinutes = Math.max(10, Math.round((distanceKm / 18) * 60 + 10));
  const walkMinutes = Math.round((distanceKm / 4.5) * 60);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${ngo.latitude},${ngo.longitude}`;
  const osmUrl = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userLocation.latitude}%2C${userLocation.longitude}%3B${ngo.latitude}%2C${ngo.longitude}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="directions-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1050,
        backgroundColor: 'rgba(15, 36, 29, 0.65)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          maxWidth: '540px',
          width: '100%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          border: '1px solid var(--border-light)',
          padding: '1.75rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <h2 id="directions-modal-title" style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              🧭 Route & Directions
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Travel estimates from your location to <strong>{ngo.name}</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close directions dialog"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.25rem',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.25rem',
            }}
          >
            ✕
          </button>
        </div>

        {/* Route Endpoints Box */}
        <div
          style={{
            backgroundColor: 'var(--bg-canvas)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-sm)',
            padding: '1rem',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1rem' }}>📍</span>
            <div>
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600', display: 'block' }}>
                Starting Point (Your Location)
              </span>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {userLocation.label}
              </strong>
            </div>
          </div>

          <div style={{ borderLeft: '2px dashed var(--border-medium)', height: '14px', marginLeft: '14px', marginBottom: '0.35rem' }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <span style={{ fontSize: '1rem' }}>🏢</span>
            <div>
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600', display: 'block' }}>
                Destination Organisation
              </span>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {ngo.name}
              </strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {ngo.address}, {ngo.city}, {ngo.state} - {ngo.pincode}
              </div>
            </div>
          </div>
        </div>

        {/* Distance & Travel Time Estimates */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1.25rem', textAlign: 'center' }}>
          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.65rem 0.4rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '1rem', display: 'block' }}>🚗</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Drive</span>
            <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>~{driveMinutes}m</strong>
          </div>

          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.65rem 0.4rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '1rem', display: 'block' }}>🚇</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Transit</span>
            <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>~{transitMinutes}m</strong>
          </div>

          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.65rem 0.4rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '1rem', display: 'block' }}>🚶</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Walk</span>
            <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>~{walkMinutes}m</strong>
          </div>

          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.65rem 0.4rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '1rem', display: 'block' }}>📏</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Span</span>
            <strong style={{ fontSize: '0.85rem', color: 'var(--brand-accent)' }}>{formatDistance(distanceKm)}</strong>
          </div>
        </div>

        {/* Visiting hours and contact confirmation */}
        <div style={{ backgroundColor: 'var(--bg-tint-emerald)', border: '1px solid #a7f3d0', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: '#065f46', marginBottom: '1.25rem' }}>
          📞 <strong>Drop-off Advice:</strong> Contact coordinator at <strong>{ngo.phone}</strong> before heading out for large donations or furniture delivery.
        </div>

        {/* External Map Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-civic btn-civic-primary"
            style={{
              padding: '0.65rem 1rem',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
            }}
          >
            <span>🗺️</span> Open in Google Maps
          </a>

          <a
            href={osmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-civic btn-civic-secondary"
            style={{
              padding: '0.65rem 1rem',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
            }}
          >
            <span>🌐</span> Open in OpenStreetMap
          </a>
        </div>
      </div>
    </div>
  );
};
