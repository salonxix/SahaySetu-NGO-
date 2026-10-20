'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-light)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px',
        }}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
          }}
          aria-label="SahaySetu Home"
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '1rem',
            }}
          >
            एस
          </div>
          <span
            style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
            }}
          >
            SahaySetu
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.75rem',
          }}
          className="desktop-nav"
          aria-label="Main Navigation"
        >
          <Link
            href="/"
            style={{
              fontSize: '0.9rem',
              fontWeight: '500',
              color: 'var(--text-primary)',
            }}
          >
            Home
          </Link>
          <Link
            href="/user/dashboard"
            style={{
              fontSize: '0.9rem',
              fontWeight: '600',
              color: 'var(--brand-primary)',
            }}
          >
            📍 Find Nearby NGOs
          </Link>
          <Link
            href="#schemes-preview"
            style={{
              fontSize: '0.9rem',
              fontWeight: '500',
              color: 'var(--text-secondary)',
            }}
          >
            Explore Schemes
          </Link>
          <Link
            href="#for-ngos"
            style={{
              fontSize: '0.9rem',
              fontWeight: '500',
              color: 'var(--text-secondary)',
            }}
          >
            For NGOs
          </Link>
          <Link
            href="#purpose"
            style={{
              fontSize: '0.9rem',
              fontWeight: '500',
              color: 'var(--text-secondary)',
            }}
          >
            About
          </Link>
        </nav>

        {/* Right side CTA actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
          className="desktop-actions"
        >
          <Link
            href="/auth/login"
            style={{
              fontSize: '0.9rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            Login
          </Link>
          <Link
            href="/auth/ngo/register"
            className="btn-civic btn-civic-primary"
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
            }}
          >
            Register NGO
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-toggle"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle Navigation Menu"
          style={{
            background: 'none',
            border: '1px solid var(--border-medium)',
            padding: '0.4rem 0.6rem',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          {mobileMenuOpen ? '✕ Close' : '☰ Menu'}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid var(--border-light)',
            padding: '1.25rem 1.5rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: '500', padding: '0.4rem 0' }}
          >
            Home
          </Link>
          <Link
            href="/user/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: '600', color: 'var(--brand-primary)', padding: '0.4rem 0' }}
          >
            📍 Find Nearby NGOs
          </Link>
          <Link
            href="#schemes-preview"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: '500', color: 'var(--text-secondary)', padding: '0.4rem 0' }}
          >
            Explore Schemes
          </Link>
          <Link
            href="#for-ngos"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: '500', color: 'var(--text-secondary)', padding: '0.4rem 0' }}
          >
            For NGOs
          </Link>
          <Link
            href="#purpose"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: '500', color: 'var(--text-secondary)', padding: '0.4rem 0' }}
          >
            About
          </Link>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border-light)',
            }}
          >
            <Link
              href="/auth/login"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-civic btn-civic-secondary"
              style={{ width: '100%' }}
            >
              Sign In
            </Link>
            <Link
              href="/auth/ngo/register"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-civic btn-civic-primary"
              style={{ width: '100%' }}
            >
              Register NGO
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
