import React from 'react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Discover',
      description: 'Find relevant opportunities tailored to your sector, location, and operational focus.',
      color: 'var(--brand-primary)',
      bg: 'var(--bg-tint-emerald)',
    },
    {
      number: '02',
      title: 'Understand',
      description: 'Check eligibility criteria, grant guidelines, and required certifications in plain language.',
      color: 'var(--brand-blue)',
      bg: 'var(--bg-tint-blue)',
    },
    {
      number: '03',
      title: 'Apply',
      description: 'Organize required documentation, checklist items, and project proposals with structured guidance.',
      color: 'var(--brand-accent)',
      bg: 'var(--bg-tint-amber)',
    },
    {
      number: '04',
      title: 'Track',
      description: 'Follow application progress, submission milestones, and compliance status from one place.',
      color: '#059669',
      bg: 'rgba(5, 150, 105, 0.1)',
    },
  ];

  return (
    <section className="section" aria-labelledby="how-it-works-title">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
          <span className="badge-tag badge-emerald" style={{ marginBottom: '0.75rem' }}>
            Structured Workflow
          </span>
          <h2 id="how-it-works-title" className="heading-lg" style={{ marginBottom: '0.75rem' }}>
            How SahaySetu Works
          </h2>
          <p className="lead-text" style={{ margin: '0 auto' }}>
            A streamlined, human-centered pathway designed to minimize administrative friction.
          </p>
        </div>

        {/* Linear Step Progression Flow */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem',
            position: 'relative',
          }}
          className="steps-grid"
        >
          {steps.map((step, idx) => (
            <div
              key={step.number}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '1.5rem 1.25rem',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: step.color,
                    backgroundColor: step.bg,
                    padding: '0.2rem 0.55rem',
                    borderRadius: '4px',
                  }}
                >
                  STEP {step.number}
                </span>
                {idx < steps.length - 1 && (
                  <span
                    style={{
                      color: 'var(--border-medium)',
                      fontSize: '1.2rem',
                      fontWeight: '300',
                    }}
                    className="step-arrow"
                  >
                    →
                  </span>
                )}
              </div>

              <h3 className="heading-sm" style={{ marginBottom: '0.5rem' }}>
                {step.title}
              </h3>
              <p className="body-text" style={{ fontSize: '0.9rem' }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
