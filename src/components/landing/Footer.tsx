import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border-light)',
        padding: '4rem 0 2.5rem',
        fontSize: '0.9rem',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '3rem',
            marginBottom: '3rem',
          }}
          className="footer-grid"
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '5px',
                  backgroundColor: 'var(--brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                }}
              >
                एस
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                SahaySetu
              </span>
            </div>
            <p className="body-text" style={{ maxWidth: '35ch', fontSize: '0.875rem' }}>
              A human-centered civic platform connecting grassroots NGOs and citizens to government welfare schemes and opportunities.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <strong style={{ display: 'block', marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
              Platform
            </strong>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li>
                <Link href="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
              </li>
              <li>
                <Link href="#schemes-preview" style={{ color: 'var(--text-secondary)' }}>Explore Schemes</Link>
              </li>
              <li>
                <Link href="#for-ngos" style={{ color: 'var(--text-secondary)' }}>For NGOs</Link>
              </li>
              <li>
                <Link href="#purpose" style={{ color: 'var(--text-secondary)' }}>About Purpose</Link>
              </li>
            </ul>
          </div>

          {/* Access & Portals */}
          <div>
            <strong style={{ display: 'block', marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
              Access Portals
            </strong>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li>
                <Link href="/auth/ngo/login" style={{ color: 'var(--text-secondary)' }}>NGO Login</Link>
              </li>
              <li>
                <Link href="/auth/ngo/register" style={{ color: 'var(--text-secondary)' }}>Register NGO</Link>
              </li>
              <li>
                <Link href="/auth/user/login" style={{ color: 'var(--text-secondary)' }}>Citizen Login</Link>
              </li>
              <li>
                <Link href="/auth/user/register" style={{ color: 'var(--text-secondary)' }}>Citizen Registration</Link>
              </li>
            </ul>
          </div>

          {/* Standards & Contact */}
          <div>
            <strong style={{ display: 'block', marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
              Civic Standards
            </strong>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li>
                <Link href="#accessibility" style={{ color: 'var(--text-secondary)' }}>Accessibility</Link>
              </li>
              <li>
                <Link href="#privacy" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</Link>
              </li>
              <li>
                <Link href="#help" style={{ color: 'var(--text-secondary)' }}>Help & Support</Link>
              </li>
              <li>
                <Link href="#contact" style={{ color: 'var(--text-secondary)' }}>Contact Coordinators</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.825rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            © {new Date().getFullYear()} SahaySetu. Human-Centered Interaction for Civic Welfare.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Non-partisan Civic Resource</span>
            <span>WCAG 2.1 AA Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
