'use client';

import React, { useState } from 'react';
import type { GovernmentPortalItem } from '@/types/registration-guide';

interface PortalsDirectoryProps {
  portals: GovernmentPortalItem[];
  savedPortalIds?: string[];
  onToggleSavePortal?: (portalId: string) => void;
}

export const PortalsDirectory: React.FC<PortalsDirectoryProps> = ({
  portals,
  savedPortalIds = [],
  onToggleSavePortal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['all', 'Entity Registration', 'Tax & Exemptions', 'Civic Partnership', 'Foreign Contribution', 'Welfare Schemes'];

  const filteredPortals = portals.filter((portal) => {
    const matchesCategory = selectedCategory === 'all' || portal.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      portal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      portal.authority.toLowerCase().includes(searchQuery.toLowerCase()) ||
      portal.purpose.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header & Filter */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem 1.75rem',
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
          Authoritative Government Portals
        </span>
        <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.2rem 0 0.35rem 0' }}>
          Official Government Portals Directory
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 1.25rem 0' }}>
          Only verified official `.gov.in` and `.nic.in` government portals are cataloged below. Never use commercial third-party intermediaries for statutory registrations.
        </p>

        {/* Search & Category Chips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search portals by name, authority, or purpose..."
            className="form-input"
            style={{ fontSize: '0.875rem' }}
          />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? '700' : '500',
                    border: isSelected ? '1px solid var(--brand-primary)' : '1px solid var(--border-medium)',
                    backgroundColor: isSelected ? 'var(--brand-primary)' : 'var(--bg-canvas)',
                    color: isSelected ? '#ffffff' : 'var(--text-primary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Portals Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {filteredPortals.map((portal) => {
          const isSaved = savedPortalIds.includes(portal.id);

          return (
            <div
              key={portal.id}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span
                    style={{
                      fontSize: '0.725rem',
                      fontWeight: '700',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--brand-primary)',
                    }}
                  >
                    {portal.category}
                  </span>

                  {onToggleSavePortal && (
                    <button
                      type="button"
                      onClick={() => onToggleSavePortal(portal.id)}
                      style={{
                        background: isSaved ? 'var(--bg-tint-amber)' : 'none',
                        border: '1px solid',
                        borderColor: isSaved ? '#fcd34d' : 'var(--border-medium)',
                        borderRadius: '9999px',
                        padding: '0.2rem 0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: isSaved ? '#b45309' : 'var(--text-muted)',
                        cursor: 'pointer',
                      }}
                    >
                      {isSaved ? '★ Saved' : '☆ Save Portal'}
                    </button>
                  )}
                </div>

                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                  {portal.name}
                </h4>

                <div style={{ fontSize: '0.8rem', color: 'var(--brand-primary)', fontWeight: '600', marginBottom: '0.75rem' }}>
                  🏛️ {portal.authority}
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '1rem' }}>
                  {portal.purpose}
                </p>

                <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-light)', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  <strong>Who Needs It:</strong> {portal.whoNeedsIt}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Verified: {portal.lastChecked}
                </span>

                <a
                  href={portal.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-civic btn-civic-primary"
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <span>Go to Official Portal</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
