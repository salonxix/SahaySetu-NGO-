'use client';

import React, { useState, useEffect } from 'react';
import type { NgoVolunteerOp, NgoVolunteerOpStatus } from '@/types/ngo-publish';
import type { NgoCauseCategory } from '@/types/user-portal';
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

export const NgoVolunteerOpsView: React.FC = () => {
  const [volunteerOps, setVolunteerOps] = useState<NgoVolunteerOp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingOp, setEditingOp] = useState<NgoVolunteerOp | null>(null);
  const [previewData, setPreviewData] = useState<Partial<NgoVolunteerOp> | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requiredSkillsInput, setRequiredSkillsInput] = useState('Teaching, Mentoring');
  const [cause, setCause] = useState<NgoCauseCategory>('Education');
  const [location, setLocation] = useState('');
  const [dateTime, setDateTime] = useState('Saturdays & Sundays, 10:00 AM - 12:30 PM');
  const [duration, setDuration] = useState('3 months (2.5 hrs/week)');
  const [volunteersRequired, setVolunteersRequired] = useState('5');
  const [volunteersEnrolled, setVolunteersEnrolled] = useState('0');
  const [opportunityType, setOpportunityType] = useState<'One-time' | 'Recurring'>('Recurring');
  const [contact, setContact] = useState('');
  const [status, setStatus] = useState<NgoVolunteerOpStatus>('Active');

  const fetchVolunteerOps = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ngo/volunteer-ops');
      const data = await res.json();
      if (data?.success && Array.isArray(data.volunteerOps)) {
        setVolunteerOps(data.volunteerOps);
      }
    } catch (err) {
      console.error('Error fetching volunteer opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteerOps();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setRequiredSkillsInput('Teaching, Mentoring');
    setCause('Education');
    setLocation('');
    setDateTime('Saturdays & Sundays, 10:00 AM - 12:30 PM');
    setDuration('3 months (2.5 hrs/week)');
    setVolunteersRequired('5');
    setVolunteersEnrolled('0');
    setOpportunityType('Recurring');
    setContact('');
    setStatus('Active');
    setEditingOp(null);
    setIsFormOpen(false);
  };

  const handleOpenEdit = (op: NgoVolunteerOp) => {
    setEditingOp(op);
    setTitle(op.title);
    setDescription(op.description);
    setRequiredSkillsInput((op.requiredSkills || []).join(', '));
    setCause(op.cause);
    setLocation(op.location);
    setDateTime(op.dateTime);
    setDuration(op.duration);
    setVolunteersRequired(String(op.volunteersRequired));
    setVolunteersEnrolled(String(op.volunteersEnrolled || 0));
    setOpportunityType(op.opportunityType);
    setContact(op.contact);
    setStatus(op.status);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim() || !location.trim()) {
      setErrorMsg('Please specify title and location.');
      return;
    }

    const skillsArray = requiredSkillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload = {
      title,
      description,
      requiredSkills: skillsArray,
      cause,
      location,
      dateTime,
      duration,
      volunteersRequired: Number(volunteersRequired) || 1,
      volunteersEnrolled: Number(volunteersEnrolled) || 0,
      opportunityType,
      contact,
      status,
    };

    try {
      if (editingOp) {
        const res = await fetch('/api/ngo/volunteer-ops', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingOp.id, ...payload }),
        });
        const data = await res.json();
        if (data.success) {
          setSuccessMsg('Volunteer opportunity updated.');
          fetchVolunteerOps();
          resetForm();
        } else {
          setErrorMsg(data.error || 'Failed to update opportunity.');
        }
      } else {
        const res = await fetch('/api/ngo/volunteer-ops', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setSuccessMsg('New volunteer opportunity published.');
          fetchVolunteerOps();
          resetForm();
        } else {
          setErrorMsg(data.error || 'Failed to create opportunity.');
        }
      }
    } catch (err) {
      console.error('Error submitting volunteer op:', err);
      setErrorMsg('An error occurred. Please try again.');
    }
  };

  const handleUpdateStatus = async (op: NgoVolunteerOp, newStatus: NgoVolunteerOpStatus) => {
    try {
      const res = await fetch('/api/ngo/volunteer-ops', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: op.id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchVolunteerOps();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (opId: string) => {
    if (!window.confirm('Are you sure you want to delete this volunteer opportunity?')) return;
    try {
      const res = await fetch(`/api/ngo/volunteer-ops?id=${encodeURIComponent(opId)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchVolunteerOps();
      }
    } catch (err) {
      console.error('Failed to delete volunteer op:', err);
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
            Volunteer Opportunities
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
            Publish specific volunteer roles and skills needed to match with civic volunteers.
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
            <span>Post Opportunity</span>
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
              {editingOp ? 'Edit Volunteer Opportunity' : 'Post a Volunteer Opening'}
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
                  Opportunity Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Weekend Teaching Volunteer"
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
                  Engagement Mode
                </label>
                <select
                  value={opportunityType}
                  onChange={(e) => setOpportunityType(e.target.value as 'One-time' | 'Recurring')}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', backgroundColor: '#ffffff' }}
                >
                  <option value="Recurring">Recurring (Weekly/Monthly)</option>
                  <option value="One-time">One-time Activity</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Volunteers Needed (Quota)
                </label>
                <input
                  type="number"
                  value={volunteersRequired}
                  onChange={(e) => setVolunteersRequired(e.target.value)}
                  min={1}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                Required Skills (Comma separated) *
              </label>
              <input
                type="text"
                value={requiredSkillsInput}
                onChange={(e) => setRequiredSkillsInput(e.target.value)}
                placeholder="e.g. Teaching, Hindi Fluency, Science, Child Care"
                required
                style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                Description & Responsibilities
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what the volunteer will be doing, expectations, and orientation details..."
                rows={3}
                style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Location / Centre *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Sector 12 Learning Centre, Dwarka"
                  required
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Schedule / Timing
                </label>
                <input
                  type="text"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  placeholder="e.g. Saturdays & Sundays, 10:00 AM - 12:30 PM"
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Expected Duration
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 3 months (2.5 hrs/week)"
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Coordinator Contact
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="e.g. volunteer@ngo.org"
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
                    requiredSkills: requiredSkillsInput.split(',').map((s) => s.trim()),
                    cause,
                    location,
                    dateTime,
                    duration,
                    volunteersRequired: Number(volunteersRequired) || 1,
                    opportunityType,
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
                {editingOp ? 'Save Changes' : 'Post Opportunity'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Listing */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Loading volunteer opportunities...
        </div>
      ) : volunteerOps.length === 0 ? (
        <div style={{ backgroundColor: '#ffffff', border: '1px dashed var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🙋</div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
            No Volunteer Opportunities Open Yet
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '460px', margin: '0.5rem auto 1.25rem auto' }}>
            List specific volunteering roles (teaching, medical camp assistance, field survey, logistics) to invite civic involvement.
          </p>
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            style={{ padding: '0.65rem 1.25rem', backgroundColor: 'var(--brand-primary)', color: '#ffffff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}
          >
            Post Your First Opportunity
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {volunteerOps.map((op) => {
            const isActive = op.status === 'Active';
            return (
              <div
                key={op.id}
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
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', backgroundColor: 'var(--bg-tint-amber)', color: '#d97706', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                        {op.cause}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: isActive ? '#dcfce7' : '#fef3c7', color: isActive ? '#15803d' : '#b45309' }}>
                        ● {op.status}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {op.opportunityType}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                      {op.title}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setPreviewData(op)}
                      style={{ padding: '0.4rem 0.65rem', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                    >
                      👁️ Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(op)}
                      style={{ padding: '0.4rem 0.65rem', backgroundColor: 'transparent', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                    >
                      ✏️ Edit
                    </button>
                    {isActive ? (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(op, 'Paused')}
                        style={{ padding: '0.4rem 0.65rem', backgroundColor: '#fef3c7', border: '1px solid #fde68a', color: '#b45309', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                      >
                        ⏸ Pause
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(op, 'Active')}
                        style={{ padding: '0.4rem 0.65rem', backgroundColor: '#dcfce7', border: '1px solid #bbf7d0', color: '#15803d', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                      >
                        ▶ Publish
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(op.id)}
                      style={{ padding: '0.4rem 0.65rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {op.description}
                </div>

                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.8rem' }}>
                  <div><strong>Skills:</strong> {(op.requiredSkills || []).join(', ')}</div>
                  <div><strong>Schedule:</strong> {op.dateTime}</div>
                  <div><strong>Duration:</strong> {op.duration}</div>
                  <div><strong>Volunteers Needed:</strong> {op.volunteersRequired}</div>
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
          type="volunteer"
          data={{ type: 'volunteer', volunteer: previewData }}
        />
      )}
    </div>
  );
};
