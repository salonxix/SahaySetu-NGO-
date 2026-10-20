import React from 'react';
import Link from 'next/link';

export const Hero: React.FC = () => {
  return (
    <section
      style={{
        padding: '5.5rem 0 4.5rem',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-light)',
      }}
      aria-labelledby="hero-title"
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.15fr 0.85fr',
            gap: '3.5rem',
            alignItems: 'center',
          }}
          className="hero-grid"
        >
          {/* Left Column: Core Civic Purpose & CTAs */}
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <span className="badge-tag badge-emerald">
                Civic Welfare & NGO Enablement
              </span>
            </div>

            <h1
              id="hero-title"
              className="heading-xl"
              style={{ marginBottom: '1.25rem' }}
            >
              Connecting NGOs to the support they need.
            </h1>

            <p
              className="lead-text"
              style={{ marginBottom: '2.25rem' }}
            >
              SahaySetu helps NGOs discover relevant government schemes, understand eligibility, manage applications and find opportunities for collaboration.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <Link
                href="#schemes-preview"
                className="btn-civic btn-civic-primary"
              >
                Explore Schemes →
              </Link>
              <Link
                href="/auth/ngo/register"
                className="btn-civic btn-civic-secondary"
              >
                Register Your NGO
              </Link>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                marginTop: '2.5rem',
                paddingTop: '1.75rem',
                borderTop: '1px solid var(--border-light)',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: 'var(--brand-primary)' }}>✓</span> Plain-language criteria
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: 'var(--brand-primary)' }}>✓</span> Centralized document checklists
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: 'var(--brand-primary)' }}>✓</span> Verified NGO matching
              </div>
            </div>
          </div>

          {/* Right Column: Purposeful Structured Preview Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '1rem',
                marginBottom: '1rem',
                borderBottom: '1px solid var(--border-light)',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Scheme Match Preview
                </span>
                <h2 style={{ fontSize: '1.05rem', fontWeight: '600', marginTop: '0.2rem' }}>
                  Rural Skill Development Grant
                </h2>
              </div>
              <span className="badge-tag badge-emerald" style={{ fontSize: '0.7rem' }}>
                Open for Applications
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  padding: '0.75rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                }}
              >
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>
                  Sponsoring Department
                </span>
                <span style={{ fontWeight: '500' }}>Ministry of Rural Development</span>
              </div>

              <div
                style={{
                  backgroundColor: '#ffffff',
                  padding: '0.75rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                }}
              >
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>
                  Eligibility Check
                </span>
                <span style={{ color: 'var(--brand-primary)', fontWeight: '500' }}>
                  ✓ Registered NGOs with 2+ years grassroots operations
                </span>
              </div>

              <div
                style={{
                  backgroundColor: '#ffffff',
                  padding: '0.75rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                }}
              >
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>
                  Key Documents Required
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  NGO Darpan ID, 12A/80G, Annual Audit Report
                </span>
              </div>
            </div>

            <div
              style={{
                marginTop: '1.25rem',
                textAlign: 'center',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
              }}
            >
              Demo preview • Real-time scheme discovery on SahaySetu
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
