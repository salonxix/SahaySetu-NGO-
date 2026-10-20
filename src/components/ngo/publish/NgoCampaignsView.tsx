'use client';

import React, { useState, useEffect } from 'react';
import type { NgoCampaignItem, NgoCampaignStatus } from '@/types/ngo-publish';
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

export const NgoCampaignsView: React.FC = () => {
  const [campaigns, setCampaigns] = useState<NgoCampaignItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingCampaign, setEditingCampaign] = useState<NgoCampaignItem | null>(null);
  const [previewData, setPreviewData] = useState<Partial<NgoCampaignItem> | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cause, setCause] = useState<NgoCauseCategory>('Education');
  const [objective, setObjective] = useState('');
  const [donationTypesAccepted, setDonationTypesAccepted] = useState<DonationType[]>(['Books']);
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [targetUnits, setTargetUnits] = useState('');
  const [collectedUnits, setCollectedUnits] = useState('');
  const [contact, setContact] = useState('');
  const [status, setStatus] = useState<NgoCampaignStatus>('Active');

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ngo/campaigns');
      const data = await res.json();
      if (data?.success && Array.isArray(data.campaigns)) {
        setCampaigns(data.campaigns);
      }
    } catch (err) {
      console.error('Error fetching campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCause('Education');
    setObjective('');
    setDonationTypesAccepted(['Books']);
    setLocation('');
    setStartDate('');
    setEndDate('');
    setTargetUnits('');
    setCollectedUnits('');
    setContact('');
    setStatus('Active');
    setEditingCampaign(null);
    setIsFormOpen(false);
  };

  const handleOpenEdit = (cmp: NgoCampaignItem) => {
    setEditingCampaign(cmp);
    setTitle(cmp.title);
    setDescription(cmp.description);
    setCause(cmp.cause);
    setObjective(cmp.objective);
    setDonationTypesAccepted(cmp.donationTypesAccepted);
    setLocation(cmp.location);
    setStartDate(cmp.startDate);
    setEndDate(cmp.endDate);
    setTargetUnits(cmp.targetUnits || '');
    setCollectedUnits(cmp.collectedUnits || '');
    setContact(cmp.contact);
    setStatus(cmp.status);
    setIsFormOpen(true);
  };

  const toggleDonationType = (type: DonationType) => {
    setDonationTypesAccepted((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim() || !objective.trim()) {
      setErrorMsg('Please specify campaign name and objective.');
      return;
    }

    const payload = {
      title,
      description,
      cause,
      objective,
      donationTypesAccepted,
      location,
      startDate,
      endDate,
      targetUnits,
      collectedUnits,
      contact,
      status,
    };

    try {
      if (editingCampaign) {
        const res = await fetch('/api/ngo/campaigns', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingCampaign.id, ...payload }),
        });
        const data = await res.json();
        if (data.success) {
          setSuccessMsg('Campaign updated successfully.');
          fetchCampaigns();
          resetForm();
        } else {
          setErrorMsg(data.error || 'Failed to update campaign.');
        }
      } else {
        const res = await fetch('/api/ngo/campaigns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setSuccessMsg('New campaign created and published.');
          fetchCampaigns();
          resetForm();
        } else {
          setErrorMsg(data.error || 'Failed to create campaign.');
        }
      }
    } catch (err) {
      console.error('Error submitting campaign:', err);
      setErrorMsg('An error occurred. Please try again.');
    }
  };

  const handleUpdateStatus = async (cmp: NgoCampaignItem, newStatus: NgoCampaignStatus) => {
    try {
      const res = await fetch('/api/ngo/campaigns', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cmp.id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchCampaigns();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (cmpId: string) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    try {
      const res = await fetch(`/api/ngo/campaigns?id=${encodeURIComponent(cmpId)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchCampaigns();
      }
    } catch (err) {
      console.error('Failed to delete campaign:', err);
    }
  };

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
            Community Campaigns
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
            Launch structured donation and awareness drives that appear in the citizen campaign feed.
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
            <span>Create Campaign</span>
          </button>
        )}
      </div>

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
          }}
        >
          ✓ {successMsg}
        </div>
      )}

      {/* Form */}
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
              {editingCampaign ? 'Edit Campaign' : 'Launch a New Campaign'}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              style={{ background: 'none', border: 'none', fontSize: '0.875rem', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              ✕ Cancel
            </button>
          </div>

          {errorMsg && (
            <div style={{ padding: '0.65rem 0.85rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Campaign Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Har Bachha School Abhiyan"
                  required
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Cause Category *
                </label>
                <select
                  value={cause}
                  onChange={(e) => setCause(e.target.value as NgoCauseCategory)}
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
                  Target Goal / Units
                </label>
                <input
                  type="text"
                  value={targetUnits}
                  onChange={(e) => setTargetUnits(e.target.value)}
                  placeholder="e.g. 250 Learning Kits"
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as NgoCampaignStatus)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', backgroundColor: '#ffffff' }}
                >
                  <option value="Active">Active (Publicly Discoverable)</option>
                  <option value="Draft">Draft</option>
                  <option value="Paused">Paused</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                Campaign Objective *
              </label>
              <input
                type="text"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="e.g. Provide learning kits to 250 out-of-school children in East Delhi."
                required
                style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail what the campaign is aiming to solve..."
                rows={3}
                style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontFamily: 'inherit' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.4rem' }}>
                Donation Types Accepted in this Campaign
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {ALL_DONATION_TYPES.map((type) => {
                  const selected = donationTypesAccepted.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleDonationType(type)}
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
                      {selected ? '✓ ' : '+ '}{type}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Target Location / Reach
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Dwarka & Najafgarh clusters, New Delhi"
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  End Date / Deadline
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Contact Desk
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="e.g. info@ngo.org | +91 9876543210"
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
              <button
                type="button"
                onClick={() =>
                  setPreviewData({
                    title,
                    description,
                    cause,
                    objective,
                    donationTypesAccepted,
                    location,
                    endDate,
                    targetUnits,
                    contact,
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
                style={{ padding: '0.6rem 1rem', backgroundColor: 'transparent', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', cursor: 'pointer' }}
              >
                Cancel
              </button>

              <button
                type="submit"
                style={{ padding: '0.6rem 1.5rem', backgroundColor: 'var(--brand-primary)', color: '#ffffff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: '700', cursor: 'pointer' }}
              >
                {editingCampaign ? 'Save Changes' : 'Launch Campaign'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Listing */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Loading campaigns...
        </div>
      ) : campaigns.length === 0 ? (
        <div style={{ backgroundColor: '#ffffff', border: '1px dashed var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📣</div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
            No Active Campaigns Yet
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '460px', margin: '0.5rem auto 1.25rem auto' }}>
            Create structured drives with clear targets and donation requirements to rally civic participation.
          </p>
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            style={{ padding: '0.65rem 1.25rem', backgroundColor: 'var(--brand-primary)', color: '#ffffff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}
          >
            Launch Your First Campaign
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {campaigns.map((cmp) => {
            const isActive = cmp.status === 'Active';
            return (
              <div
                key={cmp.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', backgroundColor: '#f0f9ff', color: '#0284c7', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                        {cmp.cause}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: isActive ? '#dcfce7' : '#fef3c7', color: isActive ? '#15803d' : '#b45309' }}>
                        ● {cmp.status}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                      {cmp.title}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setPreviewData(cmp)}
                      style={{ padding: '0.4rem 0.65rem', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                    >
                      👁️ Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(cmp)}
                      style={{ padding: '0.4rem 0.65rem', backgroundColor: 'transparent', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                    >
                      ✏️ Edit
                    </button>
                    {isActive ? (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(cmp, 'Paused')}
                        style={{ padding: '0.4rem 0.65rem', backgroundColor: '#fef3c7', border: '1px solid #fde68a', color: '#b45309', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                      >
                        ⏸ Pause
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(cmp, 'Active')}
                        style={{ padding: '0.4rem 0.65rem', backgroundColor: '#dcfce7', border: '1px solid #bbf7d0', color: '#15803d', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                      >
                        ▶ Publish
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(cmp.id)}
                      style={{ padding: '0.4rem 0.65rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <strong>Objective:</strong> {cmp.objective}
                </div>

                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.8rem' }}>
                  {cmp.targetUnits && <div><strong>Target:</strong> {cmp.targetUnits}</div>}
                  {cmp.location && <div><strong>Location:</strong> {cmp.location}</div>}
                  {cmp.endDate && <div><strong>Deadline:</strong> {cmp.endDate}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {previewData && (
        <PublishPreviewModal
          isOpen={true}
          onClose={() => setPreviewData(null)}
          type="campaign"
          data={{ type: 'campaign', campaign: previewData }}
        />
      )}
    </div>
  );
};
