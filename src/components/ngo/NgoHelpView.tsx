import React from 'react';

export const NgoHelpView: React.FC = () => {
  const faqs = [
    {
      q: 'How does SahaySetu match schemes to our NGO?',
      a: 'SahaySetu compares your verified focus sector (e.g. Rural Development, Education), operating state, and registered Darpan qualifications with statutory guidelines published by central and state ministries.',
    },
    {
      q: 'What is an NGO Darpan ID and why is it needed?',
      a: 'NGO Darpan is the unique identification number issued by NITI Aayog for non-government organizations. Most central and state ministries mandate a valid Darpan ID to process grant-in-aid applications.',
    },
    {
      q: 'How do I resolve an "Action Required" status on an application?',
      a: 'Click on the Applications tab and locate the specific item. Follow the checklist to upload the requested document or clarify the query before the stated deadline.',
    },
    {
      q: 'Can multiple coordinators access the same NGO account?',
      a: 'Currently, the portal uses your primary registered email for authentication. Multi-user role delegation will be introduced in subsequent phases.',
    },
  ];

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        padding: '1.75rem 2rem',
      }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          Coordinator Guidance & FAQs
        </h2>
        <p className="body-text" style={{ fontSize: '0.875rem' }}>
          Plain-language answers and compliance assistance for grassroots leaders.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: 'var(--bg-canvas)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
            }}
          >
            <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              {faq.q}
            </h3>
            <p className="body-text" style={{ fontSize: '0.875rem' }}>
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          backgroundColor: 'var(--bg-tint-emerald)',
          border: '1px solid #a7f3d0',
          borderRadius: 'var(--radius-sm)',
          padding: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <strong style={{ color: '#065f46', fontSize: '0.95rem', display: 'block' }}>
            Need direct coordinator assistance?
          </strong>
          <span style={{ color: '#047857', fontSize: '0.85rem' }}>
            Reach our volunteer civic team for help with Darpan or 12A/80G compliance filings.
          </span>
        </div>
        <a
          href="mailto:support@sahaysetu.org"
          className="btn-civic btn-civic-primary"
          style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
        >
          Contact Support Desk
        </a>
      </div>
    </div>
  );
};
