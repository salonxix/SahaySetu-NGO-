import { describe, it, expect, beforeEach } from 'vitest';
import { NgoDataStore } from '@/lib/db/ngo-store';
import { UserStore } from '@/lib/auth/store';
import type { ApplicationFormData } from '@/types/ngo';

describe('NGO Entities Persistence & Tenant Isolation', () => {
  const sampleFormData: ApplicationFormData = {
    signatoryDesignation: 'Director',
    alternatePhone: '+91 9876500000',
    eligibilityAcknowledged: true,
    projectTitle: 'Solar Community Hubs',
    beneficiaryGroup: 'Marginal farmers',
    targetBeneficiaryCount: '350 families',
    targetDistrict: 'Nagpur',
    projectSummary: 'Installing decentralized solar systems.',
    expectedOutcomes: '24/7 power for community clinic and schools.',
    budgetRequested: '₹12,00,000',
    readyDocuments: ['NGO Darpan Registration Certificate', '12A & 80G Tax Exemption Certificates'],
    savedStep: 2,
  };

  beforeEach(() => {
    UserStore.clear();
  });

  it('retrieves schemes catalog populated from database seeder', async () => {
    const schemes = await NgoDataStore.getAllSchemes();
    expect(schemes.length).toBeGreaterThanOrEqual(8);

    const scheme1 = await NgoDataStore.getSchemeById('sch-01');
    expect(scheme1).not.toBeNull();
    expect(scheme1?.name).toBe('Integrated Rural Education Support Grant');
    expect(scheme1?.isSample).toBe(true);
  });

  it('saves and unsaves schemes for an NGO without allowing duplicates', async () => {
    const ngoId = 'ngo_demo_01';

    // Initial saved scheme seeded for demo
    const initialSaved = await NgoDataStore.getSavedSchemeIdsForNgo(ngoId);
    expect(initialSaved).toContain('sch-01');

    // Save a new scheme
    const saved = await NgoDataStore.saveSchemeForNgo(ngoId, 'sch-02');
    expect(saved).toBe(true);

    const afterSave = await NgoDataStore.getSavedSchemeIdsForNgo(ngoId);
    expect(afterSave).toContain('sch-02');

    // Duplicate save attempt
    const duplicateSave = await NgoDataStore.saveSchemeForNgo(ngoId, 'sch-02');
    expect(duplicateSave).toBe(false);

    // Unsave scheme
    const unsaved = await NgoDataStore.unsaveSchemeForNgo(ngoId, 'sch-02');
    expect(unsaved).toBe(true);

    const afterUnsave = await NgoDataStore.getSavedSchemeIdsForNgo(ngoId);
    expect(afterUnsave).not.toContain('sch-02');
  });

  it('creates, saves, and updates application drafts for an NGO', async () => {
    const ngoId = 'ngo_demo_01';

    // Create Draft
    const draft = await NgoDataStore.saveDraftApplication(ngoId, {
      schemeId: 'sch-03',
      schemeTitle: 'Rural Primary Health Outreach Grant',
      department: 'Ministry of Health and Family Welfare',
      formData: sampleFormData,
    });

    expect(draft.id).toBeDefined();
    expect(draft.status).toBe('Draft');
    expect(draft.referenceNumber).toContain('DRAFT-');
    expect(draft.formData?.projectTitle).toBe('Solar Community Hubs');

    // Update Draft
    const updatedFormData: ApplicationFormData = {
      ...sampleFormData,
      projectTitle: 'Updated Solar Community Hubs Phase 2',
      savedStep: 3,
    };

    const updatedDraft = await NgoDataStore.saveDraftApplication(ngoId, {
      id: draft.id,
      schemeId: 'sch-03',
      schemeTitle: 'Rural Primary Health Outreach Grant',
      formData: updatedFormData,
    });

    expect(updatedDraft.id).toBe(draft.id);
    expect(updatedDraft.formData?.projectTitle).toBe('Updated Solar Community Hubs Phase 2');
    expect(updatedDraft.formData?.savedStep).toBe(3);

    // Retrieve by ID
    const fetched = await NgoDataStore.getApplicationById(draft.id, ngoId);
    expect(fetched).not.toBeNull();
    expect(fetched?.formData?.projectTitle).toBe('Updated Solar Community Hubs Phase 2');
  });

  it('submits an application and records status history audit trail', async () => {
    const ngoId = 'ngo_demo_01';

    const submission = await NgoDataStore.submitApplication(ngoId, {
      schemeId: 'sch-01',
      schemeTitle: 'Integrated Rural Education Support Grant',
      formData: sampleFormData,
    });

    expect(submission.id).toBeDefined();
    expect(submission.status).toBe('Submitted');
    expect(submission.referenceNumber).toMatch(/^SS-2026-\d{6}$/);
    expect(submission.submittedAt).toBeDefined();

    // Check status history
    const history = await NgoDataStore.getApplicationHistory(submission.id);
    expect(history.length).toBeGreaterThan(0);
    expect(history[0].status).toBe('Submitted');
    expect(history[0].changed_by).toBe(ngoId);
  });

  it('enforces strict tenant isolation: NGO A cannot access NGO B applications or saved schemes', async () => {
    const ngoA = 'ngo_demo_01';
    const ngoB = 'ngo_tenant_02';

    // NGO A creates a draft
    const draftA = await NgoDataStore.saveDraftApplication(ngoA, {
      schemeId: 'sch-01',
      schemeTitle: 'NGO A Exclusive Project',
      formData: sampleFormData,
    });

    // NGO B saves a scheme
    await NgoDataStore.saveSchemeForNgo(ngoB, 'sch-05');

    // NGO B cannot access NGO A draft
    const ngoBAccessingDraftA = await NgoDataStore.getApplicationById(draftA.id, ngoB);
    expect(ngoBAccessingDraftA).toBeNull();

    // NGO A cannot see NGO B saved schemes
    const ngoASavedSchemes = await NgoDataStore.getSavedSchemeIdsForNgo(ngoA);
    expect(ngoASavedSchemes).not.toContain('sch-05');

    const ngoBSavedSchemes = await NgoDataStore.getSavedSchemeIdsForNgo(ngoB);
    expect(ngoBSavedSchemes).toContain('sch-05');
  });
});
