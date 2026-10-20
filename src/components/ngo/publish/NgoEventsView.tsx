'use client';

import React, { useState, useEffect } from 'react';
import type { NgoEventItem, NgoEventStatus } from '@/types/ngo-publish';
import { PublishPreviewModal } from './PublishPreviewModal';

const EVENT_TYPES: NgoEventItem['eventType'][] = [
  'Donation Drive',
  'Medical Camp',
  'Volunteer Activity',
  'Educational Workshop',
  'Awareness Event',
  'Community Event',
];

export const NgoEventsView: React.FC = () => {
  const [events, setEvents] = useState<NgoEventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<NgoEventItem | null>(null);
  const [previewData, setPreviewData] = useState<Partial<NgoEventItem> | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('02:00 PM');
  const [location, setLocation] = useState('');
  const [eventType, setEventType] = useState<NgoEventItem['eventType']>('Donation Drive');
  const [participationType, setParticipationType] = useState<NgoEventItem['participationType']>('Open to All');
  const [contactInfo, setContactInfo] = useState('');
  const [status, setStatus] = useState<NgoEventStatus>('Active');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ngo/events');
      const data = await res.json();
      if (data?.success && Array.isArray(data.events)) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setStartTime('10:00 AM');
    setEndTime('02:00 PM');
    setLocation('');
    setEventType('Donation Drive');
    setParticipationType('Open to All');
    setContactInfo('');
    setStatus('Active');
    setEditingEvent(null);
    setIsFormOpen(false);
  };

  const handleOpenEdit = (evt: NgoEventItem) => {
    setEditingEvent(evt);
    setTitle(evt.title);
    setDescription(evt.description);
    setDate(evt.date);
    setStartTime(evt.startTime);
    setEndTime(evt.endTime);
    setLocation(evt.location);
    setEventType(evt.eventType);
    setParticipationType(evt.participationType);
    setContactInfo(evt.contactInfo);
    setStatus(evt.status);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim() || !date.trim() || !location.trim()) {
      setErrorMsg('Please specify event title, date, and venue location.');
      return;
    }

    const payload = {
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      eventType,
      participationType,
      contactInfo,
      status,
    };

    try {
      if (editingEvent) {
        const res = await fetch('/api/ngo/events', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingEvent.id, ...payload }),
        });
        const data = await res.json();
        if (data.success) {
          setSuccessMsg('Event updated successfully.');
          fetchEvents();
          resetForm();
        } else {
          setErrorMsg(data.error || 'Failed to update event.');
        }
      } else {
        const res = await fetch('/api/ngo/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setSuccessMsg('New event scheduled and published.');
          fetchEvents();
          resetForm();
        } else {
          setErrorMsg(data.error || 'Failed to create event.');
        }
      }
    } catch (err) {
      console.error('Error submitting event:', err);
      setErrorMsg('An error occurred. Please try again.');
    }
  };

  const handleUpdateStatus = async (evt: NgoEventItem, newStatus: NgoEventStatus) => {
    try {
      const res = await fetch('/api/ngo/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: evt.id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchEvents();
      }
    } catch (err) {
      console.error('Failed to update event status:', err);
    }
  };

  const handleDelete = async (evtId: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`/api/ngo/events?id=${encodeURIComponent(evtId)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchEvents();
      }
    } catch (err) {
      console.error('Failed to delete event:', err);
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
            Community Events & Drives
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
            Schedule donation camps, volunteer workshops, and outreach events visible to nearby citizens.
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
            <span>Create Event</span>
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
              {editingEvent ? 'Edit Event' : 'Schedule a New Community Event'}
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
                  Event Name *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mega Book & Stationery Collection Camp"
                  required
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Event Type *
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as NgoEventItem['eventType'])}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', backgroundColor: '#ffffff' }}
                >
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Date *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Participation Mode
                </label>
                <select
                  value={participationType}
                  onChange={(e) => setParticipationType(e.target.value as NgoEventItem['participationType'])}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', backgroundColor: '#ffffff' }}
                >
                  <option value="Open to All">Open to All (Walk-in)</option>
                  <option value="Registration Required">Registration Required</option>
                  <option value="Invitation Only">Invitation Only</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Start Time
                </label>
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="e.g. 10:00 AM"
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  End Time
                </label>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="e.g. 04:00 PM"
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as NgoEventStatus)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', backgroundColor: '#ffffff' }}
                >
                  <option value="Active">Published (Active)</option>
                  <option value="Draft">Draft</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                Location / Venue *
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Community Hall, Sector 12, Dwarka, New Delhi"
                required
                style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                Event Description & Instructions
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what will happen, what attendees should bring, and volunteer instructions..."
                rows={3}
                style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontFamily: 'inherit' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                Inquiry Contact Info
              </label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="e.g. Call +91 9876543210 or email info@gramvikas.org"
                style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
              <button
                type="button"
                onClick={() =>
                  setPreviewData({
                    title,
                    description,
                    date,
                    startTime,
                    endTime,
                    location,
                    eventType,
                    participationType,
                    contactInfo,
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
                {editingEvent ? 'Save Changes' : 'Schedule Event'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Listing */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Loading events...
        </div>
      ) : events.length === 0 ? (
        <div style={{ backgroundColor: '#ffffff', border: '1px dashed var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📅</div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
            No Scheduled Events Yet
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '460px', margin: '0.5rem auto 1.25rem auto' }}>
            Schedule donation drop-off days, health camps, or volunteer activities to engage the local community.
          </p>
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            style={{ padding: '0.65rem 1.25rem', backgroundColor: 'var(--brand-primary)', color: '#ffffff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}
          >
            Schedule Your First Event
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {events.map((evt) => {
            const isActive = evt.status === 'Active';
            return (
              <div
                key={evt.id}
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
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', backgroundColor: '#f5f3ff', color: '#7c3aed', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                        {evt.eventType}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: isActive ? '#dcfce7' : '#fef3c7', color: isActive ? '#15803d' : '#b45309' }}>
                        ● {evt.status}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                      {evt.title}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setPreviewData(evt)}
                      style={{ padding: '0.4rem 0.65rem', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                    >
                      👁️ Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(evt)}
                      style={{ padding: '0.4rem 0.65rem', backgroundColor: 'transparent', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                    >
                      ✏️ Edit
                    </button>
                    {isActive ? (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(evt, 'Cancelled')}
                        style={{ padding: '0.4rem 0.65rem', backgroundColor: '#fef3c7', border: '1px solid #fde68a', color: '#b45309', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(evt, 'Active')}
                        style={{ padding: '0.4rem 0.65rem', backgroundColor: '#dcfce7', border: '1px solid #bbf7d0', color: '#15803d', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                      >
                        ▶ Publish
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(evt.id)}
                      style={{ padding: '0.4rem 0.65rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {evt.description}
                </div>

                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.8rem' }}>
                  <div><strong>📅 Date:</strong> {evt.date}</div>
                  <div><strong>⏰ Time:</strong> {evt.startTime} - {evt.endTime}</div>
                  <div><strong>📍 Venue:</strong> {evt.location}</div>
                  <div><strong>Mode:</strong> {evt.participationType}</div>
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
          type="event"
          data={{ type: 'event', event: previewData }}
        />
      )}
    </div>
  );
};
