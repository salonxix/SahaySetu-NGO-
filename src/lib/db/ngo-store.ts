import { Database, type SavedSchemeRecord, type ApplicationRecord, type StatusHistoryRecord, type NgoProfileRecord } from './database';
import { ensureDatabaseSeeded } from './seed';
import type { Scheme, NgoApplication, NgoDocumentItem, ApplicationStatus, ApplicationFormData } from '@/types/ngo';

export class NgoDataStore {
  // 1. NGO Profiles
  static async getNgoProfileByUserId(userId: string): Promise<NgoProfileRecord | null> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const profile = db.getState().ngo_profiles.find((p) => p.user_id === userId);
    return profile ?? null;
  }

  static async getNgoProfileById(ngoId: string): Promise<NgoProfileRecord | null> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const profile = db.getState().ngo_profiles.find((p) => p.id === ngoId);
    return profile ?? null;
  }

  static async updateNgoProfile(
    ngoId: string,
    updates: Partial<Omit<NgoProfileRecord, 'id' | 'user_id' | 'created_at'>>
  ): Promise<NgoProfileRecord> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    const profileIndex = state.ngo_profiles.findIndex((p) => p.id === ngoId);

    if (profileIndex === -1) {
      throw new Error(`NGO Profile ${ngoId} not found`);
    }

    const updated: NgoProfileRecord = {
      ...state.ngo_profiles[profileIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    state.ngo_profiles[profileIndex] = updated;
    db.save();
    return updated;
  }

  // 2. Schemes
  static async getAllSchemes(): Promise<Scheme[]> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    return db.getState().schemes.map((s) => ({
      id: s.id,
      name: s.name,
      shortDescription: s.short_description,
      fullDescription: s.full_description,
      sector: s.sector,
      department: s.department,
      targetBeneficiaries: JSON.parse(s.target_beneficiaries || '[]'),
      applicableStates: JSON.parse(s.applicable_states || '[]'),
      aidType: s.aid_type,
      status: s.status as Scheme['status'],
      eligibilityCriteria: JSON.parse(s.eligibility_criteria || '[]'),
      requiredDocuments: JSON.parse(s.required_documents || '[]'),
      applicationProcess: JSON.parse(s.application_process || '[]'),
      officialSource: s.official_source,
      lastUpdated: s.last_updated,
      tags: JSON.parse(s.tags || '[]'),
      isSample: s.is_sample === 1,
    }));
  }

  static async getSchemeById(schemeId: string): Promise<Scheme | null> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const s = db.getState().schemes.find((sch) => sch.id === schemeId);
    if (!s) return null;

    return {
      id: s.id,
      name: s.name,
      shortDescription: s.short_description,
      fullDescription: s.full_description,
      sector: s.sector,
      department: s.department,
      targetBeneficiaries: JSON.parse(s.target_beneficiaries || '[]'),
      applicableStates: JSON.parse(s.applicable_states || '[]'),
      aidType: s.aid_type,
      status: s.status as Scheme['status'],
      eligibilityCriteria: JSON.parse(s.eligibility_criteria || '[]'),
      requiredDocuments: JSON.parse(s.required_documents || '[]'),
      applicationProcess: JSON.parse(s.application_process || '[]'),
      officialSource: s.official_source,
      lastUpdated: s.last_updated,
      tags: JSON.parse(s.tags || '[]'),
      isSample: s.is_sample === 1,
    };
  }

  // 3. Saved Schemes
  static async getSavedSchemeIdsForNgo(ngoId: string): Promise<string[]> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    return db.getState().saved_schemes
      .filter((s) => s.ngo_id === ngoId)
      .map((s) => s.scheme_id);
  }

  static async saveSchemeForNgo(ngoId: string, schemeId: string): Promise<boolean> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();

    // Prevent duplicates (Unique constraint)
    const exists = state.saved_schemes.some(
      (s) => s.ngo_id === ngoId && s.scheme_id === schemeId
    );

    if (exists) {
      return false; // Already saved
    }

    const newRecord: SavedSchemeRecord = {
      id: `saved_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ngo_id: ngoId,
      scheme_id: schemeId,
      saved_at: new Date().toISOString(),
    };

    state.saved_schemes.push(newRecord);
    db.save();
    return true;
  }

  static async unsaveSchemeForNgo(ngoId: string, schemeId: string): Promise<boolean> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();

    const initialLength = state.saved_schemes.length;
    state.saved_schemes = state.saved_schemes.filter(
      (s) => !(s.ngo_id === ngoId && s.scheme_id === schemeId)
    );

    if (state.saved_schemes.length !== initialLength) {
      db.save();
      return true;
    }
    return false;
  }

  // 4. Applications & Drafts
  static async getApplicationsForNgo(ngoId: string): Promise<NgoApplication[]> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const apps = db.getState().applications.filter((a) => a.ngo_id === ngoId);

    return apps.map((a) => ({
      id: a.id,
      schemeId: a.scheme_id,
      schemeTitle: a.scheme_title,
      department: a.department,
      referenceNumber: a.reference_number,
      status: a.status as ApplicationStatus,
      nextAction: a.next_action,
      lastUpdated: a.updated_at,
      submittedAt: a.submitted_at,
      submissionDeadline: a.submission_deadline,
      isSample: a.is_sample === 1,
      formData: a.form_data ? JSON.parse(a.form_data) : undefined,
    }));
  }

  static async getApplicationById(applicationId: string, ngoId: string): Promise<NgoApplication | null> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const a = db.getState().applications.find(
      (app) => app.id === applicationId && app.ngo_id === ngoId
    );

    if (!a) return null;

    return {
      id: a.id,
      schemeId: a.scheme_id,
      schemeTitle: a.scheme_title,
      department: a.department,
      referenceNumber: a.reference_number,
      status: a.status as ApplicationStatus,
      nextAction: a.next_action,
      lastUpdated: a.updated_at,
      submittedAt: a.submitted_at,
      submissionDeadline: a.submission_deadline,
      isSample: a.is_sample === 1,
      formData: a.form_data ? JSON.parse(a.form_data) : undefined,
    };
  }

  static async saveDraftApplication(
    ngoId: string,
    appData: {
      id?: string;
      schemeId?: string;
      schemeTitle: string;
      department?: string;
      formData: ApplicationFormData;
    }
  ): Promise<NgoApplication> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    const now = new Date().toISOString();

    const appId = appData.id || `app_draft_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const existingIndex = state.applications.findIndex(
      (a) => a.id === appId && a.ngo_id === ngoId
    );

    const record: ApplicationRecord = {
      id: appId,
      ngo_id: ngoId,
      scheme_id: appData.schemeId,
      scheme_title: appData.schemeTitle,
      department: appData.department || 'Central / State Nodal Agency',
      reference_number: `DRAFT-${appId.toUpperCase().slice(-8)}`,
      status: 'Draft',
      next_action: 'Resume Draft Form',
      form_data: JSON.stringify(appData.formData),
      is_sample: 0,
      created_at: existingIndex >= 0 ? state.applications[existingIndex].created_at : now,
      updated_at: now,
    };

    if (existingIndex >= 0) {
      state.applications[existingIndex] = record;
    } else {
      state.applications.unshift(record);

      // Record history
      state.application_status_history.push({
        id: `hist_${Date.now()}`,
        application_id: appId,
        status: 'Draft',
        comment: 'Application draft initiated',
        changed_by: ngoId,
        created_at: now,
      });
    }

    db.save();

    return {
      id: record.id,
      schemeId: record.scheme_id,
      schemeTitle: record.scheme_title,
      department: record.department,
      referenceNumber: record.reference_number,
      status: record.status as ApplicationStatus,
      nextAction: record.next_action,
      lastUpdated: record.updated_at,
      isSample: false,
      formData: appData.formData,
    };
  }

  static async submitApplication(
    ngoId: string,
    appData: {
      id?: string;
      schemeId?: string;
      schemeTitle: string;
      department?: string;
      formData: ApplicationFormData;
    }
  ): Promise<NgoApplication> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    const now = new Date().toISOString();

    const appId = appData.id || `app_sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const referenceNumber = `SS-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const existingIndex = state.applications.findIndex(
      (a) => a.id === appId && a.ngo_id === ngoId
    );

    const record: ApplicationRecord = {
      id: appId,
      ngo_id: ngoId,
      scheme_id: appData.schemeId,
      scheme_title: appData.schemeTitle,
      department: appData.department || 'Ministry / Department Nodal Cell',
      reference_number: referenceNumber,
      status: 'Submitted',
      next_action: 'Pending Nodal Officer Verification',
      form_data: JSON.stringify(appData.formData),
      submitted_at: now,
      submission_deadline: 'Rolling Assessment',
      is_sample: 0,
      created_at: existingIndex >= 0 ? state.applications[existingIndex].created_at : now,
      updated_at: now,
    };

    if (existingIndex >= 0) {
      state.applications[existingIndex] = record;
    } else {
      state.applications.unshift(record);
    }

    // Record status transition in history
    state.application_status_history.push({
      id: `hist_${Date.now()}`,
      application_id: appId,
      status: 'Submitted',
      comment: `Application submitted with reference ${referenceNumber}`,
      changed_by: ngoId,
      created_at: now,
    });

    db.save();

    return {
      id: record.id,
      schemeId: record.scheme_id,
      schemeTitle: record.scheme_title,
      department: record.department,
      referenceNumber: record.reference_number,
      status: 'Submitted',
      nextAction: record.next_action,
      lastUpdated: record.updated_at,
      submittedAt: record.submitted_at,
      submissionDeadline: record.submission_deadline,
      isSample: false,
      formData: appData.formData,
    };
  }

  // 5. Application Status History
  static async getApplicationHistory(applicationId: string): Promise<StatusHistoryRecord[]> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    return db.getState().application_status_history
      .filter((h) => h.application_id === applicationId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  // 6. Documents
  static async getDocumentsForNgo(ngoId: string): Promise<NgoDocumentItem[]> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const docs = db.getState().documents.filter((d) => d.ngo_id === ngoId);

    return docs.map((d) => ({
      id: d.id,
      name: d.name,
      category: d.category as NgoDocumentItem['category'],
      status: d.status as NgoDocumentItem['status'],
      validTill: d.valid_till,
      notes: d.notes,
      isRequired: d.is_required === 1,
    }));
  }

  static async updateDocumentStatus(
    ngoId: string,
    docId: string,
    status: NgoDocumentItem['status']
  ): Promise<boolean> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    const docIndex = state.documents.findIndex(
      (d) => d.id === docId && d.ngo_id === ngoId
    );

    if (docIndex === -1) return false;

    state.documents[docIndex].status = status;
    state.documents[docIndex].updated_at = new Date().toISOString();
    db.save();
    return true;
  }
}
