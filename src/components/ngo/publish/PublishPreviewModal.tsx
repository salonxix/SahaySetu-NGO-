'use client';

import React from 'react';
import type {
  NgoPublishProfile,
  NgoDonationNeed,
  NgoCampaignItem,
  NgoEventItem,
  NgoVolunteerOp,
} from '@/types/ngo-publish';

interface PublishPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'profile' | 'need' | 'campaign' | 'event' | 'volunteer';
  data:
    | { type: 'profile'; profile: Partial<NgoPublishProfile> }
    | { type: 'need'; need: Partial<NgoDonationNeed> }
    | { type: 'campaign'; campaign: Partial<NgoCampaignItem> }
    | { type: 'event'; event: Partial<NgoEventItem> }
    | { type: 'volunteer'; volunteer: Partial<NgoVolunteerOp> };
  onConfirmPublish?: () => void;
}

export const PublishPreviewModal: React.FC<PublishPreviewModalProps> = ({
  isOpen,
  onClose,
  data,
  onConfirmPublish,
}) => {
  if (!isOpen) return null;

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
      aria-labelledby="preview-modal-title"
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '650px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.25rem' }}>👁️</span>
            <div>
              <h3 id="preview-modal-title" style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                Citizen View Preview
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
                This is exactly how your information will appear on the public SahaySetu citizen portal.
              </p>
            </div>
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
              padding: '0.25rem',
            }}
            aria-label="Close preview"
          >
            ✕
          </button>
        </div>

        {/* Content Area */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {data.type === 'need' && (
            <div
              style={{
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: 'var(--brand-primary)',
                    backgroundColor: 'var(--bg-tint-emerald)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                  }}
                >
                  Need: {data.need.category || 'General'}
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: data.need.urgency === 'Immediate' ? '#dc2626' : 'var(--text-secondary)',
                    backgroundColor: data.need.urgency === 'Immediate' ? '#fef2f2' : 'var(--bg-subtle)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                  }}
                >
                  {data.need.urgency === 'Immediate' ? 'Urgent Need' : 'Standard Need'}
                </span>
              </div>

              <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', margin: '0.4rem 0' }}>
                {data.need.title || 'Untitled Need'}
              </h4>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0.5rem 0' }}>
                {data.need.description || 'No description provided.'}
              </p>

              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem' }}>
                <div><strong>Required Items:</strong> {data.need.itemsRequired || 'Not specified'}</div>
                {data.need.quantityNeeded && <div><strong>Quantity Target:</strong> {data.need.quantityNeeded}</div>}
                <div><strong>Location / Drop-off:</strong> {data.need.location || 'Local Centre'}</div>
                {data.need.dropoffInfo && <div><strong>Instructions:</strong> {data.need.dropoffInfo}</div>}
                {data.need.acceptsCourier && <div><strong>Courier Acceptance:</strong> Available for direct delivery</div>}
                {data.need.contactInfo && <div><strong>Contact:</strong> {data.need.contactInfo}</div>}
              </div>
            </div>
          )}

          {data.type === 'campaign' && (
            <div
              style={{
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: '#0284c7',
                    backgroundColor: '#f0f9ff',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                  }}
                >
                  Campaign: {data.campaign.cause || 'Community'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Active Drive
                </span>
              </div>

              <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', margin: '0.4rem 0' }}>
                {data.campaign.title || 'Untitled Campaign'}
              </h4>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0.5rem 0' }}>
                {data.campaign.description || 'No description provided.'}
              </p>

              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem' }}>
                <div><strong>Objective:</strong> {data.campaign.objective}</div>
                {data.campaign.targetUnits && <div><strong>Goal:</strong> {data.campaign.targetUnits}</div>}
                <div><strong>Coverage:</strong> {data.campaign.location}</div>
                {data.campaign.endDate && <div><strong>Target Date:</strong> Until {data.campaign.endDate}</div>}
                {data.campaign.contact && <div><strong>Campaign Desk:</strong> {data.campaign.contact}</div>}
              </div>
            </div>
          )}

          {data.type === 'event' && (
            <div
              style={{
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: '#7c3aed',
                    backgroundColor: '#f5f3ff',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                  }}
                >
                  {data.event.eventType || 'Event'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {data.event.participationType}
                </span>
              </div>

              <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', margin: '0.4rem 0' }}>
                {data.event.title || 'Untitled Event'}
              </h4>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0.5rem 0' }}>
                {data.event.description || 'No description provided.'}
              </p>

              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem' }}>
                <div><strong>📅 Date:</strong> {data.event.date}</div>
                <div><strong>⏰ Time:</strong> {data.event.startTime} - {data.event.endTime}</div>
                <div><strong>📍 Venue:</strong> {data.event.location}</div>
                {data.event.contactInfo && <div><strong>📞 Inquiry:</strong> {data.event.contactInfo}</div>}
              </div>
            </div>
          )}

          {data.type === 'volunteer' && (
            <div
              style={{
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: '#d97706',
                    backgroundColor: 'var(--bg-tint-amber)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                  }}
                >
                  Volunteer: {data.volunteer.cause || 'Community'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {data.volunteer.opportunityType}
                </span>
              </div>

              <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', margin: '0.4rem 0' }}>
                {data.volunteer.title || 'Volunteer Opening'}
              </h4>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0.5rem 0' }}>
                {data.volunteer.description || 'No description provided.'}
              </p>

              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem' }}>
                <div><strong>Required Skills:</strong> {(data.volunteer.requiredSkills || []).join(', ') || 'General volunteering'}</div>
                <div><strong>Location:</strong> {data.volunteer.location}</div>
                <div><strong>Schedule:</strong> {data.volunteer.dateTime} ({data.volunteer.duration})</div>
                <div><strong>Openings:</strong> {data.volunteer.volunteersRequired} volunteers needed</div>
                {data.volunteer.contact && <div><strong>Coordinator Contact:</strong> {data.volunteer.contact}</div>}
              </div>
            </div>
          )}

          {data.type === 'profile' && (
            <div
              style={{
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-tint-emerald)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--brand-primary)',
                    fontWeight: '700',
                    fontSize: '1.2rem',
                  }}
                >
                  {(data.profile.ngoName || 'N').charAt(0)}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                    {data.profile.ngoName || 'NGO Organisation'}
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Primary Cause: {data.profile.primaryCause} | {data.profile.city}, {data.profile.state}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {data.profile.about || 'No about summary set.'}
              </p>

              <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.85rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  Accepted Donations:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {(data.profile.acceptedDonationTypes || []).map((d) => (
                    <span
                      key={d}
                      style={{
                        fontSize: '0.75rem',
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-light)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                      }}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '0.85rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  Services Provided:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {(data.profile.servicesProvided || []).map((s) => (
                    <span
                      key={s}
                      style={{
                        fontSize: '0.75rem',
                        backgroundColor: 'var(--bg-tint-emerald)',
                        color: 'var(--brand-primary)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontWeight: '600',
                      }}
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            backgroundColor: '#ffffff',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.55rem 1rem',
              backgroundColor: 'transparent',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
            }}
          >
            Back to Edit
          </button>
          {onConfirmPublish && (
            <button
              type="button"
              onClick={() => {
                onConfirmPublish();
                onClose();
              }}
              style={{
                padding: '0.55rem 1.25rem',
                backgroundColor: 'var(--brand-primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Publish Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
