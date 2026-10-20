'use client';

import React, { useState, useEffect } from 'react';
import type { HelpRequest, HelpRequestStatus } from '@/types/ngo-publish';

export const NgoHelpRequestsView: React.FC = () => {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(null);
  const [responseNotes, setResponseNotes] = useState<string>('');
  const [updating, setUpdating] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ngo/help-requests');
      const data = await res.json();
      if (data?.success && Array.isArray(data.requests)) {
        setRequests(data.requests);
      }
    } catch (err) {
      console.error('Error fetching incoming help requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (reqId: string, newStatus: HelpRequestStatus, notes?: string) => {
    setUpdating(true);
    try {
      const res = await fetch('/api/ngo/help-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reqId, status: newStatus, ngoNotes: notes }),
      });
      const data = await res.json();
      if (data.success) {
        if (selectedRequest && selectedRequest.id === reqId) {
          setSelectedRequest(data.request);
        }
        fetchRequests();
      }
    } catch (err) {
      console.error('Failed to update request status:', err);
    } finally {
      setUpdating(false);
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

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
            Incoming Help Requests
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
            Assistance requests received from citizens seeking aid under your listed service categories.
          </p>
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Filter:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '0.45rem 0.75rem',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.825rem',
              backgroundColor: '#ffffff',
            }}
          >
            <option value="all">All Statuses ({requests.length})</option>
            <option value="New">New / Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Accepted">Accepted</option>
            <option value="Declined">Declined</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Privacy Notice */}
      <div
        style={{
          padding: '0.75rem 1rem',
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          color: '#1e40af',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.825rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span>🔒</span>
        <span>
          <strong>Confidentiality Notice:</strong> Citizen assistance requests are private and encrypted. Only your organisation and the citizen can view these details.
        </span>
      </div>

      {/* Listing */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Loading incoming requests...
        </div>
      ) : filteredRequests.length === 0 ? (
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px dashed var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '3rem 2rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📥</div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
            No Incoming Help Requests
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '460px', margin: '0.5rem auto 0 auto' }}>
            When citizens submit requests matching your published services (e.g. Education, Food, Medical assistance), they will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filteredRequests.map((req) => {
            const isNew = req.status === 'New';
            const isAccepted = req.status === 'Accepted';
            const isResolved = req.status === 'Resolved';
            const isDeclined = req.status === 'Declined';

            return (
              <div
                key={req.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: isNew ? '1px solid #fca5a5' : '1px solid var(--border-light)',
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
                        {req.category}
                      </span>

                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          backgroundColor:
                            isNew
                              ? '#fef2f2'
                              : isAccepted
                              ? '#dcfce7'
                              : isResolved
                              ? '#f1f5f9'
                              : isDeclined
                              ? '#fef2f2'
                              : '#fef3c7',
                          color:
                            isNew
                              ? '#b91c1c'
                              : isAccepted
                              ? '#15803d'
                              : isResolved
                              ? '#475569'
                              : isDeclined
                              ? '#991b1b'
                              : '#b45309',
                        }}
                      >
                        ● {req.status}
                      </span>

                      {req.urgency === 'Immediate' && (
                        <span style={{ fontSize: '0.725rem', fontWeight: '700', backgroundColor: '#fef2f2', color: '#b91c1c', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                          Immediate
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                      {req.needTitle}
                    </h3>
                  </div>

                  {/* Quick Action buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRequest(req);
                        setResponseNotes(req.ngoNotes || '');
                      }}
                      style={{
                        padding: '0.4rem 0.75rem',
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-medium)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      👁️ View Details
                    </button>

                    {isNew && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(req.id, 'Accepted')}
                        disabled={updating}
                        style={{
                          padding: '0.4rem 0.75rem',
                          backgroundColor: 'var(--brand-primary)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        ✓ Accept Request
                      </button>
                    )}

                    {isAccepted && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(req.id, 'Resolved')}
                        disabled={updating}
                        style={{
                          padding: '0.4rem 0.75rem',
                          backgroundColor: '#dcfce7',
                          border: '1px solid #bbf7d0',
                          color: '#15803d',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {req.needDescription}
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
                  <div><strong>Applicant:</strong> {req.citizenName}</div>
                  <div><strong>Phone:</strong> {req.citizenPhone}</div>
                  <div><strong>Location:</strong> {req.location}</div>
                  <div><strong>Timeline:</strong> {req.urgency}</div>
                </div>

                {req.ngoNotes && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--brand-primary)', backgroundColor: 'var(--bg-tint-emerald)', padding: '0.5rem 0.75rem', borderRadius: '4px' }}>
                    <strong>NGO Notes:</strong> {req.ngoNotes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {selectedRequest && (
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
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-subtle)' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                  Help Request Details
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Ref ID: {selectedRequest.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Need Title & Category
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                  {selectedRequest.needTitle}
                </div>
                <span style={{ fontSize: '0.8rem', backgroundColor: 'var(--bg-tint-emerald)', color: 'var(--brand-primary)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: '600' }}>
                  {selectedRequest.category}
                </span>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Description & Situation
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                  {selectedRequest.needDescription}
                </div>
              </div>

              {selectedRequest.itemsRequested && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Specific Items / Assistance Requested
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', marginTop: '0.25rem', fontWeight: '600' }}>
                    {selectedRequest.itemsRequested}
                  </div>
                </div>
              )}

              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-sm)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div><strong>Citizen Name:</strong> {selectedRequest.citizenName}</div>
                <div><strong>Phone Number:</strong> {selectedRequest.citizenPhone}</div>
                <div><strong>Area/District:</strong> {selectedRequest.location}</div>
                <div><strong>Urgency:</strong> {selectedRequest.urgency}</div>
                {selectedRequest.citizenEmail && <div style={{ gridColumn: 'span 2' }}><strong>Email:</strong> {selectedRequest.citizenEmail}</div>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  Internal Coordination / Response Notes:
                </label>
                <textarea
                  value={responseNotes}
                  onChange={(e) => setResponseNotes(e.target.value)}
                  placeholder="Record call notes, scheduled delivery time, or resolution remarks..."
                  rows={3}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff', flexWrap: 'wrap', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                style={{ padding: '0.55rem 1rem', backgroundColor: 'transparent', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Close
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedRequest.id, 'Declined', responseNotes)}
                  disabled={updating}
                  style={{ padding: '0.55rem 0.85rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}
                >
                  Decline
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedRequest.id, 'Under Review', responseNotes)}
                  disabled={updating}
                  style={{ padding: '0.55rem 0.85rem', backgroundColor: '#fef3c7', border: '1px solid #fde68a', color: '#b45309', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}
                >
                  Under Review
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedRequest.id, 'Accepted', responseNotes)}
                  disabled={updating}
                  style={{ padding: '0.55rem 1rem', backgroundColor: 'var(--brand-primary)', color: '#ffffff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' }}
                >
                  Accept & Save
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedRequest.id, 'Resolved', responseNotes)}
                  disabled={updating}
                  style={{ padding: '0.55rem 1rem', backgroundColor: '#15803d', color: '#ffffff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' }}
                >
                  ✓ Mark Resolved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
