'use client';

import React, { useState, useMemo } from 'react';
import type { Scheme } from '@/types/ngo';
import type { NgoUser } from '@/types/auth';
import { SCHEMES_CATALOG } from '@/lib/ngo/mock-schemes';
import { evaluateSchemeEligibility } from '@/lib/ngo/eligibility-matcher';
import { SchemeCard } from './SchemeCard';
import { SchemeFilters, FilterState } from './SchemeFilters';
import { SchemeDetailModal } from './SchemeDetailModal';

interface SchemeDiscoveryViewProps {
  ngoUser: NgoUser | null;
  savedSchemeIds: Set<string>;
  onToggleSave: (schemeId: string) => void;
  onStartApplication?: (scheme: Scheme) => void;
}

const INITIAL_FILTERS: FilterState = {
  sector: '',
  state: '',
  beneficiary: '',
  status: '',
  recommendedOnly: false,
};

export const SchemeDiscoveryView: React.FC<SchemeDiscoveryViewProps> = ({
  ngoUser,
  savedSchemeIds,
  onToggleSave,
  onStartApplication,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  const handleFilterChange = (key: keyof FilterState, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters(INITIAL_FILTERS);
  };

  // Pre-calculate evaluations and filter results deterministically
  const evaluatedSchemes = useMemo(() => {
    return SCHEMES_CATALOG.map((scheme) => ({
      scheme,
      evaluation: evaluateSchemeEligibility(ngoUser, scheme),
    }));
  }, [ngoUser]);

  const filteredSchemes = useMemo(() => {
    return evaluatedSchemes.filter(({ scheme, evaluation }) => {
      // 1. Search Query
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = scheme.name.toLowerCase().includes(query);
        const matchesSector = scheme.sector.toLowerCase().includes(query);
        const matchesDesc = scheme.shortDescription.toLowerCase().includes(query);
        const matchesTags = scheme.tags.some((t) => t.toLowerCase().includes(query));
        const matchesDept = scheme.department.toLowerCase().includes(query);

        if (!matchesName && !matchesSector && !matchesDesc && !matchesTags && !matchesDept) {
          return false;
        }
      }

      // 2. Sector Filter
      if (filters.sector && scheme.sector.toLowerCase() !== filters.sector.toLowerCase()) {
        return false;
      }

      // 3. State Filter
      if (filters.state) {
        const hasAllIndia = scheme.applicableStates.some((s) => s.toLowerCase() === 'all india');
        const hasState = scheme.applicableStates.some((s) => s.toLowerCase() === filters.state.toLowerCase());
        if (!hasAllIndia && !hasState) return false;
      }

      // 4. Beneficiary Filter
      if (filters.beneficiary) {
        const hasBen = scheme.targetBeneficiaries.some((b) =>
          b.toLowerCase().includes(filters.beneficiary.toLowerCase())
        );
        if (!hasBen) return false;
      }

      // 5. Status Filter
      if (filters.status && scheme.status !== filters.status) {
        return false;
      }

      // 6. Recommended Only
      if (filters.recommendedOnly && !evaluation.isRecommended) {
        return false;
      }

      return true;
    });
  }, [evaluatedSchemes, searchQuery, filters]);

  const activeFilterCount =
    (filters.sector ? 1 : 0) +
    (filters.state ? 1 : 0) +
    (filters.beneficiary ? 1 : 0) +
    (filters.status ? 1 : 0) +
    (filters.recommendedOnly ? 1 : 0);

  const selectedEvaluation = selectedScheme
    ? evaluateSchemeEligibility(ngoUser, selectedScheme)
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header & Supporting Explanation */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Find Government Schemes & Welfare Grants
          </h2>
          <span
            style={{
              fontSize: '0.725rem',
              backgroundColor: 'var(--bg-tint-emerald)',
              color: 'var(--brand-primary)',
              padding: '0.15rem 0.5rem',
              borderRadius: '9999px',
              fontWeight: '600',
            }}
          >
            Deterministic Matching
          </span>
        </div>
        <p className="body-text" style={{ fontSize: '0.9rem' }}>
          Discover central and state government schemes. Matching criteria is calculated transparently based on your verified NGO focus sector and location.
        </p>
      </div>

      {/* Search Bar + Mobile Filter Trigger */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search schemes by name, sector or keyword (e.g. Education, Health, Water)"
            className="form-input"
            style={{
              backgroundColor: '#ffffff',
              paddingLeft: '2.5rem',
              paddingRight: searchQuery ? '2.5rem' : '1rem',
              fontSize: '0.95rem',
              height: '46px',
            }}
            aria-label="Search schemes"
          />
          <span
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              fontSize: '1rem',
            }}
            aria-hidden="true"
          >
            🔍
          </span>

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: '4px',
              }}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Mobile Filter Button */}
        <button
          type="button"
          onClick={() => setMobileFilterOpen(true)}
          className="mobile-filter-trigger"
          style={{
            display: 'none',
            height: '46px',
            padding: '0 1rem',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          ⚙️ Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
        </button>
      </div>

      {/* Main Discovery Body: Sidebar Filters + Schemes Grid */}
      <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'flex-start' }}>
        <SchemeFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          isOpenMobile={mobileFilterOpen}
          onCloseMobile={() => setMobileFilterOpen(false)}
          totalResultsCount={filteredSchemes.length}
        />

        {/* Results Area */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Active Filter Badges */}
          {(activeFilterCount > 0 || searchQuery) && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginBottom: '1rem',
                padding: '0.5rem 0.75rem',
                backgroundColor: 'var(--bg-canvas)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
              }}
            >
              <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Active Filters:</span>

              {searchQuery && (
                <span className="badge-tag badge-emerald" style={{ fontSize: '0.725rem' }}>
                  Keyword: &quot;{searchQuery}&quot;
                </span>
              )}
              {filters.sector && (
                <span className="badge-tag badge-emerald" style={{ fontSize: '0.725rem' }}>
                  Sector: {filters.sector}
                </span>
              )}
              {filters.state && (
                <span className="badge-tag badge-blue" style={{ fontSize: '0.725rem' }}>
                  State: {filters.state}
                </span>
              )}
              {filters.beneficiary && (
                <span className="badge-tag badge-amber" style={{ fontSize: '0.725rem' }}>
                  Beneficiary: {filters.beneficiary}
                </span>
              )}
              {filters.status && (
                <span className="badge-tag badge-emerald" style={{ fontSize: '0.725rem' }}>
                  Status: {filters.status}
                </span>
              )}
              {filters.recommendedOnly && (
                <span className="badge-tag badge-amber" style={{ fontSize: '0.725rem' }}>
                  ★ High Match Only
                </span>
              )}

              <button
                type="button"
                onClick={handleClearFilters}
                style={{
                  marginLeft: 'auto',
                  background: 'none',
                  border: 'none',
                  color: '#b91c1c',
                  fontWeight: '600',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Empty Search State */}
          {filteredSchemes.length === 0 ? (
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                padding: '3.5rem 2rem',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.35rem',
                  margin: '0 auto 1rem',
                }}
              >
                🔍
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                No schemes found
              </h3>
              <p className="body-text" style={{ maxWidth: '40ch', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
                Try changing your search keywords or removing one or more active filters to view available welfare grants.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="btn-civic btn-civic-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredSchemes.map(({ scheme, evaluation }) => (
                <SchemeCard
                  key={scheme.id}
                  scheme={scheme}
                  matchEvaluation={evaluation}
                  isSaved={savedSchemeIds.has(scheme.id)}
                  onToggleSave={onToggleSave}
                  onViewDetails={(s) => setSelectedScheme(s)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scheme Detail Modal */}
      <SchemeDetailModal
        scheme={selectedScheme}
        matchEvaluation={selectedEvaluation}
        isSaved={selectedScheme ? savedSchemeIds.has(selectedScheme.id) : false}
        onToggleSave={onToggleSave}
        onClose={() => setSelectedScheme(null)}
        onStartApplication={onStartApplication}
      />
    </div>
  );
};
