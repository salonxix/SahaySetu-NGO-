'use client';

import React, { useState, useMemo } from 'react';
import type { PublicNgoOrg, UserLocation } from '@/types/user-portal';
import { formatDistance } from '@/lib/user/distance';

interface NgoInteractiveMapProps {
  ngos: PublicNgoOrg[];
  userLocation: UserLocation;
  onSelectNgo: (ngo: PublicNgoOrg) => void;
  onGetDirections: (ngo: PublicNgoOrg) => void;
}

const MAP_CENTER = { x: 400, y: 260 };

export const NgoInteractiveMap: React.FC<NgoInteractiveMapProps> = ({
  ngos,
  userLocation,
  onSelectNgo,
  onGetDirections,
}) => {
  const [selectedNgoId, setSelectedNgoId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 0.75, 1, 1.5, 2

  const selectedNgo = useMemo(
    () => ngos.find((n) => n.id === selectedNgoId) || null,
    [ngos, selectedNgoId]
  );

  // Compute relative (x, y) coordinates for NGOs
  const markers = useMemo(() => {
    return ngos.map((ngo) => {
      const deltaLon = (ngo.longitude - userLocation.longitude) * 111.32 * Math.cos((userLocation.latitude * Math.PI) / 180);
      const deltaLat = (ngo.latitude - userLocation.latitude) * 110.574;

      // Scale to SVG canvas space (1 km ≈ 14px * zoomLevel)
      const pxPerKm = 14 * zoomLevel;
      const x = MAP_CENTER.x + deltaLon * pxPerKm;
      const y = MAP_CENTER.y - deltaLat * pxPerKm; // SVG Y is inverted

      return {
        ngo,
        x: Math.max(40, Math.min(760, x)),
        y: Math.max(40, Math.min(480, y)),
        distanceKm: ngo.distanceKm ?? 0,
      };
    });
  }, [ngos, userLocation, zoomLevel]);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(2.5, z + 0.35));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.6, z - 0.35));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        position: 'relative',
        marginBottom: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      {/* Top Map Header & Controls */}
      <div
        style={{
          padding: '0.85rem 1.25rem',
          backgroundColor: 'var(--bg-subtle)',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            🗺️ Interactive Community Proximity Map
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              backgroundColor: 'var(--bg-tint-amber)',
              color: 'var(--brand-accent)',
              padding: '0.15rem 0.5rem',
              borderRadius: '9999px',
              fontWeight: '600',
            }}
          >
            Prototype Coordinate View
          </span>
        </div>

        {/* Zoom & Reset Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            type="button"
            onClick={handleZoomIn}
            aria-label="Zoom in on map"
            className="btn-civic btn-civic-secondary"
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', minWidth: '32px' }}
          >
            +
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            aria-label="Zoom out on map"
            className="btn-civic btn-civic-secondary"
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', minWidth: '32px' }}
          >
            −
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            aria-label="Reset map zoom"
            className="btn-civic btn-civic-secondary"
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div style={{ position: 'relative', width: '100%', height: '520px', backgroundColor: '#f0f5f2' }}>
        <svg
          viewBox="0 0 800 520"
          style={{ width: '100%', height: '100%', display: 'block' }}
          aria-label="Interactive map showing nearby NGOs and distance rings from your location"
          role="img"
        >
          {/* Subtle Grid Lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2ece6" strokeWidth="0.8" />
            </pattern>
            <linearGradient id="userPulse" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1b659c" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1b659c" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <rect width="800" height="520" fill="url(#grid)" />

          {/* Proximity Distance Rings from User Center */}
          <circle
            cx={MAP_CENTER.x}
            cy={MAP_CENTER.y}
            r={5 * 14 * zoomLevel}
            fill="none"
            stroke="#cbd8d1"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          <text
            x={MAP_CENTER.x + 5 * 14 * zoomLevel + 4}
            y={MAP_CENTER.y - 6}
            fill="#5e736a"
            fontSize="10"
            fontFamily="sans-serif"
          >
            5 km
          </text>

          <circle
            cx={MAP_CENTER.x}
            cy={MAP_CENTER.y}
            r={10 * 14 * zoomLevel}
            fill="none"
            stroke="#cbd8d1"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          <text
            x={MAP_CENTER.x + 10 * 14 * zoomLevel + 4}
            y={MAP_CENTER.y - 6}
            fill="#5e736a"
            fontSize="10"
            fontFamily="sans-serif"
          >
            10 km
          </text>

          <circle
            cx={MAP_CENTER.x}
            cy={MAP_CENTER.y}
            r={25 * 14 * zoomLevel}
            fill="none"
            stroke="#cbd8d1"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          <text
            x={MAP_CENTER.x + 25 * 14 * zoomLevel + 4}
            y={MAP_CENTER.y - 6}
            fill="#5e736a"
            fontSize="10"
            fontFamily="sans-serif"
          >
            25 km
          </text>

          {/* User Location Marker (Center) */}
          <circle cx={MAP_CENTER.x} cy={MAP_CENTER.y} r="28" fill="url(#userPulse)" />
          <circle cx={MAP_CENTER.x} cy={MAP_CENTER.y} r="8" fill="#1b659c" stroke="#ffffff" strokeWidth="2.5" />
          <text
            x={MAP_CENTER.x}
            y={MAP_CENTER.y + 22}
            textAnchor="middle"
            fill="#121e1a"
            fontSize="11"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            📍 You Are Here
          </text>

          {/* NGO Location Pins */}
          {markers.map(({ ngo, x, y, distanceKm }) => {
            const isSelected = ngo.id === selectedNgoId;
            return (
              <g
                key={ngo.id}
                onClick={() => setSelectedNgoId(isSelected ? null : ngo.id)}
                style={{ cursor: 'pointer' }}
                tabIndex={0}
                role="button"
                aria-label={`NGO: ${ngo.name}, ${formatDistance(distanceKm)} away`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedNgoId(isSelected ? null : ngo.id);
                  }
                }}
              >
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r="22"
                    fill="rgba(15, 111, 77, 0.2)"
                    stroke="var(--brand-primary)"
                    strokeWidth="1.5"
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? '12' : '10'}
                  fill={isSelected ? '#0c573c' : '#0f6f4d'}
                  stroke="#ffffff"
                  strokeWidth="2"
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
                />
                <text
                  x={x}
                  y={y + 3.5}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="9"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                  pointerEvents="none"
                >
                  🏢
                </text>
                <text
                  x={x}
                  y={y - 14}
                  textAnchor="middle"
                  fill="#121e1a"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="sans-serif"
                  style={{
                    paintOrder: 'stroke',
                    stroke: '#ffffff',
                    strokeWidth: 3,
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                  }}
                >
                  {ngo.name.length > 20 ? `${ngo.name.substring(0, 18)}...` : ngo.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Marker Popup Card */}
        {selectedNgo && (
          <div
            style={{
              position: 'absolute',
              bottom: '1rem',
              left: '1rem',
              right: '1rem',
              maxWidth: '420px',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
              border: '1px solid var(--border-medium)',
              zIndex: 10,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    color: 'var(--brand-primary)',
                    backgroundColor: 'var(--bg-tint-emerald)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px',
                    marginRight: '0.4rem',
                  }}
                >
                  {selectedNgo.primaryCauses[0]}
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--brand-accent)' }}>
                  📍 {formatDistance(selectedNgo.distanceKm ?? 0)} away
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNgoId(null)}
                aria-label="Close preview"
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1rem',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.2rem',
                }}
              >
                ✕
              </button>
            </div>

            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              {selectedNgo.name}
            </h3>

            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: '1.4' }}>
              {selectedNgo.about.length > 110 ? `${selectedNgo.about.substring(0, 110)}...` : selectedNgo.about}
            </p>

            {/* Current Needs preview */}
            {selectedNgo.currentNeeds && selectedNgo.currentNeeds.length > 0 && (
              <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-xs)', marginBottom: '0.85rem' }}>
                <strong style={{ fontSize: '0.75rem', color: 'var(--text-primary)', display: 'block', marginBottom: '0.2rem' }}>
                  📦 Currently Needs:
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {selectedNgo.currentNeeds
                    .filter((n) => n.status === 'Accepting')
                    .slice(0, 2)
                    .map((n) => n.item)
                    .join(' • ') || 'General community support'}
                </span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => onSelectNgo(selectedNgo)}
                className="btn-civic btn-civic-primary"
                style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
              >
                View Organisation
              </button>
              <button
                type="button"
                onClick={() => onGetDirections(selectedNgo)}
                className="btn-civic btn-civic-secondary"
                style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
              >
                🧭 Directions
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Map Footer Note */}
      <div
        style={{
          padding: '0.75rem 1.25rem',
          backgroundColor: '#ffffff',
          borderTop: '1px solid var(--border-light)',
          fontSize: '0.775rem',
          color: 'var(--text-muted)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <span>
          💡 Click any organisation pin to view immediate needs and directions. Distances are calculated from <strong>{userLocation.label}</strong>.
        </span>
        <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>
          Switch to <strong>List View</strong> anytime for full tabular cards.
        </span>
      </div>
    </div>
  );
};
