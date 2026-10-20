'use client';

import React, { useState, useEffect } from 'react';
import type { PublicNgoOrg, NeedStatus } from '@/types/user-portal';
import { formatDistance } from '@/lib/user/distance';

interface NgoPublicProfileModalProps {
  ngo: PublicNgoOrg | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (ngoId: string) => void;
  onGetDirections: (ngo: PublicNgoOrg) => void;
  onRequestHelp?: (ngo: PublicNgoOrg) => void;
}

type ProfileTab = 'needs' | 'campaigns' | 'events' | 'volunteer' | 'contact';

export const NgoPublicProfileModal: React.FC<NgoPublicProfileModalProps> = ({
  ngo,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
  onGetDirections,
  onRequestHelp,
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('needs');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !ngo) return null;

  const distanceKm = ngo.distanceKm ?? 0;
  const volunteerOps = ngo.volunteerOpportunities || [];
  const services = ngo.servicesProvided || [];

  const getNeedStatusBadge = (status: NeedStatus) => {
    switch (status) {
      case 'Accepting':
        return { bg: 'var(--bg-tint-emerald)', color: 'var(--brand-primary)', label: 'Accepting Contributions', icon: '✓' };
      case 'Paused':
        return { bg: 'var(--bg-tint-amber)', color: 'var(--brand-accent)', label: 'Temporarily Paused', icon: '⏸' };
      case 'Fulfilled':
      default:
        return { bg: 'var(--bg-subtle)', color: 'var(--text-muted)', label: 'Target Fulfilled', icon: '✓' };
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ngo-profile-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(15, 36, 29, 0.65)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          maxWidth: '780px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid var(--border-light)',
          overflow: 'hidden',
        }}
      >
        {/* Modal Top Header */}
        <div
          style={{
            padding: '1.5rem 1.75rem 1rem 1.75rem',
            borderBottom: '1px solid var(--border-light)',
            backgroundColor: 'var(--bg-canvas)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: 'var(--brand-accent)',
                    backgroundColor: 'var(--bg-tint-amber)',
                    padding: '0.15rem 0.55rem',
                    borderRadius: '9999px',
                  }}
                >
                  📍 {formatDistance(distanceKm)} away
                </span>
                {ngo.verified && (
                  <span className="badge-tag badge-emerald" style={{ fontSize: '0.7rem' }}>
                    ✓ NITI Aayog Darpan Verified
                  </span>
                )}
                {ngo.registrationNumber && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    Reg: {ngo.registrationNumber}
                  </span>
                )}
              </div>

              <h2
                id="ngo-profile-title"
                style={{
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  marginBottom: '0.2rem',
                }}
              >
                {ngo.name}
              </h2>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                📍 {ngo.address}, {ngo.city}, {ngo.state} - {ngo.pincode}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {onRequestHelp && services.length > 0 && (
                <button
                  type="button"
                  onClick={() => onRequestHelp(ngo)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    backgroundColor: 'var(--brand-accent)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  🆘 Request Help
                </button>
              )}

              <button
                type="button"
                onClick={() => onToggleSave(ngo.id)}
                className="btn-civic btn-civic-secondary"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
              >
                {isSaved ? '★ Saved' : '☆ Save Org'}
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close organization modal"
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.25rem',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.25rem',
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Modal Navigation Tabs */}
          <div
            role="tablist"
            style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '1.25rem',
              borderBottom: '1px solid var(--border-light)',
              overflowX: 'auto',
            }}
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'needs'}
              onClick={() => setActiveTab('needs')}
              style={{
                padding: '0.5rem 0',
                border: 'none',
                background: 'none',
                fontSize: '0.9rem',
                fontWeight: activeTab === 'needs' ? '700' : '500',
                color: activeTab === 'needs' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'needs' ? '3px solid var(--brand-primary)' : '3px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              📦 Current Needs ({ngo.currentNeeds.length})
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'campaigns'}
              onClick={() => setActiveTab('campaigns')}
              style={{
                padding: '0.5rem 0',
                border: 'none',
                background: 'none',
                fontSize: '0.9rem',
                fontWeight: activeTab === 'campaigns' ? '700' : '500',
                color: activeTab === 'campaigns' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'campaigns' ? '3px solid var(--brand-primary)' : '3px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              📢 Campaigns ({ngo.activeCampaigns.length})
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'events'}
              onClick={() => setActiveTab('events')}
              style={{
                padding: '0.5rem 0',
                border: 'none',
                background: 'none',
                fontSize: '0.9rem',
                fontWeight: activeTab === 'events' ? '700' : '500',
                color: activeTab === 'events' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'events' ? '3px solid var(--brand-primary)' : '3px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              📅 Events ({ngo.upcomingEvents.length})
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'volunteer'}
              onClick={() => setActiveTab('volunteer')}
              style={{
                padding: '0.5rem 0',
                border: 'none',
                background: 'none',
                fontSize: '0.9rem',
                fontWeight: activeTab === 'volunteer' ? '700' : '500',
                color: activeTab === 'volunteer' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'volunteer' ? '3px solid var(--brand-primary)' : '3px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              🙋 Volunteer ({volunteerOps.length})
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'contact'}
              onClick={() => setActiveTab('contact')}
              style={{
                padding: '0.5rem 0',
                border: 'none',
                background: 'none',
                fontSize: '0.9rem',
                fontWeight: activeTab === 'contact' ? '700' : '500',
                color: activeTab === 'contact' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'contact' ? '3px solid var(--brand-primary)' : '3px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              📞 Services & Contact
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div style={{ padding: '1.75rem', overflowY: 'auto', flex: 1 }}>
          {/* Tab 1: Current Needs */}
          {activeTab === 'needs' && (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  Statutory Published Needs Checklist
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Verified items this organisation is actively seeking. Please review drop-off guidelines before visiting.
                </p>
              </div>

              {ngo.currentNeeds.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--bg-canvas)', borderRadius: 'var(--radius-sm)' }}>
                  No active donation needs listed right now.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {ngo.currentNeeds.map((need) => {
                    const badge = getNeedStatusBadge(need.status);
                    return (
                      <div
                        key={need.id}
                        style={{
                          border: '1px solid var(--border-light)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '1.25rem',
                          backgroundColor: 'var(--bg-canvas)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <div>
                            <span
                              style={{
                                fontSize: '0.725rem',
                                fontWeight: '600',
                                color: 'var(--text-muted)',
                                textTransform: 'uppercase',
                                display: 'block',
                                marginBottom: '0.2rem',
                              }}
                            >
                              Category: {need.category}
                            </span>
                            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                              {need.item}
                            </h4>
                          </div>

                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              backgroundColor: badge.bg,
                              color: badge.color,
                              padding: '0.2rem 0.6rem',
                              borderRadius: '9999px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            <span>{badge.icon}</span> {badge.label}
                          </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', fontSize: '0.85rem', margin: '0.75rem 0', backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-light)' }}>
                          <div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Target Quantity</span>
                            <strong>{need.quantityNeeded}</strong>
                          </div>
                          {need.quantityCollected && (
                            <div>
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Received So Far</span>
                              <strong style={{ color: 'var(--brand-primary)' }}>{need.quantityCollected}</strong>
                            </div>
                          )}
                          {need.closingDate && (
                            <div>
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Closing Date</span>
                              <strong>{need.closingDate}</strong>
                            </div>
                          )}
                        </div>

                        {need.dropoffInstructions && (
                          <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                            <strong>📍 Drop-off Instructions:</strong> {need.dropoffInstructions}
                          </div>
                        )}

                        {need.acceptsCourier && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--brand-primary)', marginTop: '0.35rem', fontWeight: '500' }}>
                            ✓ Accepts postal/courier packages at registered address
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Campaigns */}
          {activeTab === 'campaigns' && (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  Current Community Campaigns
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Focused outreach missions addressing urgent community challenges.
                </p>
              </div>

              {ngo.activeCampaigns.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--bg-canvas)', borderRadius: 'var(--radius-sm)' }}>
                  No active public campaigns at this moment.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {ngo.activeCampaigns.map((camp) => (
                    <div
                      key={camp.id}
                      style={{
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '1.25rem',
                        backgroundColor: 'var(--bg-canvas)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <span className="badge-tag badge-blue" style={{ fontSize: '0.7rem' }}>
                          {camp.cause}
                        </span>
                        {camp.deadline && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Target Date: {camp.deadline}
                          </span>
                        )}
                      </div>

                      <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                        {camp.title}
                      </h4>

                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '0.75rem' }}>
                        {camp.description}
                      </p>

                      <div style={{ backgroundColor: '#ffffff', padding: '0.75rem 1rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <div>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Campaign Target</span>
                          <strong>{camp.targetAmountOrUnits}</strong>
                        </div>
                        {camp.collectedAmountOrUnits && (
                          <div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Progress</span>
                            <strong style={{ color: 'var(--brand-primary)' }}>{camp.collectedAmountOrUnits}</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Events */}
          {activeTab === 'events' && (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  Upcoming Drives & Events
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  In-person donation collection camps and volunteer opportunities.
                </p>
              </div>

              {ngo.upcomingEvents.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--bg-canvas)', borderRadius: 'var(--radius-sm)' }}>
                  No upcoming events scheduled right now.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {ngo.upcomingEvents.map((evt) => (
                    <div
                      key={evt.id}
                      style={{
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '1.25rem',
                        backgroundColor: 'var(--bg-canvas)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <span className="badge-tag badge-emerald" style={{ fontSize: '0.7rem' }}>
                          {evt.eventType}
                        </span>
                        <span style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--brand-primary)' }}>
                          📅 {evt.date} • {evt.time}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                        {evt.title}
                      </h4>

                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                        {evt.description}
                      </p>

                      <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        <strong>📍 Venue:</strong> {evt.venue}
                      </div>

                      <div style={{ fontSize: '0.825rem', color: 'var(--brand-accent)', fontWeight: '600' }}>
                        👉 How to Participate: {evt.participationAction}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Volunteer Opportunities */}
          {activeTab === 'volunteer' && (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  Volunteer Opportunities
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Join as a volunteer and contribute your time, skills, and effort.
                </p>
              </div>

              {volunteerOps.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--bg-canvas)', borderRadius: 'var(--radius-sm)' }}>
                  No open volunteer opportunities listed right now.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {volunteerOps.map((op) => (
                    <div
                      key={op.id}
                      style={{
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '1.25rem',
                        backgroundColor: 'var(--bg-canvas)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#d97706', backgroundColor: 'var(--bg-tint-amber)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                          {op.cause}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {op.opportunityType}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                        {op.title}
                      </h4>

                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                        {op.description}
                      </p>

                      <div style={{ backgroundColor: '#ffffff', padding: '0.75rem 1rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-light)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.5rem', fontSize: '0.825rem' }}>
                        <div><strong>Required Skills:</strong> {(op.requiredSkills || []).join(', ')}</div>
                        <div><strong>Schedule:</strong> {op.dateTime}</div>
                        <div><strong>Duration:</strong> {op.duration}</div>
                        <div><strong>Openings:</strong> {op.volunteersRequired} needed</div>
                      </div>

                      {op.contact && (
                        <div style={{ fontSize: '0.825rem', color: 'var(--brand-primary)', marginTop: '0.5rem', fontWeight: '600' }}>
                          ✉️ Volunteer Desk: {op.contact}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Services & Contact */}
          {activeTab === 'contact' && (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  Help Services & Contact Channels
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Assistance provided by this organisation and direct contact information.
                </p>
              </div>

              {/* Services Provided Section */}
              {services.length > 0 && (
                <div style={{ marginBottom: '1.5rem', backgroundColor: 'var(--bg-tint-emerald)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(22, 101, 52, 0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--brand-primary)', margin: 0 }}>
                        Direct Assistance Services Provided
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
                        Citizens in need can request support under these categories.
                      </p>
                    </div>

                    {onRequestHelp && (
                      <button
                        type="button"
                        onClick={() => onRequestHelp(ngo)}
                        style={{
                          padding: '0.45rem 1rem',
                          backgroundColor: 'var(--brand-primary)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.825rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                        }}
                      >
                        Request Assistance
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {services.map((srv) => (
                      <span
                        key={srv}
                        style={{
                          fontSize: '0.8rem',
                          backgroundColor: '#ffffff',
                          color: 'var(--brand-primary)',
                          border: '1px solid rgba(22, 101, 52, 0.3)',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '9999px',
                          fontWeight: '600',
                        }}
                      >
                        ✓ {srv}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Helpline / Coordinator Phone</span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{ngo.phone}</strong>
                </div>

                <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Official Email</span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{ngo.email}</strong>
                </div>

                {ngo.website && (
                  <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Official Website</span>
                    <a
                      href={ngo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.95rem', color: 'var(--brand-primary)', textDecoration: 'underline' }}
                    >
                      {ngo.website.replace('https://', '')}
                    </a>
                  </div>
                )}

                {ngo.operatingHours && (
                  <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Operating / Drop-off Hours</span>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{ngo.operatingHours}</strong>
                  </div>
                )}
              </div>

              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.4rem' }}>
                  📍 Physical Facility & Drop-off Address
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  {ngo.name}<br />
                  {ngo.address}<br />
                  {ngo.city}, {ngo.state} - {ngo.pincode}
                </p>

                <button
                  type="button"
                  onClick={() => onGetDirections(ngo)}
                  className="btn-civic btn-civic-primary"
                  style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                >
                  🧭 Get Step-by-Step Directions
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div
          style={{
            padding: '1rem 1.75rem',
            borderTop: '1px solid var(--border-light)',
            backgroundColor: 'var(--bg-canvas)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            🌱 Supporting grassroots empowerment across India
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              type="button"
              onClick={() => onGetDirections(ngo)}
              className="btn-civic btn-civic-secondary"
              style={{ fontSize: '0.85rem', padding: '0.45rem 0.9rem' }}
            >
              🧭 Get Directions
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-civic btn-civic-primary"
              style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
