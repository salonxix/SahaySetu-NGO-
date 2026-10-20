'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { NgoUser } from '@/types/auth';
import type { NgoPublishProfile } from '@/types/ngo-publish';
import { ALL_DONATION_TYPES, ALL_HELP_SERVICES, type HelpServiceCategory } from '@/types/ngo-publish';
import type { DonationType, NgoCauseCategory } from '@/types/user-portal';
import { PublishPreviewModal } from './PublishPreviewModal';

const CAUSE_CATEGORIES: NgoCauseCategory[] = [
  'Education',
  'Healthcare',
  'Children',
  'Women & Girls',
  'Elderly',
  'Disability Support',
  'Environment',
  'Animal Welfare',
  'Rural Development',
  'Disaster Relief',
];

interface NgoPublicProfileEditorProps {
  ngoUser: NgoUser | null;
}

export const NgoPublicProfileEditor: React.FC<NgoPublicProfileEditorProps> = ({ ngoUser }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  // Public Fields
  const [ngoName, setNgoName] = useState('');
  const [about, setAbout] = useState('');
  const [primaryCause, setPrimaryCause] = useState<NgoCauseCategory>('Education');
  const [additionalCauses, setAdditionalCauses] = useState<NgoCauseCategory[]>([]);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [operatingAreas, setOperatingAreas] = useState<string>('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [operatingHours, setOperatingHours] = useState('Mon-Sat: 9:00 AM - 6:00 PM');
  const [establishedYear, setEstablishedYear] = useState<string>('2015');
  const [acceptedDonationTypes, setAcceptedDonationTypes] = useState<DonationType[]>(['Books', 'Stationery']);
  const [servicesProvided, setServicesProvided] = useState<HelpServiceCategory[]>(['Education support']);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ngo/publish-profile');
      const data = await res.json();
      if (data?.success && data.profile) {
        const p: NgoPublishProfile = data.profile;
        setNgoName(p.ngoName || ngoUser?.ngoName || '');
        setAbout(p.about || '');
        setPrimaryCause(p.primaryCause || 'Education');
        setAdditionalCauses(p.additionalCauses || []);
        setAddress(p.address || ngoUser?.address || '');
        setCity(p.city || ngoUser?.city || '');
        setDistrict(p.district || '');
        setState(p.state || ngoUser?.state || '');
        setPincode(p.pincode || '');
        setOperatingAreas((p.operatingAreas || []).join(', '));
        setContactPerson(p.contactPerson || ngoUser?.contactPerson || '');
        setPhone(p.phone || ngoUser?.phoneNumber || '');
        setEmail(p.email || ngoUser?.email || '');
        setWebsite(p.website || '');
        setOperatingHours(p.operatingHours || 'Mon-Sat: 9:00 AM - 6:00 PM');
        setEstablishedYear(p.establishedYear ? String(p.establishedYear) : '2015');
        setAcceptedDonationTypes(p.acceptedDonationTypes || ['Books', 'Stationery']);
        setServicesProvided(p.servicesProvided || ['Education support']);
      } else {
        // Fallback to user auth data
        setNgoName(ngoUser?.ngoName || '');
        setAddress(ngoUser?.address || '');
        setCity(ngoUser?.city || '');
        setState(ngoUser?.state || '');
        setContactPerson(ngoUser?.contactPerson || '');
        setPhone(ngoUser?.phoneNumber || '');
        setEmail(ngoUser?.email || '');
      }
    } catch (err) {
      console.error('Error fetching public profile:', err);
    } finally {
      setLoading(false);
    }
  }, [ngoUser]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const toggleDonationType = (type: DonationType) => {
    setAcceptedDonationTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleServiceProvided = (serviceId: HelpServiceCategory) => {
    setServicesProvided((prev) =>
      prev.includes(serviceId) ? prev.filter((s) => s !== serviceId) : [...prev, serviceId]
    );
  };

  const toggleAdditionalCause = (cause: NgoCauseCategory) => {
    setAdditionalCauses((prev) =>
      prev.includes(cause) ? prev.filter((c) => c !== cause) : [...prev, cause]
    );
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const areasArray = operatingAreas
      .split(',')
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    const payload: Partial<NgoPublishProfile> = {
      ngoName,
      about,
      primaryCause,
      additionalCauses,
      address,
      city,
      district,
      state,
      pincode,
      operatingAreas: areasArray,
      contactPerson,
      phone,
      email,
      website,
      operatingHours,
      establishedYear: Number(establishedYear) || undefined,
      acceptedDonationTypes,
      servicesProvided,
    };

    try {
      const res = await fetch('/api/ngo/publish-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Public profile published successfully! Your profile, accepted donations, and services are now updated live for citizens.');
      } else {
        setErrorMsg(data.error || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('Error saving public profile:', err);
      setErrorMsg('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
        Loading profile settings...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            Public Profile & Discovery Setup
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
            Configure the public organisation profile, accepted donation categories, and help services discoverable by citizens.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            style={{
              padding: '0.6rem 1rem',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            👁️ Preview Public Card
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            style={{
              padding: '0.6rem 1.25rem',
              backgroundColor: 'var(--brand-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            {saving ? 'Publishing...' : 'Publish Profile'}
          </button>
        </div>
      </div>

      {successMsg && (
        <div
          style={{
            padding: '0.85rem 1rem',
            backgroundColor: 'var(--bg-tint-emerald)',
            border: '1px solid var(--brand-primary)',
            color: 'var(--brand-primary)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
            fontWeight: '600',
          }}
        >
          ✓ {successMsg}
        </div>
      )}

      {errorMsg && (
        <div
          style={{
            padding: '0.85rem 1rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
          }}
        >
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* SECTION 1: PUBLIC INFORMATION */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🌐</span>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                1. Public Organisation Overview
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--brand-primary)', fontWeight: '600' }}>
                PUBLIC INFORMATION (Visible to donors & citizens on SahaySetu)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Organisation Display Name *
                </label>
                <input
                  type="text"
                  value={ngoName}
                  onChange={(e) => setNgoName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Primary Cause *
                </label>
                <select
                  value={primaryCause}
                  onChange={(e) => setPrimaryCause(e.target.value as NgoCauseCategory)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', backgroundColor: '#ffffff' }}
                >
                  {CAUSE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Established Year
                </label>
                <input
                  type="number"
                  value={establishedYear}
                  onChange={(e) => setEstablishedYear(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                About Organisation (Mission & Background) *
              </label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Describe your organisation's history, mission, key achievements, and civic impact..."
                rows={4}
                required
                style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontFamily: 'inherit' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.4rem' }}>
                Additional Supported Causes
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {CAUSE_CATEGORIES.map((c) => {
                  if (c === primaryCause) return null;
                  const selected = additionalCauses.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleAdditionalCause(c)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '9999px',
                        border: selected ? '1px solid var(--brand-primary)' : '1px solid var(--border-medium)',
                        backgroundColor: selected ? 'var(--bg-tint-emerald)' : 'var(--bg-subtle)',
                        color: selected ? 'var(--brand-primary)' : 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        fontWeight: selected ? '700' : '500',
                        cursor: 'pointer',
                      }}
                    >
                      {selected ? '✓ ' : '+ '}{c}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: ACCEPTED DONATION TYPES (MATCHING "I WANT TO HELP") */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🎁</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              2. Accepted Donation Categories
            </h3>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>
            Specify what items or contributions you accept. When citizens use &quot;I Want to Help&quot; and filter by these items (e.g. Books, Clothes, Food), your NGO will appear as an exact match.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {ALL_DONATION_TYPES.map((type) => {
              const isSelected = acceptedDonationTypes.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleDonationType(type)}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: 'var(--radius-sm)',
                    border: isSelected ? '1px solid var(--brand-primary)' : '1px solid var(--border-medium)',
                    backgroundColor: isSelected ? 'var(--bg-tint-emerald)' : '#ffffff',
                    color: isSelected ? 'var(--brand-primary)' : 'var(--text-primary)',
                    fontSize: '0.875rem',
                    fontWeight: isSelected ? '700' : '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <span>{isSelected ? '✓' : '+'}</span>
                  <span>{type}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: SERVICES PROVIDED (MATCHING "I NEED HELP") */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🤝</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              3. Services & Assistance Provided
            </h3>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>
            What direct assistance can your organisation provide to citizens in need? When citizens search under &quot;I Need Help&quot;, your NGO will appear with clear matching reasons.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {ALL_HELP_SERVICES.map((srv) => {
              const isSelected = servicesProvided.includes(srv.id);
              return (
                <div
                  key={srv.id}
                  onClick={() => toggleServiceProvided(srv.id)}
                  style={{
                    padding: '0.75rem 1rem',
                    border: isSelected ? '1px solid var(--brand-primary)' : '1px solid var(--border-medium)',
                    backgroundColor: isSelected ? 'var(--bg-tint-emerald)' : '#ffffff',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}} // Controlled by div click
                    style={{ marginTop: '0.2rem', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: isSelected ? 'var(--brand-primary)' : 'var(--text-primary)' }}>
                      {srv.icon} {srv.label}
                    </div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                      {srv.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 4: LOCATION & CONTACT */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1.25rem' }}>📍</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              4. Operating Location & Contact Channels
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                Full Centre / Office Address *
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                City *
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                State *
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                Operating Areas / Clusters (Comma separated)
              </label>
              <input
                type="text"
                value={operatingAreas}
                onChange={(e) => setOperatingAreas(e.target.value)}
                placeholder="e.g. Dwarka, Najafgarh, Uttam Nagar, Palam"
                style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                Public Helpline / Phone *
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                Public Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                Official Website (Optional)
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourorganisation.org"
                style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
              />
            </div>
          </div>
        </div>

        {/* SECTION 5: PRIVATE ADMINISTRATIVE DETAILS */}
        <div
          style={{
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🔒</span>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                5. Private & Administrative Records
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: '600' }}>
                PRIVATE INFORMATION (Never exposed on the public user portal)
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>
            These details are used solely for official scheme applications, statutory verifications, and department communications.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700' }}>DARPAN REGISTRATION NUMBER</div>
              <div style={{ fontWeight: '700', marginTop: '0.2rem' }}>{ngoUser?.registrationNumber || 'DL/2021/0284918'}</div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700' }}>OFFICIAL SIGNATORY</div>
              <div style={{ fontWeight: '700', marginTop: '0.2rem' }}>{ngoUser?.contactPerson || 'Aarav Sharma'}</div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700' }}>12A / 80G COMPLIANCE</div>
              <div style={{ fontWeight: '700', marginTop: '0.2rem', color: 'var(--brand-primary)' }}>✓ Verified in Document Locker</div>
            </div>
          </div>
        </div>

        {/* Footer Submit */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            style={{
              padding: '0.65rem 1.25rem',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            👁️ Preview
          </button>

          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '0.65rem 1.75rem',
              backgroundColor: 'var(--brand-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            {saving ? 'Publishing Updates...' : 'Publish Profile Updates'}
          </button>
        </div>
      </form>

      {/* Preview Modal */}
      {previewOpen && (
        <PublishPreviewModal
          isOpen={true}
          onClose={() => setPreviewOpen(false)}
          type="profile"
          data={{
            type: 'profile',
            profile: {
              ngoName,
              about,
              primaryCause,
              additionalCauses,
              address,
              city,
              state,
              pincode,
              operatingAreas: operatingAreas.split(',').map((a) => a.trim()),
              phone,
              email,
              website,
              acceptedDonationTypes,
              servicesProvided,
            },
          }}
          onConfirmPublish={() => handleSave()}
        />
      )}
    </div>
  );
};
