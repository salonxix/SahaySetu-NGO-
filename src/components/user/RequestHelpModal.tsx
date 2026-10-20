'use client';

import React, { useState } from 'react';
import type { PublicNgoOrg } from '@/types/user-portal';
import { ALL_HELP_SERVICES, type HelpServiceCategory } from '@/types/ngo-publish';

interface RequestHelpModalProps {
  ngo: PublicNgoOrg | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultCategory?: HelpServiceCategory;
}

export const RequestHelpModal: React.FC<RequestHelpModalProps> = ({
  ngo,
  isOpen,
  onClose,
  onSuccess,
  defaultCategory = 'Education support',
}) => {
  const [category, setCategory] = useState<HelpServiceCategory>(defaultCategory);
  const [needTitle, setNeedTitle] = useState('');
  const [needDescription, setNeedDescription] = useState('');
  const [itemsRequested, setItemsRequested] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [citizenEmail, setCitizenEmail] = useState('');
  const [location, setLocation] = useState('');
  const [urgency, setUrgency] = useState<'Immediate' | 'Within a week' | 'Flexible'>('Within a week');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !ngo) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!needTitle.trim() || !needDescription.trim() || !citizenPhone.trim()) {
      setErrorMsg('Please fill in required fields (Title, Description, and Contact Number).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/user/help-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ngoId: ngo.id,
          ngoName: ngo.name,
          category,
          needTitle,
          needDescription,
          itemsRequested,
          citizenName: citizenName || 'Applicant',
          citizenPhone,
          citizenEmail,
          location: location || `${ngo.city}, ${ngo.state}`,
          urgency,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setErrorMsg(data.error || 'Failed to submit help request.');
      }
    } catch (err) {
      console.error('Error submitting help request:', err);
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-subtle)',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
              Direct Assistance Request
            </span>
            <h3 id="help-modal-title" style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', margin: '0.15rem 0 0 0' }}>
              Request Help from {ngo.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.25rem',
              cursor: 'pointer',
              color: 'var(--text-muted)',
            }}
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          <div
            style={{
              padding: '0.65rem 0.85rem',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#1e40af',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              marginBottom: '1rem',
            }}
          >
            🔒 <strong>Private & Direct:</strong> Your request details will only be shared with the coordinators at <strong>{ngo.name}</strong>.
          </div>

          {errorMsg && (
            <div
              style={{
                padding: '0.65rem 0.85rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                marginBottom: '1rem',
              }}
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                Assistance Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as HelpServiceCategory)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  backgroundColor: '#ffffff',
                }}
              >
                {ALL_HELP_SERVICES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.icon} {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                Summary of Need *
              </label>
              <input
                type="text"
                value={needTitle}
                onChange={(e) => setNeedTitle(e.target.value)}
                placeholder="e.g. School books for two children"
                required
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                Explain Your Situation / Need in Detail *
              </label>
              <textarea
                value={needDescription}
                onChange={(e) => setNeedDescription(e.target.value)}
                placeholder="Please describe how the NGO can assist you or your family..."
                rows={3}
                required
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                Specific Items / Supplies Needed (Optional)
              </label>
              <input
                type="text"
                value={itemsRequested}
                onChange={(e) => setItemsRequested(e.target.value)}
                placeholder="e.g. NCERT Class 7 & 9 books, 6 register notebooks"
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                  Your Name
                </label>
                <input
                  type="text"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder="e.g. Pooja Verma"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={citizenPhone}
                  onChange={(e) => setCitizenPhone(e.target.value)}
                  placeholder="+91 9123456780"
                  required
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={citizenEmail}
                onChange={(e) => setCitizenEmail(e.target.value)}
                placeholder="citizen@example.com"
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                  Your Area / District
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Najafgarh, New Delhi"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                  Urgency
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as 'Immediate' | 'Within a week' | 'Flexible')}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <option value="Within a week">Within a week</option>
                  <option value="Immediate">Immediate / Urgent</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                borderTop: '1px solid var(--border-light)',
                paddingTop: '1rem',
                marginTop: '0.5rem',
              }}
            >
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '0.6rem 1rem',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: '0.6rem 1.5rem',
                  backgroundColor: 'var(--brand-primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {submitting ? 'Submitting...' : 'Send Help Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
