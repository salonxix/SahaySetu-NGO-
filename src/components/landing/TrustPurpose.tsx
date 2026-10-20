import React from 'react';

export const TrustPurpose: React.FC = () => {
  return (
    <section
      id="purpose"
      className="section section-subtle"
      aria-labelledby="purpose-title"
    >
      <div className="container">
        <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge-tag badge-amber" style={{ marginBottom: '0.75rem' }}>
            The Civic Challenge
          </span>
          <h2 id="purpose-title" className="heading-lg" style={{ marginBottom: '1rem' }}>
            Finding support shouldn&apos;t be another challenge.
          </h2>
          <p className="lead-text" style={{ margin: '0 auto' }}>
            Across India, dedicated grassroots organizations and citizens work tirelessly to serve their communities. Yet discovering eligible welfare schemes, interpreting bureaucratic requirements, and tracking critical deadlines often becomes an overwhelming barrier.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.75rem',
          }}
          className="purpose-grid"
        >
          <div className="civic-card">
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-tint-amber)',
                color: 'var(--brand-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                marginBottom: '1rem',
              }}
            >
              🔍
            </div>
            <h3 className="heading-sm" style={{ marginBottom: '0.5rem' }}>
              Information Fragmentation
            </h3>
            <p className="body-text">
              Welfare schemes and support initiatives are spread across dozens of state and central portals, making discovery fragmented and time-consuming.
            </p>
          </div>

          <div className="civic-card">
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-tint-emerald)',
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                marginBottom: '1rem',
              }}
            >
              📋
            </div>
            <h3 className="heading-sm" style={{ marginBottom: '0.5rem' }}>
              Complex Eligibility Rules
            </h3>
            <p className="body-text">
              Lengthy guidelines and confusing bureaucratic jargon leave grassroots teams unsure whether their NGO or beneficiaries qualify.
            </p>
          </div>

          <div className="civic-card">
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-tint-blue)',
                color: 'var(--brand-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                marginBottom: '1rem',
              }}
            >
              ⏳
            </div>
            <h3 className="heading-sm" style={{ marginBottom: '0.5rem' }}>
              Application & Tracking Hurdles
            </h3>
            <p className="body-text">
              Managing disparate document requirements, compliance checklists, and application milestones without a unified hub causes missed deadlines.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
