'use client';

import React, { useState, useEffect } from 'react';
import type { Scheme, NgoApplication, ApplicationFormData } from '@/types/ngo';
import type { NgoUser } from '@/types/auth';
import { evaluateSchemeEligibility } from '@/lib/ngo/eligibility-matcher';

interface ApplicationWizardModalProps {
  scheme: Scheme | null;
  ngoUser: NgoUser | null;
  isOpen: boolean;
  existingDraft?: NgoApplication | null;
  onClose: () => void;
  onSubmitApplication: (app: NgoApplication) => void;
  onSaveDraft: (app: NgoApplication) => void;
  onNavigateToApplications: () => void;
}

const STEP_LABELS = [
  'Overview',
  'Organisation',
  'Eligibility',
  'Project Information',
  'Statutory Documents',
  'Review & Verify',
  'Confirmation',
];

export const ApplicationWizardModal: React.FC<ApplicationWizardModalProps> = ({
  scheme,
  ngoUser,
  isOpen,
  existingDraft = null,
  onClose,
  onSubmitApplication,
  onSaveDraft,
  onNavigateToApplications,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<ApplicationFormData>({
    signatoryDesignation: 'Executive Coordinator / Secretary',
    alternatePhone: '',
    eligibilityAcknowledged: true,
    projectTitle: '',
    beneficiaryGroup: '',
    targetBeneficiaryCount: '',
    targetDistrict: '',
    projectSummary: '',
    expectedOutcomes: '',
    budgetRequested: '',
    readyDocuments: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<NgoApplication | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize from draft or scheme defaults when modal opens
  useEffect(() => {
    if (isOpen && scheme) {
      if (existingDraft && existingDraft.formData) {
        setFormData(existingDraft.formData);
        setCurrentStep(existingDraft.formData.savedStep || 1);
      } else {
        setFormData({
          signatoryDesignation: 'Executive Coordinator / Secretary',
          alternatePhone: '',
          eligibilityAcknowledged: true,
          projectTitle: `${scheme.name} - Grassroots Implementation Proposal`,
          beneficiaryGroup: scheme.targetBeneficiaries[0] || 'Community Members',
          targetBeneficiaryCount: '150',
          targetDistrict: ngoUser?.city ? `${ngoUser.city}, ${ngoUser.state || ''}` : '',
          projectSummary: `Grassroots welfare and support initiative aligned with ${scheme.department} guidelines, targeting ${scheme.targetBeneficiaries.join(', ')}.`,
          expectedOutcomes: 'Direct provision of essential learning and livelihood kits, continuous milestone tracking, and monthly beneficiary progress reporting.',
          budgetRequested: '450000',
          readyDocuments: scheme.requiredDocuments.slice(0, 2), // Pre-mark initial verified docs
        });
        setCurrentStep(0);
      }
      setErrors({});
      setSubmittedApp(null);
      setHasUnsavedChanges(false);
    }
  }, [isOpen, scheme, existingDraft, ngoUser]);

  if (!isOpen || !scheme) return null;

  const evaluation = evaluateSchemeEligibility(ngoUser, scheme);

  const handleInputChange = (field: keyof ApplicationFormData, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const toggleDocument = (docName: string) => {
    setFormData((prev) => {
      const exists = prev.readyDocuments.includes(docName);
      const nextDocs = exists
        ? prev.readyDocuments.filter((d) => d !== docName)
        : [...prev.readyDocuments, docName];
      return { ...prev, readyDocuments: nextDocs };
    });
    setHasUnsavedChanges(true);
  };

  const validateStep3 = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.projectTitle.trim()) {
      errs.projectTitle = 'Project proposal title is required.';
    } else if (formData.projectTitle.trim().length < 5) {
      errs.projectTitle = 'Project title must be at least 5 characters.';
    }

    if (!formData.beneficiaryGroup.trim()) {
      errs.beneficiaryGroup = 'Please select or specify a target beneficiary group.';
    }

    if (!formData.targetBeneficiaryCount.trim()) {
      errs.targetBeneficiaryCount = 'Target beneficiary count is required.';
    } else if (isNaN(Number(formData.targetBeneficiaryCount)) || Number(formData.targetBeneficiaryCount) <= 0) {
      errs.targetBeneficiaryCount = 'Please enter a valid positive number of beneficiaries.';
    }

    if (!formData.targetDistrict.trim()) {
      errs.targetDistrict = 'Implementation district / area is required.';
    }

    if (!formData.projectSummary.trim()) {
      errs.projectSummary = 'Project summary and scope description is required.';
    } else if (formData.projectSummary.trim().length < 15) {
      errs.projectSummary = 'Please provide a detailed summary (at least 15 characters).';
    }

    if (!formData.expectedOutcomes.trim()) {
      errs.expectedOutcomes = 'Expected key outcomes and deliverables are required.';
    } else if (formData.expectedOutcomes.trim().length < 10) {
      errs.expectedOutcomes = 'Please outline key deliverables (at least 10 characters).';
    }

    if (!formData.budgetRequested.trim()) {
      errs.budgetRequested = 'Estimated budget / requested grant amount is required.';
    } else if (isNaN(Number(formData.budgetRequested)) || Number(formData.budgetRequested) <= 0) {
      errs.budgetRequested = 'Please enter a valid positive numeric amount (INR).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 3) {
      if (!validateStep3()) return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 6));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSaveDraftAction = () => {
    const draftApp: NgoApplication = {
      id: existingDraft?.id || `app-draft-${Date.now()}`,
      schemeId: scheme.id,
      schemeTitle: scheme.name,
      department: scheme.department,
      referenceNumber: existingDraft?.referenceNumber || `SS-DRAFT-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Draft',
      nextAction: `Complete Step ${currentStep}: ${STEP_LABELS[currentStep]}`,
      lastUpdated: 'Just now (Draft saved)',
      isSample: true,
      formData: {
        ...formData,
        savedStep: currentStep,
      },
    };

    onSaveDraft(draftApp);
    setHasUnsavedChanges(false);
    onClose();
  };

  const handleSubmit = () => {
    const refNumber = `SS-DEMO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp: NgoApplication = {
      id: existingDraft?.id || `app-sub-${Date.now()}`,
      schemeId: scheme.id,
      schemeTitle: scheme.name,
      department: scheme.department,
      referenceNumber: refNumber,
      status: 'Submitted',
      nextAction: 'Under desk appraisal by nodal scheme officer (Prototype verification)',
      lastUpdated: 'Just now',
      submittedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      isSample: true,
      formData,
    };

    setSubmittedApp(newApp);
    onSubmitApplication(newApp);
    setHasUnsavedChanges(false);
    setCurrentStep(6); // Confirmation step
  };

  const handleAttemptClose = () => {
    if (hasUnsavedChanges && currentStep > 0 && currentStep < 6) {
      setShowCancelConfirm(true);
    } else {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="app-wizard-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 80,
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          maxWidth: '840px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
        }}
      >
        {/* Top Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--border-light)',
            backgroundColor: 'var(--bg-canvas)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span className="badge-tag badge-emerald" style={{ fontSize: '0.7rem' }}>
                {scheme.sector}
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  backgroundColor: '#fee2e2',
                  color: '#991b1b',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '3px',
                  fontWeight: '700',
                }}
              >
                PROTOTYPE APPLICATION
              </span>
            </div>
            <h2 id="app-wizard-title" style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              {scheme.name}
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              🏛️ {scheme.department} • Aid: {scheme.aidType}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {currentStep > 0 && currentStep < 6 && (
              <button
                type="button"
                onClick={handleSaveDraftAction}
                className="btn-civic btn-civic-secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              >
                💾 Save Draft
              </button>
            )}
            <button
              type="button"
              onClick={handleAttemptClose}
              aria-label="Close application form"
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.4rem',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.2rem',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Progress Step Bar (Steps 1 to 5) */}
        {currentStep > 0 && currentStep < 6 && (
          <div
            style={{
              padding: '0.85rem 1.75rem',
              backgroundColor: '#ffffff',
              borderBottom: '1px solid var(--border-light)',
            }}
            aria-label="Application Progress"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--brand-primary)' }}>
                Step {currentStep} of 5: {STEP_LABELS[currentStep]}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {Math.round((currentStep / 5) * 100)}% Completed
              </span>
            </div>
            <div
              style={{
                height: '6px',
                backgroundColor: 'var(--border-light)',
                borderRadius: '9999px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${(currentStep / 5) * 100}%`,
                  height: '100%',
                  backgroundColor: 'var(--brand-primary)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div style={{ padding: '1.75rem', overflowY: 'auto', flex: 1 }}>
          {/* STEP 0: Pre-start Summary */}
          {currentStep === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.25rem',
                }}
              >
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                  Scheme Application Overview
                </h3>
                <p className="body-text" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  {scheme.shortDescription}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.825rem' }}>
                  <div style={{ backgroundColor: '#ffffff', padding: '0.65rem 0.85rem', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                    <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Eligibility Status</strong>
                    <span style={{ color: evaluation.isRecommended ? '#166534' : '#92400e', fontWeight: '700' }}>
                      {evaluation.overallScore}% Match ({evaluation.isRecommended ? 'High Match' : 'Review Required'})
                    </span>
                  </div>
                  <div style={{ backgroundColor: '#ffffff', padding: '0.65rem 0.85rem', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                    <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Estimated Steps</strong>
                    <span style={{ fontWeight: '600' }}>5 Guided Steps (~4 mins)</span>
                  </div>
                  <div style={{ backgroundColor: '#ffffff', padding: '0.65rem 0.85rem', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                    <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Required Documents</strong>
                    <span style={{ fontWeight: '600' }}>{scheme.requiredDocuments.length} Statutory Records</span>
                  </div>
                </div>
              </div>

              {/* Prototype Disclaimer Box */}
              <div
                style={{
                  backgroundColor: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1rem',
                  fontSize: '0.85rem',
                  color: '#92400e',
                }}
              >
                <strong>ℹ️ Prototype Demonstration Notice:</strong>
                <p style={{ margin: '0.25rem 0 0', lineHeight: 1.5 }}>
                  This application workflow is an interactive HCI prototype designed for college project evaluation. Submissions are saved locally in your prototype workspace and <strong>will not be submitted to any central or state government department</strong>.
                </p>
              </div>

              {/* 5-Step Roadmap Preview */}
              <div>
                <h4 style={{ fontSize: '0.925rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                  Application Workflow Stages:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--bg-tint-emerald)', color: 'var(--brand-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.75rem' }}>1</span>
                    <span><strong>Organisation:</strong> Verify registered NGO credentials from profile</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--bg-tint-emerald)', color: 'var(--brand-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.75rem' }}>2</span>
                    <span><strong>Eligibility:</strong> Check deterministic sector, state & Darpan requirements</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--bg-tint-emerald)', color: 'var(--brand-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.75rem' }}>3</span>
                    <span><strong>Information:</strong> Project summary, target beneficiaries & requested grant</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--bg-tint-emerald)', color: 'var(--brand-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.75rem' }}>4</span>
                    <span><strong>Documents:</strong> Statutory certificates & readiness checklist</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--bg-tint-emerald)', color: 'var(--brand-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.75rem' }}>5</span>
                    <span><strong>Review & Submit:</strong> Edit any section and finalize prototype submission</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: Organisation Details */}
          {currentStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div
                style={{
                  backgroundColor: 'var(--bg-tint-emerald)',
                  border: '1px solid #a7f3d0',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.85rem 1rem',
                  fontSize: '0.825rem',
                  color: '#065f46',
                }}
              >
                ✓ <strong>Pre-filled from your authenticated NGO Profile:</strong> We have automatically loaded your verified credentials so you do not need to re-enter basic details.
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    NGO Legal Name <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>(From profile)</span>
                  </label>
                  <input
                    type="text"
                    value={ngoUser?.ngoName || 'Gram Vikas Seva Sansthan'}
                    disabled
                    className="form-input"
                    style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', cursor: 'not-allowed' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    NGO Darpan Registration ID <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>(From profile)</span>
                  </label>
                  <input
                    type="text"
                    value={ngoUser?.registrationNumber || 'DL/2021/0284918'}
                    disabled
                    className="form-input"
                    style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', cursor: 'not-allowed' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Primary Focus Sector <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>(From profile)</span>
                  </label>
                  <input
                    type="text"
                    value={ngoUser?.focusSector || 'Rural Development'}
                    disabled
                    className="form-input"
                    style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', cursor: 'not-allowed' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Registered State & City <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>(From profile)</span>
                  </label>
                  <input
                    type="text"
                    value={`${ngoUser?.city || 'New Delhi'}, ${ngoUser?.state || 'Delhi'}`}
                    disabled
                    className="form-input"
                    style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', cursor: 'not-allowed' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Primary Contact Person <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>(From profile)</span>
                  </label>
                  <input
                    type="text"
                    value={ngoUser?.contactPerson || 'Coordinator'}
                    disabled
                    className="form-input"
                    style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', cursor: 'not-allowed' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Official Email ID <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>(From profile)</span>
                  </label>
                  <input
                    type="text"
                    value={ngoUser?.email || ''}
                    disabled
                    className="form-input"
                    style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                  Application-Specific Authorisation (Manual Entry):
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="signatoryDesignation" className="form-label">
                      Authorised Signatory Designation <span className="required-star">*</span>
                    </label>
                    <input
                      id="signatoryDesignation"
                      type="text"
                      value={formData.signatoryDesignation || ''}
                      onChange={(e) => handleInputChange('signatoryDesignation', e.target.value)}
                      className="form-input"
                      placeholder="e.g. Secretary, Project Director"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="alternatePhone" className="form-label">
                      Project Coordinator Phone
                    </label>
                    <input
                      id="alternatePhone"
                      type="text"
                      value={formData.alternatePhone || ''}
                      onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                      className="form-input"
                      placeholder="e.g. +91 9876543210"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Eligibility Verification */}
          {currentStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                  Deterministic Criteria Evaluation
                </h3>
                <span
                  style={{
                    fontSize: '0.775rem',
                    fontWeight: '700',
                    backgroundColor: evaluation.isRecommended ? '#dcfce7' : '#fef3c7',
                    color: evaluation.isRecommended ? '#166534' : '#92400e',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '9999px',
                  }}
                >
                  {evaluation.overallScore}% Deterministic Match
                </span>
              </div>

              <p className="body-text" style={{ fontSize: '0.85rem' }}>
                Review each criteria requirement calculated from your profile. Rule evaluations are deterministic and transparent.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {evaluation.criteriaResults.map((crit, idx) => {
                  const isMatched = crit.status === 'matched';
                  const isNeedsAttention = crit.status === 'needs_attention';
                  const icon = isMatched ? '✓' : isNeedsAttention ? '⚠' : '?';
                  const badgeColor = isMatched
                    ? { bg: '#dcfce7', text: '#166534', border: '#86efac' }
                    : isNeedsAttention
                      ? { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' }
                      : { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };

                  return (
                    <div
                      key={idx}
                      style={{
                        border: `1px solid ${badgeColor.border}`,
                        backgroundColor: badgeColor.bg,
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.65rem',
                      }}
                    >
                      <span style={{ fontWeight: '700', fontSize: '1rem', color: badgeColor.text }}>
                        {icon}
                      </span>
                      <div>
                        <strong style={{ color: badgeColor.text, fontSize: '0.85rem', display: 'block' }}>
                          {crit.label}
                        </strong>
                        <span style={{ color: badgeColor.text, fontSize: '0.825rem' }}>
                          {crit.explanation}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  marginTop: '0.5rem',
                  padding: '0.85rem 1rem',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                }}
              >
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.eligibilityAcknowledged}
                    onChange={(e) => handleInputChange('eligibilityAcknowledged', e.target.checked)}
                    style={{ marginTop: '0.2rem', accentColor: 'var(--brand-primary)' }}
                  />
                  <span>
                    <strong>Eligibility Acknowledgment:</strong> I confirm our organization has reviewed the operational eligibility rules and possesses the necessary grassroots track record to execute this project.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: Required Project Information */}
          {currentStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  Project Proposal & Implementation Details
                </h3>
                <p className="body-text" style={{ fontSize: '0.85rem' }}>
                  Provide specific project details for this welfare scheme. All fields marked with (*) are required.
                </p>
              </div>

              {/* Project Title */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="projectTitle" className="form-label">
                  Project Title <span className="required-star">*</span>
                </label>
                <input
                  id="projectTitle"
                  type="text"
                  value={formData.projectTitle}
                  onChange={(e) => handleInputChange('projectTitle', e.target.value)}
                  className={`form-input ${errors.projectTitle ? 'input-error' : ''}`}
                  placeholder="e.g. Remedial Learning Centers in 10 Villages"
                  aria-invalid={Boolean(errors.projectTitle)}
                  aria-describedby={errors.projectTitle ? 'err-projectTitle' : undefined}
                />
                {errors.projectTitle && (
                  <span id="err-projectTitle" className="form-error" role="alert">
                    {errors.projectTitle}
                  </span>
                )}
              </div>

              {/* Beneficiary Group & Count */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="beneficiaryGroup" className="form-label">
                    Target Beneficiary Group <span className="required-star">*</span>
                  </label>
                  <select
                    id="beneficiaryGroup"
                    value={formData.beneficiaryGroup}
                    onChange={(e) => handleInputChange('beneficiaryGroup', e.target.value)}
                    className={`form-select ${errors.beneficiaryGroup ? 'input-error' : ''}`}
                    aria-invalid={Boolean(errors.beneficiaryGroup)}
                    aria-describedby={errors.beneficiaryGroup ? 'err-beneficiaryGroup' : undefined}
                  >
                    <option value="">Select Target Group...</option>
                    {scheme.targetBeneficiaries.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                    <option value="General Community Members">General Community Members</option>
                  </select>
                  {errors.beneficiaryGroup && (
                    <span id="err-beneficiaryGroup" className="form-error" role="alert">
                      {errors.beneficiaryGroup}
                    </span>
                  )}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="targetBeneficiaryCount" className="form-label">
                    Estimated Beneficiary Count <span className="required-star">*</span>
                  </label>
                  <input
                    id="targetBeneficiaryCount"
                    type="number"
                    min="1"
                    value={formData.targetBeneficiaryCount}
                    onChange={(e) => handleInputChange('targetBeneficiaryCount', e.target.value)}
                    className={`form-input ${errors.targetBeneficiaryCount ? 'input-error' : ''}`}
                    placeholder="e.g. 150"
                    aria-invalid={Boolean(errors.targetBeneficiaryCount)}
                    aria-describedby={errors.targetBeneficiaryCount ? 'err-targetBeneficiaryCount' : undefined}
                  />
                  {errors.targetBeneficiaryCount && (
                    <span id="err-targetBeneficiaryCount" className="form-error" role="alert">
                      {errors.targetBeneficiaryCount}
                    </span>
                  )}
                </div>
              </div>

              {/* District / Implementation Area & Budget */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="targetDistrict" className="form-label">
                    Target District / Block <span className="required-star">*</span>
                  </label>
                  <input
                    id="targetDistrict"
                    type="text"
                    value={formData.targetDistrict}
                    onChange={(e) => handleInputChange('targetDistrict', e.target.value)}
                    className={`form-input ${errors.targetDistrict ? 'input-error' : ''}`}
                    placeholder="e.g. South West Delhi, Block B"
                    aria-invalid={Boolean(errors.targetDistrict)}
                    aria-describedby={errors.targetDistrict ? 'err-targetDistrict' : undefined}
                  />
                  {errors.targetDistrict && (
                    <span id="err-targetDistrict" className="form-error" role="alert">
                      {errors.targetDistrict}
                    </span>
                  )}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="budgetRequested" className="form-label">
                    Estimated Budget / Grant Requested (₹ INR) <span className="required-star">*</span>
                  </label>
                  <input
                    id="budgetRequested"
                    type="number"
                    min="1000"
                    value={formData.budgetRequested}
                    onChange={(e) => handleInputChange('budgetRequested', e.target.value)}
                    className={`form-input ${errors.budgetRequested ? 'input-error' : ''}`}
                    placeholder="e.g. 450000"
                    aria-invalid={Boolean(errors.budgetRequested)}
                    aria-describedby={errors.budgetRequested ? 'err-budgetRequested' : undefined}
                  />
                  {errors.budgetRequested && (
                    <span id="err-budgetRequested" className="form-error" role="alert">
                      {errors.budgetRequested}
                    </span>
                  )}
                </div>
              </div>

              {/* Project Summary */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="projectSummary" className="form-label">
                  Project Summary & Implementation Methodology <span className="required-star">*</span>
                </label>
                <textarea
                  id="projectSummary"
                  rows={3}
                  value={formData.projectSummary}
                  onChange={(e) => handleInputChange('projectSummary', e.target.value)}
                  className={`form-input ${errors.projectSummary ? 'input-error' : ''}`}
                  placeholder="Outline the planned community activities, timelines, and monitoring mechanism..."
                  aria-invalid={Boolean(errors.projectSummary)}
                  aria-describedby={errors.projectSummary ? 'err-projectSummary' : undefined}
                />
                {errors.projectSummary && (
                  <span id="err-projectSummary" className="form-error" role="alert">
                    {errors.projectSummary}
                  </span>
                )}
              </div>

              {/* Expected Outcomes */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="expectedOutcomes" className="form-label">
                  Expected Key Outcomes & Deliverables <span className="required-star">*</span>
                </label>
                <textarea
                  id="expectedOutcomes"
                  rows={2}
                  value={formData.expectedOutcomes}
                  onChange={(e) => handleInputChange('expectedOutcomes', e.target.value)}
                  className={`form-input ${errors.expectedOutcomes ? 'input-error' : ''}`}
                  placeholder="e.g. 100% learning kit distribution, monthly attendance tracking, 3 community camps..."
                  aria-invalid={Boolean(errors.expectedOutcomes)}
                  aria-describedby={errors.expectedOutcomes ? 'err-expectedOutcomes' : undefined}
                />
                {errors.expectedOutcomes && (
                  <span id="err-expectedOutcomes" className="form-error" role="alert">
                    {errors.expectedOutcomes}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Mandatory Statutory Documents */}
          {currentStep === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  Mandatory Statutory Documentation Checklist
                </h3>
                <p className="body-text" style={{ fontSize: '0.85rem' }}>
                  Confirm statutory documents ready from your Document Vault or toggle simulated prototype upload.
                </p>
              </div>

              <div
                style={{
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.85rem 1rem',
                  fontSize: '0.825rem',
                  color: '#166534',
                }}
              >
                ℹ️ <strong>Prototype Simulation:</strong> Document upload storage is simulated for prototype demonstration. Toggle files below to attach verified documents.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {scheme.requiredDocuments.map((doc, idx) => {
                  const isAttached = formData.readyDocuments.includes(doc);
                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.85rem 1rem',
                        backgroundColor: isAttached ? 'var(--bg-canvas)' : '#ffffff',
                        border: '1px solid',
                        borderColor: isAttached ? 'var(--brand-primary)' : 'var(--border-light)',
                        borderRadius: 'var(--radius-sm)',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span style={{ fontSize: '1.1rem' }}>{isAttached ? '📄' : '📁'}</span>
                        <div>
                          <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)', display: 'block' }}>
                            {doc}
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: isAttached ? '#166534' : 'var(--text-muted)' }}>
                            {isAttached ? '✓ Attached from Statutory Vault' : 'Pending verification'}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleDocument(doc)}
                        className="btn-civic btn-civic-secondary"
                        style={{
                          padding: '0.35rem 0.75rem',
                          fontSize: '0.8rem',
                          borderColor: isAttached ? '#86efac' : 'var(--border-medium)',
                          backgroundColor: isAttached ? '#dcfce7' : '#ffffff',
                          color: isAttached ? '#166534' : 'var(--text-secondary)',
                        }}
                      >
                        {isAttached ? '✓ Attached (Simulated)' : '+ Attach Document'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Review & Edit Before Submission */}
          {currentStep === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  Review Application Before Submission
                </h3>
                <p className="body-text" style={{ fontSize: '0.85rem' }}>
                  Please review all entered information. You can click &quot;Edit&quot; on any section to make corrections before final prototype submission.
                </p>
              </div>

              {/* Review Section 1: Organisation */}
              <div
                style={{
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1rem 1.25rem',
                  backgroundColor: 'var(--bg-canvas)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                    1. Organisation Information
                  </h4>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="btn-civic btn-civic-secondary"
                    style={{ padding: '0.25rem 0.65rem', fontSize: '0.775rem' }}
                  >
                    ✏️ Edit Section
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.825rem' }}>
                  <div><strong>NGO:</strong> {ngoUser?.ngoName || 'Gram Vikas Seva Sansthan'}</div>
                  <div><strong>Darpan ID:</strong> {ngoUser?.registrationNumber || 'DL/2021/0284918'}</div>
                  <div><strong>Sector:</strong> {ngoUser?.focusSector || 'Rural Development'}</div>
                  <div><strong>Location:</strong> {ngoUser?.city || 'Delhi'}, {ngoUser?.state || 'Delhi'}</div>
                  <div><strong>Signatory:</strong> {formData.signatoryDesignation || 'Authorized Signatory'}</div>
                  <div><strong>Contact Phone:</strong> {formData.alternatePhone || ngoUser?.phoneNumber || 'N/A'}</div>
                </div>
              </div>

              {/* Review Section 2: Eligibility */}
              <div
                style={{
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1rem 1.25rem',
                  backgroundColor: 'var(--bg-canvas)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                    2. Eligibility Evaluation
                  </h4>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="btn-civic btn-civic-secondary"
                    style={{ padding: '0.25rem 0.65rem', fontSize: '0.775rem' }}
                  >
                    ✏️ Edit Section
                  </button>
                </div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                  <div><strong>Evaluation Score:</strong> {evaluation.overallScore}% Deterministic Match</div>
                  <div><strong>Prerequisites Acknowledged:</strong> {formData.eligibilityAcknowledged ? 'Yes (Confirmed)' : 'No'}</div>
                </div>
              </div>

              {/* Review Section 3: Project Information */}
              <div
                style={{
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1rem 1.25rem',
                  backgroundColor: 'var(--bg-canvas)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                    3. Project Proposal & Beneficiaries
                  </h4>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="btn-civic btn-civic-secondary"
                    style={{ padding: '0.25rem 0.65rem', fontSize: '0.775rem' }}
                  >
                    ✏️ Edit Section
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.825rem' }}>
                  <div><strong>Proposal Title:</strong> {formData.projectTitle}</div>
                  <div><strong>Target Group:</strong> {formData.beneficiaryGroup} ({formData.targetBeneficiaryCount} beneficiaries)</div>
                  <div><strong>District:</strong> {formData.targetDistrict}</div>
                  <div><strong>Requested Grant:</strong> ₹{Number(formData.budgetRequested).toLocaleString('en-IN')}</div>
                  <div><strong>Summary:</strong> {formData.projectSummary}</div>
                  <div><strong>Key Deliverables:</strong> {formData.expectedOutcomes}</div>
                </div>
              </div>

              {/* Review Section 4: Documents */}
              <div
                style={{
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1rem 1.25rem',
                  backgroundColor: 'var(--bg-canvas)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                    4. Statutory Documents Checklist
                  </h4>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="btn-civic btn-civic-secondary"
                    style={{ padding: '0.25rem 0.65rem', fontSize: '0.775rem' }}
                  >
                    ✏️ Edit Section
                  </button>
                </div>
                <div style={{ fontSize: '0.825rem' }}>
                  <strong>Attached Documents ({formData.readyDocuments.length}):</strong>
                  <ul style={{ paddingLeft: '1.2rem', margin: '0.25rem 0 0', color: 'var(--text-secondary)' }}>
                    {formData.readyDocuments.length > 0 ? (
                      formData.readyDocuments.map((d, i) => <li key={i}>{d}</li>)
                    ) : (
                      <li style={{ color: '#991b1b' }}>No documents attached yet (Self-verification pending)</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Submission Disclaimer Banner */}
              <div
                style={{
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fca5a5',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.85rem 1rem',
                  fontSize: '0.825rem',
                  color: '#991b1b',
                }}
              >
                <strong>⚠️ Prototype Submission Disclaimer:</strong> This is an educational HCI prototype submission. It will be recorded in your prototype application tracker and <strong>will not be sent to a government department</strong>.
              </div>
            </div>
          )}

          {/* STEP 6: Confirmation Screen */}
          {currentStep === 6 && submittedApp && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1rem 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#dcfce7',
                  color: '#166534',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  marginBottom: '1rem',
                }}
              >
                ✓
              </div>

              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  backgroundColor: '#dcfce7',
                  color: '#166534',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px',
                  marginBottom: '0.5rem',
                }}
              >
                PROTOTYPE SUBMITTED
              </span>

              <h3 style={{ fontSize: '1.35rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Application Submitted Successfully
              </h3>

              <p className="body-text" style={{ maxWidth: '48ch', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
                This is a SahaySetu prototype submission for demonstration purposes. Your application has been logged into your organization&apos;s prototype workspace.
              </p>

              {/* Submission Details Card */}
              <div
                style={{
                  backgroundColor: 'var(--bg-canvas)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.25rem',
                  maxWidth: '540px',
                  width: '100%',
                  textAlign: 'left',
                  fontSize: '0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  marginBottom: '1.75rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Reference Number:</span>
                  <strong style={{ fontFamily: 'monospace', color: 'var(--brand-primary)' }}>{submittedApp.referenceNumber}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Scheme:</span>
                  <strong>{submittedApp.schemeTitle}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Submission Date:</span>
                  <span>{submittedApp.submittedAt}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Current Status:</span>
                  <span className="badge-tag badge-emerald" style={{ fontSize: '0.75rem' }}>Prototype Submitted</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToApplications();
                  }}
                  className="btn-civic btn-civic-primary"
                  style={{ padding: '0.6rem 1.25rem' }}
                >
                  View in Application Tracker →
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-civic btn-civic-secondary"
                  style={{ padding: '0.6rem 1.25rem' }}
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {currentStep < 6 && (
          <div
            style={{
              padding: '1rem 1.75rem',
              borderTop: '1px solid var(--border-light)',
              backgroundColor: '#ffffff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div>
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="btn-civic btn-civic-secondary"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  ← Back
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button
                type="button"
                onClick={handleAttemptClose}
                className="btn-civic btn-civic-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                Cancel
              </button>

              {currentStep === 0 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-civic btn-civic-primary"
                  style={{ padding: '0.55rem 1.25rem', fontSize: '0.875rem' }}
                >
                  Start Application Form →
                </button>
              )}

              {currentStep > 0 && currentStep < 5 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-civic btn-civic-primary"
                  style={{ padding: '0.55rem 1.25rem', fontSize: '0.875rem' }}
                >
                  Save & Next →
                </button>
              )}

              {currentStep === 5 && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn-civic btn-civic-primary"
                  style={{
                    padding: '0.6rem 1.5rem',
                    fontSize: '0.9rem',
                    backgroundColor: 'var(--brand-primary)',
                  }}
                >
                  Submit Prototype Application ✓
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 90,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-sm)',
              padding: '1.5rem',
              maxWidth: '420px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            }}
          >
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              Leave Application Form?
            </h4>
            <p className="body-text" style={{ fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              You have unsaved changes in this application. You can save your draft to resume later or discard changes.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setShowCancelConfirm(false)}
                className="btn-civic btn-civic-secondary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.825rem' }}
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={handleSaveDraftAction}
                className="btn-civic btn-civic-secondary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.825rem', color: 'var(--brand-primary)', borderColor: 'var(--brand-primary)' }}
              >
                Save Draft & Exit
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCancelConfirm(false);
                  onClose();
                }}
                className="btn-civic btn-civic-secondary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.825rem', color: '#b91c1c', borderColor: '#fca5a5' }}
              >
                Discard & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
