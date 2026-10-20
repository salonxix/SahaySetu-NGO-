'use client';

import React, { useState, useEffect } from 'react';
import type { HelpRequest } from '@/types/ngo-publish';

interface MyHelpRequestsViewProps {
  onNavigateToExplore: () => void;
}

export const MyHelpRequestsView: React.FC<MyHelpRequestsViewProps> = ({ onNavigateToExplore }) => {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/help-requests');
      const data = await res.json();
      if (data?.success && Array.isArray(data.requests)) {
        setRequests(data.requests);
      }
    } catch (err) {
      console.error('Error fetching user help requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
          My Assistance Requests
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
          Track the live review status and coordinator responses for requests you have submitted.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Loading your assistance requests...
        </div>
      ) : requests.length === 0 ? (
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px dashed var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '3rem 2rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📋</div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
            No Submitted Requests Yet
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0.5rem auto 1.25rem auto' }}>
            When you request assistance from a nearby non-profit under &quot;I Need Help&quot;, you can track their response and coordination progress here.
          </p>
          <button
            type="button"
            onClick={onNavigateToExplore}
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
            Find Nearby Support
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {requests.map((req) => {
            const isNew = req.status === 'New';
            const isAccepted = req.status === 'Accepted';
            const isResolved = req.status === 'Resolved';
            const isDeclined = req.status === 'Declined';

            return (
              <div
                key={req.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
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
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                      {req.needTitle}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      Submitted to: <strong>{req.ngoName || 'NGO Partner'}</strong>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {req.needDescription}
                </p>

                {req.ngoNotes && (
                  <div
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'var(--bg-tint-emerald)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(22, 101, 52, 0.2)',
                      fontSize: '0.825rem',
                      color: '#14532d',
                    }}
                  >
                    <strong>Message from NGO:</strong> {req.ngoNotes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
