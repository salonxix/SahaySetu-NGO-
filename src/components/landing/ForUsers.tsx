import React from 'react';
import Link from 'next/link';

export const ForUsers: React.FC = () => {
  const citizenBenefits = [
    {
      title: 'Discover Verified NGOs',
      desc: 'Browse legitimate, registered non-profits working in your region across education, healthcare, and livelihood.',
    },
    {
      title: 'Explore Social Causes',
      desc: 'Find initiatives that resonate with your values, from rural health clinics to women’s literacy collectives.',
    },
    {
      title: 'Volunteer & Contribute',
      desc: 'Connect directly with grassroots leaders seeking skills, mentorship, and community participation.',
    },
    {
      title: 'Civic Welfare Awareness',
      desc: 'Learn about public entitlement schemes available for individuals, students, and marginalized communities.',
    },
  ];

  return (
    <section className="section" aria-labelledby="for-users-title">
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3.5rem',
            alignItems: 'center',
          }}
          className="user-section-grid"
        >
          {/* Left: 2x2 Grid of citizen benefits */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.25rem',
            }}
            className="citizen-cards-grid"
          >
            {citizenBenefits.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1.35rem 1.25rem',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
                <p className="body-text" style={{ fontSize: '0.85rem' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Right: Explanatory Content */}
          <div>
            <span className="badge-tag badge-blue" style={{ marginBottom: '0.75rem' }}>
              For Citizens & Volunteers
            </span>
            <h2 id="for-users-title" className="heading-lg" style={{ marginBottom: '1rem' }}>
              Connecting communities directly with trusted initiatives.
            </h2>
            <p className="lead-text" style={{ marginBottom: '2rem' }}>
              Civic impact thrives when citizens and grassroots workers collaborate. SahaySetu provides a transparent gateway to learn, volunteer, and access community assistance.
            </p>

            <Link
              href="/auth/user/register"
              className="btn-civic btn-civic-secondary"
            >
              Explore NGOs & Welfare →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
