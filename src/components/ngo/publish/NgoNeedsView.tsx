'use client';

import React, { useState, useEffect } from 'react';
import type { NgoDonationNeed, NgoNeedStatus } from '@/types/ngo-publish';
import { ALL_DONATION_TYPES } from '@/types/ngo-publish';
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

export const NgoNeedsView: React.FC = () => {
  const [needs, setNeeds] = useState<NgoDonationNeed[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingNeed, setEditingNeed] = useState<NgoDonationNeed | null>(null);
  const [previewData, setPreviewData] = useState<Partial<NgoDonationNeed> | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DonationType>('Books');
  const [causeCategory, setCauseCategory] = useState<NgoCauseCategory>('Education');
  const [description, setDescription] = useState('');
  const [itemsRequired, setItemsRequired] = useState('');
  const [quantityNeeded, setQuantityNeeded] = useState('');
  const [location, setLocation] = useState('');
  const [preferredContributionType, setPreferredContributionType] = useState<DonationType>('Books');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dropoffInfo, setDropoffInfo] = useState('');
  const [acceptsCourier, setAcceptsCourier] = useState(false);
  const [contactInfo, setContactInfo] = useState('');
  const [urgency, setUrgency] = useState<'Immediate' | 'Regular' | 'Low'>('Regular');
  const [status, setStatus] = useState<NgoNeedStatus>('Accepting');

  const fetchNeeds = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ngo/needs');
      const data = await res.json();
      if (data?.success && Array.isArray(data.needs)) {
        setNeeds(data.needs);
      }
    } catch (err) {
      console.error('Error fetching donation needs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNeeds();
  }, []);

  const resetForm = () => {
    setTitle('');
    setCategory('Books');
    setCauseCategory('Education');
    setDescription('');
    setItemsRequired('');
    setQuantityNeeded('');
    setLocation('');
    setPreferredContributionType('Books');
    setStartDate('');
    setEndDate('');
    setDropoffInfo('');
    setAcceptsCourier(false);
    setContactInfo('');
    setUrgency('Regular');
    setStatus('Accepting');
    setEditingNeed(null);
    setIsFormOpen(false);
  };

  const handleOpenEdit = (need: NgoDonationNeed) => {
    setEditingNeed(need);
    setTitle(need.title);
    setCategory(need.category);
    setCauseCategory(need.causeCategory || 'Education');
    setDescription(need.description);
    setItemsRequired(need.itemsRequired);
    setQuantityNeeded(need.quantityNeeded || '');
    setLocation(need.location);
    setPreferredContributionType(need.preferredContributionType);
    setStartDate(need.startDate || '');
    setEndDate(need.endDate || '');
    setDropoffInfo(need.dropoffInfo || '');
    setAcceptsCourier(need.acceptsCourier);
    setContactInfo(need.contactInfo);
    setUrgency(need.urgency);
    setStatus(need.status);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim() || !itemsRequired.trim()) {
      setErrorMsg('Please specify need title and items required.');
      return;
    }

    const payload = {
      title,
      category,
      causeCategory,
      description,
      itemsRequired,
      quantityNeeded,
      location,
      preferredContributionType,
      startDate,
      endDate,
      dropoffInfo,
      acceptsCourier,
      contactInfo,
      urgency,
      status,
    };

    try {
      if (editingNeed) {
        const res = await fetch('/api/ngo/needs', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingNeed.id, ...payload }),
        });
        const data = await res.json();
        if (data.success) {
          setSuccessMsg('Donation need updated successfully.');
          fetchNeeds();
          resetForm();
        } else {
          setErrorMsg(data.error || 'Failed to update need.');
        }
      } else {
        const res = await fetch('/api/ngo/needs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setSuccessMsg('New donation need created and published.');
          fetchNeeds();
          resetForm();
        } else {
          setErrorMsg(data.error || 'Failed to create need.');
        }
      }
    } catch (err) {
      console.error('Error submitting need:', err);
      setErrorMsg('An error occurred. Please try again.');
    }
  };

  const handleUpdateStatus = async (need: NgoDonationNeed, newStatus: NgoNeedStatus) => {
    try {
      const res = await fetch('/api/ngo/needs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: need.id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchNeeds();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (needId: string) => {
    if (!window.confirm('Are you sure you want to archive/delete this donation need?')) return;
    try {
      const res = await fetch(`/api/ngo/needs?id=${encodeURIComponent(needId)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchNeeds();
      }
    } catch (err) {
      console.error('Failed to delete need:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* View Header */}
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
            Donation Needs
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
            Publish specific material and item requirements that nearby citizens can fulfill.
          </p>
        </div>

        {!isFormOpen && (
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            style={{
              padding: '0.65rem 1.25rem',
              backgroundColor: 'var(--brand-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>+</span>
            <span>Create Need</span>
          </button>
        )}
      </div>

      {/* Status Messages */}
      {successMsg && (
        <div
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--bg-tint-emerald)',
            border: '1px solid var(--brand-primary)',
            color: 'var(--brand-primary)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
            fontWeight: '600',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>✓ {successMsg}</span>
          <button
            type="button"
            onClick={() => setSuccessMsg(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Creation / Edit Form */}
      {isFormOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              {editingNeed ? 'Edit Donation Need' : 'Create a New Donation Need'}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              ✕ Cancel
            </button>
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Need Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. School Books Needed"
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
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Donation Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    const val = e.target.value as DonationType;
                    setCategory(val);
                    setPreferredContributionType(val);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem',
                    backgroundColor: '#ffffff',
                  }}
                >
                  {ALL_DONATION_TYPES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Primary Cause
                </label>
                <select
                  value={causeCategory}
                  onChange={(e) => setCauseCategory(e.target.value as NgoCauseCategory)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem',
                    backgroundColor: '#ffffff',
                  }}
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
                  Quantity Target / Count
                </label>
                <input
                  type="text"
                  value={quantityNeeded}
                  onChange={(e) => setQuantityNeeded(e.target.value)}
                  placeholder="e.g. 100 sets / 50 blankets"
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
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                Items Required (Detailed List) *
              </label>
              <input
                type="text"
                value={itemsRequired}
                onChange={(e) => setItemsRequired(e.target.value)}
                placeholder="e.g. School textbooks (NCERT Class 6-10), unruled notebooks, stationery kits"
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
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                Description & Purpose
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain why these items are needed and how they will be utilized..."
                rows={3}
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Drop-off Location / Centre
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Sector 12 Learning Centre, Dwarka"
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
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Contact Information / Helpline
                </label>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="e.g. +91 9876543210 (Centre Desk)"
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
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Urgency Level
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as 'Immediate' | 'Regular' | 'Low')}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <option value="Regular">Standard / Ongoing</option>
                  <option value="Immediate">Urgent / Immediate Need</option>
                  <option value="Low">Low / Advance Planning</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Publish Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as NgoNeedStatus)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <option value="Accepting">Accepting (Publicly Discoverable)</option>
                  <option value="Draft">Save as Draft (Private)</option>
                  <option value="Paused">Paused</option>
                  <option value="Partially Fulfilled">Partially Fulfilled</option>
                  <option value="Fulfilled">Fulfilled</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
              <input
                type="checkbox"
                id="acceptsCourier"
                checked={acceptsCourier}
                onChange={(e) => setAcceptsCourier(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label htmlFor="acceptsCourier" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                Accept direct postal / courier deliveries from donors across the country
              </label>
            </div>

            {/* Actions Bar */}
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
                onClick={() =>
                  setPreviewData({
                    title,
                    category,
                    causeCategory,
                    description,
                    itemsRequired,
                    quantityNeeded,
                    location,
                    dropoffInfo,
                    acceptsCourier,
                    contactInfo,
                    urgency,
                    status,
                  })
                }
                style={{
                  padding: '0.6rem 1rem',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                }}
              >
                👁️ Preview Citizen View
              </button>

              <button
                type="button"
                onClick={resetForm}
                style={{
                  padding: '0.6rem 1rem',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
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
                {editingNeed ? 'Save Changes' : 'Create & Publish'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Needs Listing */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Loading donation needs...
        </div>
      ) : needs.length === 0 ? (
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px dashed var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '3rem 2rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎁</div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
            No Active Donation Needs Yet
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '460px', margin: '0.5rem auto 1.25rem auto' }}>
            Publish specific needs (such as books, clothes, food, or stationery) so citizens searching by donation type can discover your organisation.
          </p>
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            style={{
              padding: '0.65rem 1.25rem',
              backgroundColor: 'var(--brand-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Create Your First Need
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {needs.map((need) => {
            const isAccepting = need.status === 'Accepting';
            const isPaused = need.status === 'Paused';
            const isFulfilled = need.status === 'Fulfilled';

            return (
              <div
                key={need.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          backgroundColor: 'var(--bg-tint-emerald)',
                          color: 'var(--brand-primary)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                        }}
                      >
                        {need.category}
                      </span>

                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          backgroundColor:
                            isAccepting
                              ? '#dcfce7'
                              : isPaused
                              ? '#fef3c7'
                              : isFulfilled
                              ? '#f1f5f9'
                              : 'var(--bg-subtle)',
                          color:
                            isAccepting
                              ? '#15803d'
                              : isPaused
                              ? '#b45309'
                              : isFulfilled
                              ? '#475569'
                              : 'var(--text-secondary)',
                        }}
                      >
                        ● {need.status}
                      </span>

                      {need.urgency === 'Immediate' && (
                        <span
                          style={{
                            fontSize: '0.725rem',
                            fontWeight: '700',
                            backgroundColor: '#fef2f2',
                            color: '#b91c1c',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px',
                          }}
                        >
                          Urgent
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                      {need.title}
                    </h3>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setPreviewData(need)}
                      style={{
                        padding: '0.4rem 0.65rem',
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-medium)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                      title="Preview public appearance"
                    >
                      👁️ Preview
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(need)}
                      style={{
                        padding: '0.4rem 0.65rem',
                        backgroundColor: 'transparent',
                        border: '1px solid var(--border-medium)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      ✏️ Edit
                    </button>

                    {isAccepting ? (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(need, 'Paused')}
                        style={{
                          padding: '0.4rem 0.65rem',
                          backgroundColor: '#fef3c7',
                          border: '1px solid #fde68a',
                          color: '#b45309',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        ⏸ Pause
                      </button>
                    ) : isPaused ? (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(need, 'Accepting')}
                        style={{
                          padding: '0.4rem 0.65rem',
                          backgroundColor: '#dcfce7',
                          border: '1px solid #bbf7d0',
                          color: '#15803d',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        ▶ Resume
                      </button>
                    ) : null}

                    {!isFulfilled && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(need, 'Fulfilled')}
                        style={{
                          padding: '0.4rem 0.65rem',
                          backgroundColor: 'var(--bg-subtle)',
                          border: '1px solid var(--border-medium)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        ✓ Fulfilled
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(need.id)}
                      style={{
                        padding: '0.4rem 0.65rem',
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: '#b91c1c',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      🗑 Archive
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {need.description}
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1.25rem',
                    fontSize: '0.8rem',
                  }}
                >
                  <div><strong>Required Items:</strong> {need.itemsRequired}</div>
                  {need.quantityNeeded && <div><strong>Target:</strong> {need.quantityNeeded}</div>}
                  {need.location && <div><strong>Location:</strong> {need.location}</div>}
                  {need.acceptsCourier && <div><strong>Courier:</strong> ✓ Accepted</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      {previewData && (
        <PublishPreviewModal
          isOpen={true}
          onClose={() => setPreviewData(null)}
          type="need"
          data={{ type: 'need', need: previewData }}
        />
      )}
    </div>
  );
};
