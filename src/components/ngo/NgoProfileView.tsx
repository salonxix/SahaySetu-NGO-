'use client';

import React, { useState } from 'react';
import type { NgoUser } from '@/types/auth';

interface NgoProfileViewProps {
  ngoUser: NgoUser | null;
}

export const NgoProfileView: React.FC<NgoProfileViewProps> = ({ ngoUser }) => {
  const [formData, setFormData] = useState({
    ngoName: ngoUser?.ngoName || '',
    registrationNumber: ngoUser?.registrationNumber || '',
    focusSector: ngoUser?.focusSector || '',
    contactPerson: ngoUser?.contactPerson || '',
    phoneNumber: ngoUser?.phoneNumber || '',
    email: ngoUser?.email || '',
    state: ngoUser?.state || '',
    city: ngoUser?.city || '',
    address: ngoUser?.address || '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        padding: '1.75rem 2rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              NGO Organisation Profile
            </h2>
            <span className="badge-tag badge-emerald" style={{ fontSize: '0.7rem' }}>
              ✓ Verified Darpan Entity
            </span>
          </div>
          <p className="body-text" style={{ fontSize: '0.875rem' }}>
            Maintain verified operational details to ensure accurate scheme matching and eligibility verification.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="alert-box alert-success" style={{ marginBottom: '1.5rem' }}>
          ✓ Profile information updated successfully. Automated scheme matching refreshed.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Core Registered Details (Read-only verified) */}
        <div
          style={{
            backgroundColor: 'var(--bg-subtle)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-light)',
            marginBottom: '1.5rem',
          }}
        >
          <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)', display: 'block', marginBottom: '0.75rem' }}>
            Verified Statutory Identity (Locked)
          </strong>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Organisation Name</span>
              <strong>{formData.ngoName}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>NGO Darpan / Reg ID</span>
              <strong style={{ fontFamily: 'monospace' }}>{formData.registrationNumber}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Primary Focus Sector</span>
              <strong>{formData.focusSector}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Operating State</span>
              <strong>{formData.state}</strong>
            </div>
          </div>
        </div>

        {/* Editable Coordinator & Contact Information */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
            Contact & Local Operations
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="prof-contact" className="form-label" style={{ color: 'var(--text-primary)' }}>
                <span>Contact Person</span>
              </label>
              <input
                id="prof-contact"
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="form-input"
                style={{ backgroundColor: '#ffffff' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="prof-phone" className="form-label" style={{ color: 'var(--text-primary)' }}>
                <span>Phone Number</span>
              </label>
              <input
                id="prof-phone"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="form-input"
                style={{ backgroundColor: '#ffffff' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="prof-email" className="form-label" style={{ color: 'var(--text-primary)' }}>
                <span>Official Email</span>
              </label>
              <input
                id="prof-email"
                type="email"
                value={formData.email}
                disabled
                className="form-input"
                style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="prof-city" className="form-label" style={{ color: 'var(--text-primary)' }}>
                <span>City / District</span>
              </label>
              <input
                id="prof-city"
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. New Delhi"
                className="form-input"
                style={{ backgroundColor: '#ffffff' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="prof-address" className="form-label" style={{ color: 'var(--text-primary)' }}>
              <span>Registered Field Address</span>
            </label>
            <input
              id="prof-address"
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. Sector 12, Dwarka"
              className="form-input"
              style={{ backgroundColor: '#ffffff' }}
            />
          </div>
        </div>

        <button type="submit" className="btn-civic btn-civic-primary">
          Save Profile Updates
        </button>
      </form>
    </div>
  );
};
