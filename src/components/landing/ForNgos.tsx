import React from 'react';
import Link from 'next/link';

export const ForNgos: React.FC = () => {
  const features = [
    {
      title: 'Verified NGO Profile',
      desc: 'Establish your organization’s identity with Darpan ID and sector credentials.',
    },
    {
      title: 'Targeted Scheme Discovery',
      desc: 'Receive curated notifications of central and state grants matching your focus areas.',
    },
    {
      title: 'Transparent Eligibility Checks',
      desc: 'Evaluate requirements, past operational criteria, and financial qualifications upfront.',
    },
    {
      title: 'Centralized Document Vault',
      desc: 'Keep compliance certificates (12A, 80G, audit reports, CSR-1) ready for rapid submissions.',
    },
    {
      title: 'Unified Application Tracking',
      desc: 'Monitor submission deadlines, verification stages, and renewal milestones seamlessly.',
    },
  ];

  return (
    <section
      id="for-ngos"
      className="section section-subtle"
      aria-labelledby="for-ngos-title"
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3.5rem',
            alignItems: 'center',
          }}
          className="ngo-section-grid"
        >
          {/* Left: Explanatory Content */}
          <div>
            <span className="badge-tag badge-emerald" style={{ marginBottom: '0.75rem' }}>
              Built for Grassroots Organizations
            </span>
            <h2 id="for-ngos-title" className="heading-lg" style={{ marginBottom: '1rem' }}>
              Empowering NGOs with clarity and efficiency.
            </h2>
            <p className="lead-text" style={{ marginBottom: '2rem' }}>
              Whether you are an established non-profit or a community-level society, SahaySetu reduces administrative overhead so you can focus on grassroots impact.
            </p>

            <Link
              href="/auth/ngo/register"
              className="btn-civic btn-civic-primary"
            >
              Create your NGO profile →
            </Link>
          </div>

          {/* Right: Clean Feature Checklist */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {features.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1.15rem 1.25rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <div
                  style={{
                    color: 'var(--brand-primary)',
                    fontWeight: '700',
                    fontSize: '1.1rem',
                    lineHeight: '1.3',
                  }}
                >
                  ✓
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.2rem' }}>
                    {item.title}
                  </h3>
                  <p className="body-text" style={{ fontSize: '0.875rem' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
