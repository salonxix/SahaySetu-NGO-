'use client';

import React from 'react';
import Link from 'next/link';
import type { UserRole } from '@/types/auth';

interface AuthCardProps {
  title: string;
  subtitle: string;
  role: UserRole;
  mode: 'login' | 'register';
  children: React.ReactNode;
  onRoleChange?: (role: UserRole) => void;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  title,
  subtitle,
  role,
  mode,
  children,
  onRoleChange,
}) => {
  const isNgo = role === 'ngo';

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Link href="/">
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                marginBottom: '0.25rem',
              }}
            >
              SahaySetu
            </span>
          </Link>
          <h1 style={{ fontSize: '1.35rem', fontWeight: '600', marginTop: '0.5rem' }}>
            {title}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {subtitle}
          </p>
        </div>

        {/* Role Switcher Tabs */}
        {onRoleChange && (
          <div className="auth-tabs" role="tablist" aria-label="Select portal role">
            <button
              type="button"
              role="tab"
              aria-selected={!isNgo}
              className={`auth-tab ${!isNgo ? 'active-user' : ''}`}
              onClick={() => onRoleChange('user')}
            >
              👤 Citizen / General User
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isNgo}
              className={`auth-tab ${isNgo ? 'active-ngo' : ''}`}
              onClick={() => onRoleChange('ngo')}
            >
              🏢 NGO Organization
            </button>
          </div>
        )}

        {/* Main Content Form */}
        {children}

        {/* Footer Navigation */}
        <div
          style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border)',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
          }}
        >
          {mode === 'login' ? (
            <p>
              Don&apos;t have an account yet?{' '}
              <Link
                href={isNgo ? '/auth/ngo/register' : '/auth/user/register'}
                style={{
                  color: isNgo ? 'var(--primary-ngo)' : 'var(--primary-user)',
                  fontWeight: '600',
                  textDecoration: 'underline',
                }}
              >
                Register as {isNgo ? 'an NGO' : 'a Citizen'}
              </Link>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <Link
                href={isNgo ? '/auth/ngo/login' : '/auth/user/login'}
                style={{
                  color: isNgo ? 'var(--primary-ngo)' : 'var(--primary-user)',
                  fontWeight: '600',
                  textDecoration: 'underline',
                }}
              >
                Sign in to your account
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
