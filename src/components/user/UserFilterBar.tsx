'use client';

import React from 'react';
import type {
  NgoCauseCategory,
  DistanceFilterOption,
  ViewMode,
} from '@/types/user-portal';

interface UserFilterBarProps {
  distance: number | 'all';
  onDistanceChange: (distance: number | 'all') => void;
  cause: NgoCauseCategory | 'all';
  onCauseChange: (cause: NgoCauseCategory | 'all') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalResults: number;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const DISTANCE_OPTIONS: DistanceFilterOption[] = [
  { label: 'Within 1 km', value: 1 },
  { label: 'Within 5 km', value: 5 },
  { label: 'Within 10 km', value: 10 },
  { label: 'Within 25 km', value: 25 },
  { label: 'All Distances', value: 'all' },
];

export const CAUSE_OPTIONS: (NgoCauseCategory | 'all')[] = [
  'all',
  'Education',
  'Healthcare',
  'Children',
  'Women & Girls',
  'Elderly',
  'Disability Support',
  'Environment',
  'Animal Welfare',
  'Rural Development',
  'Disaster Relief',
];

export const UserFilterBar: React.FC<UserFilterBarProps> = ({
  distance,
  onDistanceChange,
  cause,
  onCauseChange,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  totalResults,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.2fr 1.2fr auto',
          gap: '1rem',
          alignItems: 'flex-end',
        }}
        className="filter-bar-grid"
      >
        {/* Search Input */}
        <div>
          <label htmlFor="user-ngo-search" className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
            Search Organisations & Needs
          </label>
          <div style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                pointerEvents: 'none',
              }}
            >
              🔍
            </span>
            <input
              id="user-ngo-search"
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, cause, needs..."
              className="form-input"
              style={{
                paddingLeft: '2.25rem',
                paddingRight: searchQuery ? '2rem' : '0.75rem',
                fontSize: '0.875rem',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search input"
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  fontSize: '0.85rem',
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Distance Filter */}
        <div>
          <label htmlFor="user-distance-select" className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
            Distance Radius
          </label>
          <select
            id="user-distance-select"
            value={distance}
            onChange={(e) => {
              const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
              onDistanceChange(val);
            }}
            className="form-input"
            style={{ fontSize: '0.875rem', backgroundColor: '#ffffff' }}
          >
            {DISTANCE_OPTIONS.map((opt) => (
              <option key={String(opt.value)} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Cause Filter */}
        <div>
          <label htmlFor="user-cause-select" className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
            Primary Cause
          </label>
          <select
            id="user-cause-select"
            value={cause}
            onChange={(e) => onCauseChange(e.target.value as NgoCauseCategory | 'all')}
            className="form-input"
            style={{ fontSize: '0.875rem', backgroundColor: '#ffffff' }}
          >
            <option value="all">All Causes & Sectors</option>
            {CAUSE_OPTIONS.filter((c) => c !== 'all').map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Switcher (List vs Map) */}
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem', fontWeight: '500' }}>
            Display View
          </span>
          <div
            role="group"
            aria-label="Switch between map and list view"
            style={{
              display: 'inline-flex',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-medium)',
              overflow: 'hidden',
              backgroundColor: 'var(--bg-subtle)',
            }}
          >
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              aria-pressed={viewMode === 'list'}
              style={{
                padding: '0.5rem 0.85rem',
                fontSize: '0.85rem',
                fontWeight: viewMode === 'list' ? '600' : '500',
                border: 'none',
                backgroundColor: viewMode === 'list' ? 'var(--brand-primary)' : 'transparent',
                color: viewMode === 'list' ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.15s ease',
              }}
            >
              <span>📋</span> List View
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('map')}
              aria-pressed={viewMode === 'map'}
              style={{
                padding: '0.5rem 0.85rem',
                fontSize: '0.85rem',
                fontWeight: viewMode === 'map' ? '600' : '500',
                border: 'none',
                backgroundColor: viewMode === 'map' ? 'var(--brand-primary)' : 'transparent',
                color: viewMode === 'map' ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.15s ease',
              }}
            >
              <span>🗺️</span> Map View
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Bar & Results Count */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginTop: '1rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-light)',
          fontSize: '0.825rem',
        }}
      >
        <div>
          <strong style={{ color: 'var(--text-primary)' }}>
            {totalResults} {totalResults === 1 ? 'organisation' : 'organisations'} found
          </strong>
          {distance !== 'all' && (
            <span style={{ color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
              within {distance} km
            </span>
          )}
          {cause !== 'all' && (
            <span style={{ color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
              focusing on <em>{cause}</em>
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--brand-primary)',
              cursor: 'pointer',
              fontWeight: '600',
              textDecoration: 'underline',
              fontSize: '0.825rem',
            }}
          >
            Reset all filters
          </button>
        )}
      </div>
    </div>
  );
};
