'use client';

import React from 'react';

export interface FilterState {
  sector: string;
  state: string;
  beneficiary: string;
  status: string;
  recommendedOnly: boolean;
}

interface SchemeFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string | boolean) => void;
  onClearFilters: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  totalResultsCount: number;
}

const SECTOR_OPTIONS = [
  'All Sectors',
  'Education',
  'Healthcare',
  'Women Empowerment',
  'Rural Development',
  'Skill Development',
  'Environment',
  'Disability Support',
  'Child Welfare',
];

const STATE_OPTIONS = [
  'All States & UTs',
  'Delhi',
  'Uttar Pradesh',
  'Maharashtra',
  'Karnataka',
  'Bihar',
  'Rajasthan',
  'Gujarat',
  'Tamil Nadu',
];

const BENEFICIARY_OPTIONS = [
  'All Beneficiaries',
  'Students',
  'Rural Women',
  'Youth',
  'Farming Communities',
  'Persons with Disabilities',
  'Children',
];

const STATUS_OPTIONS = [
  'All Statuses',
  'Open',
  'Rolling',
  'Review Stage',
  'Upcoming Cycle',
];

export const SchemeFilters: React.FC<SchemeFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  isOpenMobile,
  onCloseMobile,
  totalResultsCount,
}) => {
  const activeCount =
    (filters.sector ? 1 : 0) +
    (filters.state ? 1 : 0) +
    (filters.beneficiary ? 1 : 0) +
    (filters.status ? 1 : 0) +
    (filters.recommendedOnly ? 1 : 0);

  const filterContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
          Filter Schemes
        </h3>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClearFilters}
            style={{
              background: 'none',
              border: 'none',
              color: '#b91c1c',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            Clear all ({activeCount})
          </button>
        )}
      </div>

      {/* Recommended Toggle */}
      <div
        style={{
          backgroundColor: 'var(--bg-tint-emerald)',
          padding: '0.75rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid #a7f3d0',
        }}
      >
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', color: '#065f46' }}>
          <input
            type="checkbox"
            checked={filters.recommendedOnly}
            onChange={(e) => onFilterChange('recommendedOnly', e.target.checked)}
            style={{ accentColor: 'var(--brand-primary)', width: '16px', height: '16px' }}
          />
          <span>★ Recommended for your NGO</span>
        </label>
      </div>

      {/* Sector Filter */}
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label htmlFor="filter-sector" className="form-label" style={{ color: 'var(--text-primary)', fontSize: '0.825rem' }}>
          Primary Sector
        </label>
        <select
          id="filter-sector"
          value={filters.sector}
          onChange={(e) => onFilterChange('sector', e.target.value)}
          className="form-select"
          style={{ backgroundColor: '#ffffff', fontSize: '0.875rem' }}
        >
          {SECTOR_OPTIONS.map((sec) => (
            <option key={sec} value={sec === 'All Sectors' ? '' : sec}>
              {sec}
            </option>
          ))}
        </select>
      </div>

      {/* State Filter */}
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label htmlFor="filter-state" className="form-label" style={{ color: 'var(--text-primary)', fontSize: '0.825rem' }}>
          Applicable State
        </label>
        <select
          id="filter-state"
          value={filters.state}
          onChange={(e) => onFilterChange('state', e.target.value)}
          className="form-select"
          style={{ backgroundColor: '#ffffff', fontSize: '0.875rem' }}
        >
          {STATE_OPTIONS.map((st) => (
            <option key={st} value={st === 'All States & UTs' ? '' : st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Beneficiary Filter */}
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label htmlFor="filter-beneficiary" className="form-label" style={{ color: 'var(--text-primary)', fontSize: '0.825rem' }}>
          Target Beneficiaries
        </label>
        <select
          id="filter-beneficiary"
          value={filters.beneficiary}
          onChange={(e) => onFilterChange('beneficiary', e.target.value)}
          className="form-select"
          style={{ backgroundColor: '#ffffff', fontSize: '0.875rem' }}
        >
          {BENEFICIARY_OPTIONS.map((ben) => (
            <option key={ben} value={ben === 'All Beneficiaries' ? '' : ben}>
              {ben}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label htmlFor="filter-status" className="form-label" style={{ color: 'var(--text-primary)', fontSize: '0.825rem' }}>
          Application Status
        </label>
        <select
          id="filter-status"
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="form-select"
          style={{ backgroundColor: '#ffffff', fontSize: '0.875rem' }}
        >
          {STATUS_OPTIONS.map((st) => (
            <option key={st} value={st === 'All Statuses' ? '' : st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      <div style={{ paddingTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        Showing {totalResultsCount} matching schemes
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filter Sidebar */}
      <div
        className="desktop-filter-sidebar"
        style={{
          width: '260px',
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-sm)',
          padding: '1.25rem',
          height: 'fit-content',
        }}
      >
        {filterContent}
      </div>

      {/* Mobile Filter Drawer */}
      {isOpenMobile && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            display: 'flex',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Filter schemes mobile drawer"
        >
          <div
            style={{
              width: '85%',
              maxWidth: '340px',
              backgroundColor: '#ffffff',
              height: '100%',
              padding: '1.5rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Filters</h3>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>
              {filterContent}
            </div>

            <button
              type="button"
              onClick={onCloseMobile}
              className="btn-civic btn-civic-primary"
              style={{ marginTop: '1.5rem' }}
            >
              Apply Filters ({totalResultsCount} Results)
            </button>
          </div>
        </div>
      )}
    </>
  );
};
