import React from 'react';

export const AccessibilitySection: React.FC = () => {
  const principles = [
    {
      title: 'Low-Bandwidth Optimized',
      desc: 'Built with minimal dependencies for fast loading on 2G/3G rural networks and budget smartphones.',
    },
    {
      title: 'Accessible by Design',
      desc: 'High contrast text, keyboard navigability, and screen-reader semantics adhering to WCAG standards.',
    },
    {
      title: 'Plain, Jargon-Free Language',
      desc: 'Complex policy guidelines distilled into structured, digestible requirements and clear steps.',
    },
    {
      title: 'Multilingual Foundation',
      desc: 'Designed for localization across major regional languages so language is never a barrier to aid.',
    },
  ];

  return (
    <section className="section" aria-labelledby="accessibility-title">
      <div className="container">
        <div style={{ maxWidth: '720px', margin: '0 auto 3rem', textAlign: 'center' }}>
          <span className="badge-tag badge-emerald" style={{ marginBottom: '0.75rem' }}>
            Human-Centered Interaction
          </span>
          <h2 id="accessibility-title" className="heading-lg" style={{ marginBottom: '0.75rem' }}>
            Designed for everyone, everywhere.
          </h2>
          <p className="lead-text" style={{ margin: '0 auto' }}>
            Public welfare platforms must be usable by all citizens and field coordinators, regardless of device, connectivity, or technical expertise.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem',
          }}
          className="principles-grid"
        >
          {principles.map((item, idx) => (
            <div
              key={idx}
              style={{
                padding: '1.5rem 1.25rem',
                borderLeft: '3px solid var(--brand-primary)',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.4rem' }}>
                {item.title}
              </h3>
              <p className="body-text" style={{ fontSize: '0.875rem' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
