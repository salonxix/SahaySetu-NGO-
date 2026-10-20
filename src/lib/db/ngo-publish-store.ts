import {
  Database,
  type NgoPublicProfileRecord,
  type NgoDonationNeedRecord,
  type NgoCampaignRecord,
  type NgoEventRecord,
  type NgoVolunteerOpRecord,
  type HelpRequestRecord,
} from './database';
import { ensureDatabaseSeeded } from './seed';
import type {
  NgoPublishProfile,
  NgoDonationNeed,
  NgoCampaignItem,
  NgoEventItem,
  NgoVolunteerOp,
  HelpRequest,
  HelpRequestStatus,
  NgoNeedStatus,
  NgoCampaignStatus,
  NgoEventStatus,
  NgoVolunteerOpStatus,
  HelpServiceCategory,
} from '@/types/ngo-publish';
import type { DonationType, NgoCauseCategory } from '@/types/user-portal';

export class NgoPublishStore {
  // ==================== PUBLIC PROFILE ====================

  public static async getProfile(ngoId: string): Promise<NgoPublishProfile | null> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    const record = state.ngo_public_profiles?.find((p) => p.ngo_id === ngoId);
    if (!record) return null;

    return {
      id: record.id,
      ngoId: record.ngo_id,
      ngoName: record.ngo_name,
      about: record.about,
      logoUrl: record.logo_url,
      primaryCause: record.primary_cause as NgoCauseCategory,
      additionalCauses: JSON.parse(record.additional_causes || '[]'),
      address: record.address,
      city: record.city,
      district: record.district,
      state: record.state,
      pincode: record.pincode,
      operatingAreas: JSON.parse(record.operating_areas || '[]'),
      contactPerson: record.contact_person,
      phone: record.phone,
      email: record.email,
      website: record.website,
      acceptedDonationTypes: JSON.parse(record.accepted_donation_types || '[]'),
      servicesProvided: JSON.parse(record.services_provided || '[]'),
      operatingHours: record.operating_hours,
      establishedYear: record.established_year,
      latitude: record.latitude,
      longitude: record.longitude,
      updatedAt: record.updated_at,
    };
  }

  public static async saveProfile(
    ngoId: string,
    ngoName: string,
    profileData: Partial<NgoPublishProfile>
  ): Promise<NgoPublishProfile> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    if (!state.ngo_public_profiles) state.ngo_public_profiles = [];

    const now = new Date().toISOString();
    const index = state.ngo_public_profiles.findIndex((p) => p.ngo_id === ngoId);

    const record: NgoPublicProfileRecord = {
      id: index >= 0 ? state.ngo_public_profiles[index].id : `pub_prof_${Date.now()}`,
      ngo_id: ngoId,
      ngo_name: profileData.ngoName || ngoName,
      about: profileData.about || '',
      logo_url: profileData.logoUrl,
      primary_cause: profileData.primaryCause || 'Education',
      additional_causes: JSON.stringify(profileData.additionalCauses || []),
      address: profileData.address || '',
      city: profileData.city || '',
      district: profileData.district,
      state: profileData.state || '',
      pincode: profileData.pincode || '',
      operating_areas: JSON.stringify(profileData.operatingAreas || []),
      contact_person: profileData.contactPerson || '',
      phone: profileData.phone || '',
      email: profileData.email || '',
      website: profileData.website,
      accepted_donation_types: JSON.stringify(profileData.acceptedDonationTypes || []),
      services_provided: JSON.stringify(profileData.servicesProvided || []),
      operating_hours: profileData.operatingHours,
      established_year: profileData.establishedYear,
      latitude: profileData.latitude ?? 28.6139,
      longitude: profileData.longitude ?? 77.209,
      updated_at: now,
    };

    if (index >= 0) {
      state.ngo_public_profiles[index] = record;
    } else {
      state.ngo_public_profiles.push(record);
    }

    db.save();
    return this.getProfile(ngoId) as Promise<NgoPublishProfile>;
  }

  // ==================== DONATION NEEDS ====================

  public static async getNeeds(ngoId: string): Promise<NgoDonationNeed[]> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    const records = state.ngo_donation_needs?.filter((n) => n.ngo_id === ngoId) || [];

    return records.map((r) => ({
      id: r.id,
      ngoId: r.ngo_id,
      ngoName: r.ngo_name,
      title: r.title,
      category: r.category as DonationType,
      causeCategory: r.cause_category as NgoCauseCategory | undefined,
      description: r.description,
      itemsRequired: r.items_required,
      quantityNeeded: r.quantity_needed,
      quantityCollected: r.quantity_collected,
      location: r.location,
      preferredContributionType: r.preferred_contribution_type as DonationType,
      startDate: r.start_date,
      endDate: r.end_date,
      dropoffInfo: r.dropoff_info,
      acceptsCourier: r.accepts_courier === 1,
      contactInfo: r.contact_info,
      status: r.status as NgoNeedStatus,
      urgency: r.urgency as 'Immediate' | 'Regular' | 'Low',
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }

  public static async createNeed(
    ngoId: string,
    ngoName: string,
    data: Omit<NgoDonationNeed, 'id' | 'ngoId' | 'ngoName' | 'createdAt' | 'updatedAt'>
  ): Promise<NgoDonationNeed> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    if (!state.ngo_donation_needs) state.ngo_donation_needs = [];

    const now = new Date().toISOString();
    const id = `need_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    const record: NgoDonationNeedRecord = {
      id,
      ngo_id: ngoId,
      ngo_name: ngoName,
      title: data.title,
      category: data.category,
      cause_category: data.causeCategory,
      description: data.description,
      items_required: data.itemsRequired,
      quantity_needed: data.quantityNeeded,
      quantity_collected: data.quantityCollected,
      location: data.location,
      preferred_contribution_type: data.preferredContributionType,
      start_date: data.startDate,
      end_date: data.endDate,
      dropoff_info: data.dropoffInfo,
      accepts_courier: data.acceptsCourier ? 1 : 0,
      contact_info: data.contactInfo,
      status: data.status,
      urgency: data.urgency,
      created_at: now,
      updated_at: now,
    };

    state.ngo_donation_needs.unshift(record);
    db.save();

    return {
      id: record.id,
      ngoId: record.ngo_id,
      ngoName: record.ngo_name,
      title: record.title,
      category: record.category as DonationType,
      causeCategory: record.cause_category as NgoCauseCategory | undefined,
      description: record.description,
      itemsRequired: record.items_required,
      quantityNeeded: record.quantity_needed,
      quantityCollected: record.quantity_collected,
      location: record.location,
      preferredContributionType: record.preferred_contribution_type as DonationType,
      startDate: record.start_date,
      endDate: record.end_date,
      dropoffInfo: record.dropoff_info,
      acceptsCourier: record.accepts_courier === 1,
      contactInfo: record.contact_info,
      status: record.status as NgoNeedStatus,
      urgency: record.urgency as 'Immediate' | 'Regular' | 'Low',
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    };
  }

  public static async updateNeed(
    ngoId: string,
    needId: string,
    updates: Partial<NgoDonationNeed>
  ): Promise<NgoDonationNeed | null> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    const item = state.ngo_donation_needs?.find((n) => n.id === needId && n.ngo_id === ngoId);
    if (!item) return null;

    if (updates.title !== undefined) item.title = updates.title;
    if (updates.category !== undefined) item.category = updates.category;
    if (updates.causeCategory !== undefined) item.cause_category = updates.causeCategory;
    if (updates.description !== undefined) item.description = updates.description;
    if (updates.itemsRequired !== undefined) item.items_required = updates.itemsRequired;
    if (updates.quantityNeeded !== undefined) item.quantity_needed = updates.quantityNeeded;
    if (updates.quantityCollected !== undefined) item.quantity_collected = updates.quantityCollected;
    if (updates.location !== undefined) item.location = updates.location;
    if (updates.preferredContributionType !== undefined) item.preferred_contribution_type = updates.preferredContributionType;
    if (updates.startDate !== undefined) item.start_date = updates.startDate;
    if (updates.endDate !== undefined) item.end_date = updates.endDate;
    if (updates.dropoffInfo !== undefined) item.dropoff_info = updates.dropoffInfo;
    if (updates.acceptsCourier !== undefined) item.accepts_courier = updates.acceptsCourier ? 1 : 0;
    if (updates.contactInfo !== undefined) item.contact_info = updates.contactInfo;
    if (updates.status !== undefined) item.status = updates.status;
    if (updates.urgency !== undefined) item.urgency = updates.urgency;
    item.updated_at = new Date().toISOString();

    db.save();
    const needs = await this.getNeeds(ngoId);
    return needs.find((n) => n.id === needId) || null;
  }

  public static async deleteNeed(ngoId: string, needId: string): Promise<boolean> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    if (!state.ngo_donation_needs) return false;

    const index = state.ngo_donation_needs.findIndex((n) => n.id === needId && n.ngo_id === ngoId);
    if (index === -1) return false;

    state.ngo_donation_needs.splice(index, 1);
    db.save();
    return true;
  }

  // ==================== CAMPAIGNS ====================

  public static async getCampaigns(ngoId: string): Promise<NgoCampaignItem[]> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    const records = state.ngo_campaigns?.filter((c) => c.ngo_id === ngoId) || [];

    return records.map((r) => ({
      id: r.id,
      ngoId: r.ngo_id,
      ngoName: r.ngo_name,
      title: r.title,
      description: r.description,
      cause: r.cause as NgoCauseCategory,
      objective: r.objective,
      donationTypesAccepted: JSON.parse(r.donation_types_accepted || '[]'),
      location: r.location,
      startDate: r.start_date,
      endDate: r.end_date,
      targetUnits: r.target_units,
      collectedUnits: r.collected_units,
      contact: r.contact,
      status: r.status as NgoCampaignStatus,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }

  public static async createCampaign(
    ngoId: string,
    ngoName: string,
    data: Omit<NgoCampaignItem, 'id' | 'ngoId' | 'ngoName' | 'createdAt' | 'updatedAt'>
  ): Promise<NgoCampaignItem> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    if (!state.ngo_campaigns) state.ngo_campaigns = [];

    const now = new Date().toISOString();
    const id = `cmp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    const record: NgoCampaignRecord = {
      id,
      ngo_id: ngoId,
      ngo_name: ngoName,
      title: data.title,
      description: data.description,
      cause: data.cause,
      objective: data.objective,
      donation_types_accepted: JSON.stringify(data.donationTypesAccepted || []),
      location: data.location,
      start_date: data.startDate,
      end_date: data.endDate,
      target_units: data.targetUnits,
      collected_units: data.collectedUnits,
      contact: data.contact,
      status: data.status,
      created_at: now,
      updated_at: now,
    };

    state.ngo_campaigns.unshift(record);
    db.save();

    return {
      id: record.id,
      ngoId: record.ngo_id,
      ngoName: record.ngo_name,
      title: record.title,
      description: record.description,
      cause: record.cause as NgoCauseCategory,
      objective: record.objective,
      donationTypesAccepted: JSON.parse(record.donation_types_accepted),
      location: record.location,
      startDate: record.start_date,
      endDate: record.end_date,
      targetUnits: record.target_units,
      collectedUnits: record.collected_units,
      contact: record.contact,
      status: record.status as NgoCampaignStatus,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    };
  }

  public static async updateCampaign(
    ngoId: string,
    campaignId: string,
    updates: Partial<NgoCampaignItem>
  ): Promise<NgoCampaignItem | null> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    const item = state.ngo_campaigns?.find((c) => c.id === campaignId && c.ngo_id === ngoId);
    if (!item) return null;

    if (updates.title !== undefined) item.title = updates.title;
    if (updates.description !== undefined) item.description = updates.description;
    if (updates.cause !== undefined) item.cause = updates.cause;
    if (updates.objective !== undefined) item.objective = updates.objective;
    if (updates.donationTypesAccepted !== undefined) item.donation_types_accepted = JSON.stringify(updates.donationTypesAccepted);
    if (updates.location !== undefined) item.location = updates.location;
    if (updates.startDate !== undefined) item.start_date = updates.startDate;
    if (updates.endDate !== undefined) item.end_date = updates.endDate;
    if (updates.targetUnits !== undefined) item.target_units = updates.targetUnits;
    if (updates.collectedUnits !== undefined) item.collected_units = updates.collectedUnits;
    if (updates.contact !== undefined) item.contact = updates.contact;
    if (updates.status !== undefined) item.status = updates.status;
    item.updated_at = new Date().toISOString();

    db.save();
    const campaigns = await this.getCampaigns(ngoId);
    return campaigns.find((c) => c.id === campaignId) || null;
  }

  public static async deleteCampaign(ngoId: string, campaignId: string): Promise<boolean> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    if (!state.ngo_campaigns) return false;

    const index = state.ngo_campaigns.findIndex((c) => c.id === campaignId && c.ngo_id === ngoId);
    if (index === -1) return false;

    state.ngo_campaigns.splice(index, 1);
    db.save();
    return true;
  }

  // ==================== EVENTS ====================

  public static async getEvents(ngoId: string): Promise<NgoEventItem[]> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    const records = state.ngo_events?.filter((e) => e.ngo_id === ngoId) || [];

    return records.map((r) => ({
      id: r.id,
      ngoId: r.ngo_id,
      ngoName: r.ngo_name,
      title: r.title,
      description: r.description,
      date: r.date,
      startTime: r.start_time,
      endTime: r.end_time,
      location: r.location,
      eventType: r.event_type as NgoEventItem['eventType'],
      participationType: r.participation_type as NgoEventItem['participationType'],
      contactInfo: r.contact_info,
      status: r.status as NgoEventStatus,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }

  public static async createEvent(
    ngoId: string,
    ngoName: string,
    data: Omit<NgoEventItem, 'id' | 'ngoId' | 'ngoName' | 'createdAt' | 'updatedAt'>
  ): Promise<NgoEventItem> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    if (!state.ngo_events) state.ngo_events = [];

    const now = new Date().toISOString();
    const id = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    const record: NgoEventRecord = {
      id,
      ngo_id: ngoId,
      ngo_name: ngoName,
      title: data.title,
      description: data.description,
      date: data.date,
      start_time: data.startTime,
      end_time: data.endTime,
      location: data.location,
      event_type: data.eventType,
      participation_type: data.participationType,
      contact_info: data.contactInfo,
      status: data.status,
      created_at: now,
      updated_at: now,
    };

    state.ngo_events.unshift(record);
    db.save();

    return {
      id: record.id,
      ngoId: record.ngo_id,
      ngoName: record.ngo_name,
      title: record.title,
      description: record.description,
      date: record.date,
      startTime: record.start_time,
      endTime: record.end_time,
      location: record.location,
      eventType: record.event_type as NgoEventItem['eventType'],
      participationType: record.participation_type as NgoEventItem['participationType'],
      contactInfo: record.contact_info,
      status: record.status as NgoEventStatus,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    };
  }

  public static async updateEvent(
    ngoId: string,
    eventId: string,
    updates: Partial<NgoEventItem>
  ): Promise<NgoEventItem | null> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    const item = state.ngo_events?.find((e) => e.id === eventId && e.ngo_id === ngoId);
    if (!item) return null;

    if (updates.title !== undefined) item.title = updates.title;
    if (updates.description !== undefined) item.description = updates.description;
    if (updates.date !== undefined) item.date = updates.date;
    if (updates.startTime !== undefined) item.start_time = updates.startTime;
    if (updates.endTime !== undefined) item.end_time = updates.endTime;
    if (updates.location !== undefined) item.location = updates.location;
    if (updates.eventType !== undefined) item.event_type = updates.eventType;
    if (updates.participationType !== undefined) item.participation_type = updates.participationType;
    if (updates.contactInfo !== undefined) item.contact_info = updates.contactInfo;
    if (updates.status !== undefined) item.status = updates.status;
    item.updated_at = new Date().toISOString();

    db.save();
    const events = await this.getEvents(ngoId);
    return events.find((e) => e.id === eventId) || null;
  }

  public static async deleteEvent(ngoId: string, eventId: string): Promise<boolean> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    if (!state.ngo_events) return false;

    const index = state.ngo_events.findIndex((e) => e.id === eventId && e.ngo_id === ngoId);
    if (index === -1) return false;

    state.ngo_events.splice(index, 1);
    db.save();
    return true;
  }

  // ==================== VOLUNTEER OPPORTUNITIES ====================

  public static async getVolunteerOps(ngoId: string): Promise<NgoVolunteerOp[]> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    const records = state.ngo_volunteer_ops?.filter((v) => v.ngo_id === ngoId) || [];

    return records.map((r) => ({
      id: r.id,
      ngoId: r.ngo_id,
      ngoName: r.ngo_name,
      title: r.title,
      description: r.description,
      requiredSkills: JSON.parse(r.required_skills || '[]'),
      cause: r.cause as NgoCauseCategory,
      location: r.location,
      dateTime: r.date_time,
      duration: r.duration,
      volunteersRequired: r.volunteers_required,
      volunteersEnrolled: r.volunteers_enrolled,
      opportunityType: r.opportunity_type as 'One-time' | 'Recurring',
      contact: r.contact,
      status: r.status as NgoVolunteerOpStatus,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }

  public static async createVolunteerOp(
    ngoId: string,
    ngoName: string,
    data: Omit<NgoVolunteerOp, 'id' | 'ngoId' | 'ngoName' | 'createdAt' | 'updatedAt'>
  ): Promise<NgoVolunteerOp> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    if (!state.ngo_volunteer_ops) state.ngo_volunteer_ops = [];

    const now = new Date().toISOString();
    const id = `vol_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    const record: NgoVolunteerOpRecord = {
      id,
      ngo_id: ngoId,
      ngo_name: ngoName,
      title: data.title,
      description: data.description,
      required_skills: JSON.stringify(data.requiredSkills || []),
      cause: data.cause,
      location: data.location,
      date_time: data.dateTime,
      duration: data.duration,
      volunteers_required: data.volunteersRequired,
      volunteers_enrolled: data.volunteersEnrolled || 0,
      opportunity_type: data.opportunityType,
      contact: data.contact,
      status: data.status,
      created_at: now,
      updated_at: now,
    };

    state.ngo_volunteer_ops.unshift(record);
    db.save();

    return {
      id: record.id,
      ngoId: record.ngo_id,
      ngoName: record.ngo_name,
      title: record.title,
      description: record.description,
      requiredSkills: JSON.parse(record.required_skills),
      cause: record.cause as NgoCauseCategory,
      location: record.location,
      dateTime: record.date_time,
      duration: record.duration,
      volunteersRequired: record.volunteers_required,
      volunteersEnrolled: record.volunteers_enrolled,
      opportunityType: record.opportunity_type as 'One-time' | 'Recurring',
      contact: record.contact,
      status: record.status as NgoVolunteerOpStatus,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    };
  }

  public static async updateVolunteerOp(
    ngoId: string,
    opId: string,
    updates: Partial<NgoVolunteerOp>
  ): Promise<NgoVolunteerOp | null> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    const item = state.ngo_volunteer_ops?.find((v) => v.id === opId && v.ngo_id === ngoId);
    if (!item) return null;

    if (updates.title !== undefined) item.title = updates.title;
    if (updates.description !== undefined) item.description = updates.description;
    if (updates.requiredSkills !== undefined) item.required_skills = JSON.stringify(updates.requiredSkills);
    if (updates.cause !== undefined) item.cause = updates.cause;
    if (updates.location !== undefined) item.location = updates.location;
    if (updates.dateTime !== undefined) item.date_time = updates.dateTime;
    if (updates.duration !== undefined) item.duration = updates.duration;
    if (updates.volunteersRequired !== undefined) item.volunteers_required = updates.volunteersRequired;
    if (updates.volunteersEnrolled !== undefined) item.volunteers_enrolled = updates.volunteersEnrolled;
    if (updates.opportunityType !== undefined) item.opportunity_type = updates.opportunityType;
    if (updates.contact !== undefined) item.contact = updates.contact;
    if (updates.status !== undefined) item.status = updates.status;
    item.updated_at = new Date().toISOString();

    db.save();
    const ops = await this.getVolunteerOps(ngoId);
    return ops.find((v) => v.id === opId) || null;
  }

  public static async deleteVolunteerOp(ngoId: string, opId: string): Promise<boolean> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    if (!state.ngo_volunteer_ops) return false;

    const index = state.ngo_volunteer_ops.findIndex((v) => v.id === opId && v.ngo_id === ngoId);
    if (index === -1) return false;

    state.ngo_volunteer_ops.splice(index, 1);
    db.save();
    return true;
  }

  // ==================== HELP REQUESTS (TWO-WAY CONNECTION) ====================

  public static async getIncomingHelpRequests(ngoId: string): Promise<HelpRequest[]> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    const records = state.help_requests?.filter((r) => r.ngo_id === ngoId) || [];

    return records.map((r) => ({
      id: r.id,
      userId: r.user_id,
      citizenName: r.citizen_name,
      citizenPhone: r.citizen_phone,
      citizenEmail: r.citizen_email,
      ngoId: r.ngo_id,
      ngoName: r.ngo_name,
      category: r.category as HelpServiceCategory,
      needTitle: r.need_title,
      needDescription: r.need_description,
      itemsRequested: r.items_requested,
      location: r.location,
      urgency: r.urgency as 'Immediate' | 'Within a week' | 'Flexible',
      status: r.status as HelpRequestStatus,
      ngoNotes: r.ngo_notes,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }

  public static async getUserHelpRequests(userId: string): Promise<HelpRequest[]> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    const records = state.help_requests?.filter((r) => r.user_id === userId) || [];

    return records.map((r) => ({
      id: r.id,
      userId: r.user_id,
      citizenName: r.citizen_name,
      citizenPhone: r.citizen_phone,
      citizenEmail: r.citizen_email,
      ngoId: r.ngo_id,
      ngoName: r.ngo_name,
      category: r.category as HelpServiceCategory,
      needTitle: r.need_title,
      needDescription: r.need_description,
      itemsRequested: r.items_requested,
      location: r.location,
      urgency: r.urgency as 'Immediate' | 'Within a week' | 'Flexible',
      status: r.status as HelpRequestStatus,
      ngoNotes: r.ngo_notes,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }

  public static async createHelpRequest(
    userId: string,
    data: {
      citizenName: string;
      citizenPhone: string;
      citizenEmail?: string;
      ngoId: string;
      ngoName?: string;
      category: HelpServiceCategory;
      needTitle: string;
      needDescription: string;
      itemsRequested?: string;
      location: string;
      urgency: 'Immediate' | 'Within a week' | 'Flexible';
    }
  ): Promise<HelpRequest> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    if (!state.help_requests) state.help_requests = [];

    const now = new Date().toISOString();
    const id = `req_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    const record: HelpRequestRecord = {
      id,
      user_id: userId,
      citizen_name: data.citizenName,
      citizen_phone: data.citizenPhone,
      citizen_email: data.citizenEmail,
      ngo_id: data.ngoId,
      ngo_name: data.ngoName,
      category: data.category,
      need_title: data.needTitle,
      need_description: data.needDescription,
      items_requested: data.itemsRequested,
      location: data.location,
      urgency: data.urgency,
      status: 'New',
      created_at: now,
      updated_at: now,
    };

    state.help_requests.unshift(record);
    db.save();

    return {
      id: record.id,
      userId: record.user_id,
      citizenName: record.citizen_name,
      citizenPhone: record.citizen_phone,
      citizenEmail: record.citizen_email,
      ngoId: record.ngo_id,
      ngoName: record.ngo_name,
      category: record.category as HelpServiceCategory,
      needTitle: record.need_title,
      needDescription: record.need_description,
      itemsRequested: record.items_requested,
      location: record.location,
      urgency: record.urgency as 'Immediate' | 'Within a week' | 'Flexible',
      status: record.status as HelpRequestStatus,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    };
  }

  public static async updateHelpRequestStatus(
    ngoId: string,
    requestId: string,
    status: HelpRequestStatus,
    ngoNotes?: string
  ): Promise<HelpRequest | null> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    const record = state.help_requests?.find((r) => r.id === requestId && r.ngo_id === ngoId);
    if (!record) return null;

    record.status = status;
    if (ngoNotes !== undefined) record.ngo_notes = ngoNotes;
    record.updated_at = new Date().toISOString();

    db.save();

    return {
      id: record.id,
      userId: record.user_id,
      citizenName: record.citizen_name,
      citizenPhone: record.citizen_phone,
      citizenEmail: record.citizen_email,
      ngoId: record.ngo_id,
      ngoName: record.ngo_name,
      category: record.category as HelpServiceCategory,
      needTitle: record.need_title,
      needDescription: record.need_description,
      itemsRequested: record.items_requested,
      location: record.location,
      urgency: record.urgency as 'Immediate' | 'Within a week' | 'Flexible',
      status: record.status as HelpRequestStatus,
      ngoNotes: record.ngo_notes,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    };
  }

  // ==================== OVERVIEW COUNTS ====================

  public static async getOverviewMetrics(ngoId: string): Promise<{
    activeNeedsCount: number;
    activeCampaignsCount: number;
    upcomingEventsCount: number;
    volunteerOpsCount: number;
    newHelpRequestsCount: number;
  }> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();

    const activeNeeds = state.ngo_donation_needs?.filter(
      (n) => n.ngo_id === ngoId && (n.status === 'Accepting' || n.status === 'Partially Fulfilled')
    ).length || 0;

    const activeCampaigns = state.ngo_campaigns?.filter(
      (c) => c.ngo_id === ngoId && c.status === 'Active'
    ).length || 0;

    const upcomingEvents = state.ngo_events?.filter(
      (e) => e.ngo_id === ngoId && e.status === 'Active'
    ).length || 0;

    const volunteerOps = state.ngo_volunteer_ops?.filter(
      (v) => v.ngo_id === ngoId && v.status === 'Active'
    ).length || 0;

    const newHelpRequests = state.help_requests?.filter(
      (r) => r.ngo_id === ngoId && (r.status === 'New' || r.status === 'Under Review')
    ).length || 0;

    return {
      activeNeedsCount: activeNeeds,
      activeCampaignsCount: activeCampaigns,
      upcomingEventsCount: upcomingEvents,
      volunteerOpsCount: volunteerOps,
      newHelpRequestsCount: newHelpRequests,
    };
  }
}
