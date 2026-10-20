'use client';

import React, { useState, useEffect } from 'react';
import type { UserLocation } from '@/types/user-portal';
import { PRESET_LOCATIONS } from '@/lib/user/distance';

interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: UserLocation;
  onSelectLocation: (location: UserLocation) => void;
}

export const LocationSelectorModal: React.FC<LocationSelectorModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}) => {
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleUseBrowserLocation = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser. Please select a city below.');
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLoading(false);
        const loc: UserLocation = {
          label: 'Your Current GPS Location',
          city: 'Local Area',
          state: '',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          isCustomOrBrowser: true,
        };
        onSelectLocation(loc);
        onClose();
      },
      (error) => {
        setGeoLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGeoError(
            'Location permission was declined. You can select your city or area manually below.'
          );
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setGeoError('Position information is unavailable. Please pick a location manually.');
        } else {
          setGeoError('Unable to retrieve location. Please choose a nearby city from the list.');
        }
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  const filteredPresets = PRESET_LOCATIONS.filter((loc) =>
    loc.label.toLowerCase().includes(searchFilter.toLowerCase()) ||
    loc.city.toLowerCase().includes(searchFilter.toLowerCase()) ||
    loc.state.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="loc-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
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
          maxWidth: '560px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid var(--border-light)',
          padding: '1.75rem',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1rem',
          }}
        >
          <div>
            <h2
              id="loc-modal-title"
              style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
              }}
            >
              Choose Your Location
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Your location helps us show nearby organisations and donation opportunities.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close location selector"
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

        {/* Privacy Note */}
        <div
          style={{
            backgroundColor: 'var(--bg-tint-blue)',
            border: '1px solid #bfdbfe',
            borderRadius: 'var(--radius-sm)',
            padding: '0.75rem 1rem',
            fontSize: '0.8rem',
            color: 'var(--brand-blue)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span>🔒</span>
          <span>
            <strong>Privacy Guarantee:</strong> Location is only used to compute approximate distances to nearby NGOs. We do not track or share your location.
          </span>
        </div>

        {/* Option 1: Browser Geolocation */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={handleUseBrowserLocation}
            disabled={geoLoading}
            className="btn-civic btn-civic-primary"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              fontSize: '0.925rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <span>🎯</span>
            <span>{geoLoading ? 'Detecting Location...' : 'Use My Current GPS Location'}</span>
          </button>

          {geoError && (
            <div
              style={{
                marginTop: '0.6rem',
                padding: '0.6rem 0.85rem',
                backgroundColor: 'var(--error-bg)',
                border: '1px solid var(--error-border)',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.8rem',
                color: 'var(--error-text)',
              }}
            >
              ⚠️ {geoError}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            margin: '1.25rem 0',
          }}
        >
          <hr style={{ flex: 1, borderColor: 'var(--border-light)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            OR PICK FROM POPULAR HUBS
          </span>
          <hr style={{ flex: 1, borderColor: 'var(--border-light)' }} />
        </div>

        {/* Search Preset */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="loc-filter-input" className="form-label" style={{ fontSize: '0.8rem' }}>
            Search City or Neighbourhood:
          </label>
          <input
            id="loc-filter-input"
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="e.g. Connaught Place, Indiranagar, Bandra..."
            className="form-input"
            style={{ fontSize: '0.875rem' }}
          />
        </div>

        {/* Presets List */}
        <div
          style={{
            maxHeight: '220px',
            overflowY: 'auto',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
          }}
        >
          {filteredPresets.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
              No matching preset found. Try searching another city.
            </p>
          ) : (
            filteredPresets.map((loc, idx) => {
              const isSelected =
                currentLocation.label === loc.label &&
                currentLocation.latitude === loc.latitude &&
                currentLocation.longitude === loc.longitude;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onSelectLocation(loc);
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.65rem 0.85rem',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--brand-primary)' : 'transparent',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: isSelected ? 'var(--bg-tint-emerald)' : 'var(--bg-canvas)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)', display: 'block' }}>
                      📍 {loc.label}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {loc.city}, {loc.state}
                    </span>
                  </div>
                  {isSelected && (
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--brand-primary)' }}>
                      ✓ Active
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn-civic btn-civic-secondary"
            style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
