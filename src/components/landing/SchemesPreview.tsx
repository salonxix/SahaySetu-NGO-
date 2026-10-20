'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface SchemeItem {
  id: string;
  title: string;
  category: string;
  department: string;
  eligibility: string;
  aidType: string;
  status: string;
}

const SAMPLE_SCHEMES: Record<string, SchemeItem[]> = {
  education: [
    {
      id: 'sch-edu-01',
      title: 'National Digital Literacy Mission Aid',
      category: 'Education',
      department: 'Ministry of Electronics & IT',
      eligibility: 'Registered NGOs with functional IT training centers in Tier 2/3 districts.',
      aidType: 'Infrastructure Grant & Per-Student Subsidy',
      status: 'Active / Rolling Applications',
    },
    {
      id: 'sch-edu-02',
      title: 'Community Learning Centre Support Scheme',
      category: 'Education',
      department: 'Department of School Education & Literacy',
      eligibility: 'Non-profits conducting remedial education programs with 3+ years track record.',
      aidType: 'Operational Grant & Learning Materials',
      status: 'Cycle 2 Open',
    },
  ],
  healthcare: [
    {
      id: 'sch-hlth-01',
      title: 'Rural Primary Health Outreach Grant',
      category: 'Healthcare',
      department: 'Ministry of Health and Family Welfare',
      eligibility: 'NGOs with mobile medical units or licensed paramedic staff serving rural blocks.',
      aidType: 'Equipment Support & Medical Camp Subsidies',
      status: 'Applications Open',
    },
    {
      id: 'sch-hlth-02',
      title: 'Maternal & Infant Nutrition Initiative Support',
      category: 'Healthcare',
      department: 'National Health Mission',
      eligibility: 'Grassroots organizations operating community health tracking in aspirational districts.',
      aidType: 'Capacity Building & Field Operations Aid',
      status: 'Active',
    },
  ],
  women_children: [
    {
      id: 'sch-wom-01',
      title: 'Integrated Child Development Support Assistance',
      category: 'Women & Children',
      department: 'Ministry of Women and Child Development',
      eligibility: 'Verified societies managing supplementary nourishment or early education programs.',
      aidType: 'Programmatic Grant',
      status: 'Annual Cycle Open',
    },
    {
      id: 'sch-wom-02',
      title: 'Women Self-Help Group Enterprise Incentive',
      category: 'Women & Children',
      department: 'National Rural Livelihood Mission',
      eligibility: 'NGOs federating and training rural women SHGs for micro-enterprises.',
      aidType: 'Revolving Fund Grant & Skill Training Aid',
      status: 'Ongoing',
    },
  ],
  environment: [
    {
      id: 'sch-env-01',
      title: 'Community Afforestation & Watershed Aid',
      category: 'Environment',
      department: 'Ministry of Environment, Forest and Climate Change',
      eligibility: 'Organizations managing watershed conservation, soil restoration, or native tree plantation.',
      aidType: 'Project Capital Grant',
      status: 'Applications Open',
    },
    {
      id: 'sch-env-02',
      title: 'Decentralized Solar Pumping Assistance',
      category: 'Environment',
      department: 'Ministry of New and Renewable Energy',
      eligibility: 'Cooperatives and non-profits partnering with marginal farming clusters.',
      aidType: 'Capital Subsidy up to 60%',
      status: 'State-wise Quotas',
    },
  ],
  rural_dev: [
    {
      id: 'sch-rur-01',
      title: 'Rural Drinking Water Quality Monitoring Grant',
      category: 'Rural Development',
      department: 'Department of Drinking Water & Sanitation',
      eligibility: 'Village-level water committees and supporting NGOs conducting water testing.',
      aidType: 'Testing Kits & Community Training Fund',
      status: 'Active',
    },
    {
      id: 'sch-rur-02',
      title: 'Agro-Processing Cluster Support Program',
      category: 'Rural Development',
      department: 'Ministry of Food Processing Industries',
      eligibility: 'Farmer Producer Organizations (FPOs) and NGOs setting up post-harvest storage.',
      aidType: 'Grant-in-Aid',
      status: 'Quarterly Review',
    },
  ],
};

export const SchemesPreview: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('education');

  const categories = [
    { key: 'education', label: 'Education' },
    { key: 'healthcare', label: 'Healthcare' },
    { key: 'women_children', label: 'Women & Children' },
    { key: 'environment', label: 'Environment' },
    { key: 'rural_dev', label: 'Rural Development' },
  ];

  const currentSchemes = SAMPLE_SCHEMES[activeCategory] || [];

  return (
    <section
      id="schemes-preview"
      className="section section-subtle"
      aria-labelledby="schemes-preview-title"
    >
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 2.5rem' }}>
          <span className="badge-tag badge-emerald" style={{ marginBottom: '0.75rem' }}>
            Interactive Directory Preview
          </span>
          <h2 id="schemes-preview-title" className="heading-lg" style={{ marginBottom: '0.75rem' }}>
            Explore Welfare Schemes by Category
          </h2>
          <p className="lead-text" style={{ margin: '0 auto' }}>
            Structured, readable previews of central and state civic opportunities.
          </p>
        </div>

        {/* Category Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginBottom: '2.5rem',
          }}
          role="tablist"
          aria-label="Scheme Categories"
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat.key}
              onClick={() => setActiveCategory(cat.key)}
              style={{
                padding: '0.6rem 1.15rem',
                fontSize: '0.9rem',
                fontWeight: '600',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: activeCategory === cat.key ? 'var(--brand-primary)' : 'var(--border-medium)',
                backgroundColor: activeCategory === cat.key ? 'var(--brand-primary)' : '#ffffff',
                color: activeCategory === cat.key ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Schemes List Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
          className="schemes-grid"
        >
          {currentSchemes.map((scheme) => (
            <div
              key={scheme.id}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                  }}
                >
                  <span className="badge-tag badge-emerald" style={{ fontSize: '0.725rem' }}>
                    {scheme.category}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {scheme.status}
                  </span>
                </div>

                <h3 className="heading-sm" style={{ marginBottom: '0.5rem' }}>
                  {scheme.title}
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '1rem' }}>
                  🏛️ {scheme.department}
                </span>

                <div
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem',
                    marginBottom: '0.85rem',
                  }}
                >
                  <strong style={{ display: 'block', fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                    Eligibility Criteria
                  </strong>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    {scheme.eligibility}
                  </p>
                </div>

                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Support Offered:</strong> {scheme.aidType}
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                <Link
                  href="/auth/login"
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'var(--brand-primary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  View full guidelines & apply →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Realistic Demo Data Notice */}
        <div
          style={{
            textAlign: 'center',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            padding: '0.75rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-sm)',
            border: '1px dashed var(--border-medium)',
            maxWidth: '620px',
            margin: '0 auto',
          }}
        >
          ℹ️ <strong>Demonstration preview:</strong> Schemes and criteria shown above illustrate the structured discovery format. Sign in to browse the complete live catalog.
        </div>
      </div>
    </section>
  );
};
