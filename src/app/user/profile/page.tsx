'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import type { GeneralUser } from '@/types/auth';
import Link from 'next/link';

export default function UserProfilePage() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading Citizen Profile...</p>
      </div>
    );
  }

  const citizen = user as unknown as GeneralUser;

  return (
    <div style={{ minHeight: '80vh', backgroundColor: 'var(--bg-canvas)', padding: '3rem 1.5rem' }}>
      <div
        className="container"
        style={{
          maxWidth: '680px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.75rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--border-light)',
          }}
        >
          <div>
            <span
              style={{
                display: 'inline-block',
                padding: '0.2rem 0.6rem',
                backgroundColor: 'var(--bg-tint-emerald)',
                color: 'var(--brand-primary)',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '700',
                marginBottom: '0.5rem',
              }}
            >
              👤 Verified Citizen & Donor Account
            </span>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              {citizen?.fullName || 'Citizen User'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              {citizen?.email}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <Link
              href="/user/dashboard"
              className="btn-civic btn-civic-primary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              Explore Dashboard
            </Link>
            <button
              type="button"
              onClick={logout}
              className="btn-civic btn-civic-secondary"
              style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Account Details Box */}
        <div
          style={{
            backgroundColor: 'var(--bg-canvas)',
            borderRadius: 'var(--radius-sm)',
            padding: '1.25rem',
            border: '1px solid var(--border-light)',
            marginBottom: '1.75rem',
          }}
        >
          <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Registered Citizen Information
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Operating State</span>
              <strong>{citizen?.state || 'Delhi NCR'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Preferred Language</span>
              <strong>{citizen?.preferredLanguage || 'Hindi'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Contact Phone</span>
              <strong>{citizen?.phoneNumber || 'Not provided'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Account Role</span>
              <strong>Citizen / Donor</strong>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.75rem',
          }}
          className="user-quick-actions"
        >
          <Link
            href="/user/dashboard"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
              display: 'block',
              transition: 'border-color 0.15s ease',
            }}
          >
            <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.35rem' }}>🏘️</span>
            <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block', marginBottom: '0.2rem' }}>
              Nearby Non-Profits
            </strong>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Find organisations in your area accepting books, food, clothes, and volunteers.
            </p>
          </Link>

          <Link
            href="/user/dashboard"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
              display: 'block',
              transition: 'border-color 0.15s ease',
            }}
          >
            <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.35rem' }}>🗺️</span>
            <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block', marginBottom: '0.2rem' }}>
              Interactive Map
            </strong>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Explore donation drives and community campaigns on the live proximity map.
            </p>
          </Link>
        </div>

        {/* Privacy Note */}
        <div
          style={{
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-tint-emerald)',
            border: '1px solid #a7f3d0',
            fontSize: '0.825rem',
            color: '#065f46',
            textAlign: 'center',
          }}
        >
          🔒 <strong>Privacy Assurance:</strong> Your exact GPS coordinates are never stored or shared with external parties.
        </div>
      </div>
    </div>
  );
}
