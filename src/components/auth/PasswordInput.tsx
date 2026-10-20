'use client';

import React, { useState } from 'react';

interface PasswordInputProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  showStrength?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  name,
  value,
  onChange,
  label = 'Password',
  placeholder = '••••••••',
  error,
  required = true,
  showStrength = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Simple password strength calculation
  const getStrength = (pwd: string) => {
    if (!pwd) return { label: '', color: '', width: '0%' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-zA-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { label: 'Weak', color: '#ef4444', width: '25%' };
    if (score === 2) return { label: 'Fair', color: '#f59e0b', width: '50%' };
    if (score === 3) return { label: 'Good', color: '#38bdf8', width: '75%' };
    return { label: 'Strong', color: '#22c55e', width: '100%' };
  };

  const strength = getStrength(value);

  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        <span>
          {label} {required && <span className="required">*</span>}
        </span>
      </label>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`form-input ${error ? 'input-error' : ''}`}
          required={required}
          style={{ paddingRight: '3rem' }}
          autoComplete={name === 'password' ? 'current-password' : 'new-password'}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          style={{
            position: 'absolute',
            right: '0.75rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.8rem',
            padding: '4px',
          }}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      {showStrength && value.length > 0 && (
        <div style={{ marginTop: '0.4rem' }}>
          <div
            style={{
              height: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: strength.width,
                backgroundColor: strength.color,
                transition: 'width 0.3s ease, background-color 0.3s ease',
              }}
            />
          </div>
          <span
            style={{
              fontSize: '0.75rem',
              color: strength.color,
              marginTop: '0.2rem',
              display: 'inline-block',
            }}
          >
            Strength: {strength.label}
          </span>
        </div>
      )}

      {error ? (
        <span className="form-error-msg">{error}</span>
      ) : (
        <span className="form-hint">At least 8 characters with letters & numbers</span>
      )}
    </div>
  );
};
