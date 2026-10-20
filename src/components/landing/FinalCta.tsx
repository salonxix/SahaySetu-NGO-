import React from 'react';
import Link from 'next/link';

export const FinalCta: React.FC = () => {
  return (
    <section
      className="section section-dark"
      style={{
        padding: '5rem 0',
        textAlign: 'center',
      }}
      aria-labelledby="final-cta-title"
    >
      <div className="container" style={{ maxWidth: '680px' }}>
        <h2
          id="final-cta-title"
          className="heading-lg"
          style={{ color: 'var(--text-inverse)', marginBottom: '1rem' }}
        >
          Find the right opportunity. Take the next step.
        </h2>
        <p
          style={{
            color: 'var(--text-inverse-muted)',
            fontSize: '1.1rem',
            marginBottom: '2.25rem',
          }}
        >
          Join verified grassroots organizations across India in discovering, tracking, and securing government scheme support.
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="#schemes-preview"
            className="btn-civic btn-civic-dark"
          >
            Explore Schemes →
          </Link>
          <Link
            href="/auth/ngo/register"
            className="btn-civic btn-civic-dark-outline"
          >
            Register NGO
          </Link>
        </div>
      </div>
    </section>
  );
};
