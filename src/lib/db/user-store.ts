import { Database, type SavedUserNgoRecord, type UserPreferencesRecord } from './database';
import { MOCK_PUBLIC_NGOS } from '../user/mock-ngos';
import { calculateDistanceKm, DEFAULT_USER_LOCATION } from '../user/distance';
import type {
  PublicNgoOrg,
  DonationType,
  NgoCauseCategory,
  UserLocation,
  CitizenPreferences,
  NgoNeedItem,
  NgoCampaign,
  NgoEvent,
} from '@/types/user-portal';
import type { HelpServiceCategory } from '@/types/ngo-publish';
import { ensureDatabaseSeeded } from './seed';

export interface NgoFilterCriteria {
  userLocation?: UserLocation;
  maxDistanceKm?: number | 'all';
  donationTypes?: DonationType[];
  cause?: NgoCauseCategory | 'all';
  serviceCategory?: HelpServiceCategory | 'all';
  searchQuery?: string;
  needHelpMode?: boolean;
}

export class UserStore {
  /**
   * Builds the comprehensive list of public NGOs, pulling dynamic updates from
   * database tables (profiles, needs, campaigns, events, volunteer ops)
   * merged with prototype records.
   */
  private static async getAllNgosFromDb(): Promise<PublicNgoOrg[]> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();

    // Map base mock NGOs
    const orgMap = new Map<string, PublicNgoOrg>();
    for (const mockNgo of MOCK_PUBLIC_NGOS) {
      orgMap.set(mockNgo.id, { ...mockNgo });
    }

    // Merge or add published NGO profiles
    if (state.ngo_public_profiles) {
      for (const p of state.ngo_public_profiles) {
        const existing = orgMap.get(p.ngo_id) || orgMap.get(p.id);
        const primaryCauses: NgoCauseCategory[] = [
          p.primary_cause as NgoCauseCategory,
          ...JSON.parse(p.additional_causes || '[]'),
        ];
        const acceptedDonations: DonationType[] = JSON.parse(p.accepted_donation_types || '[]');
        const servicesProvided: string[] = JSON.parse(p.services_provided || '[]');

        const baseOrg: PublicNgoOrg = {
          id: p.ngo_id,
          name: p.ngo_name,
          registrationNumber: existing?.registrationNumber || 'REG-' + p.ngo_id.slice(-6).toUpperCase(),
          about: p.about,
          primaryCauses,
          acceptedDonationTypes: acceptedDonations,
          servicesProvided,
          latitude: p.latitude || 28.6139,
          longitude: p.longitude || 77.209,
          address: p.address,
          city: p.city,
          state: p.state,
          pincode: p.pincode,
          phone: p.phone,
          email: p.email,
          website: p.website,
          verified: true,
          establishedYear: p.established_year,
          operatingHours: p.operating_hours,
          currentNeeds: [],
          activeCampaigns: [],
          upcomingEvents: [],
          volunteerOpportunities: [],
          isSample: false,
        };

        orgMap.set(p.ngo_id, baseOrg);
      }
    }

    // Attach published Donation Needs from DB
    if (state.ngo_donation_needs) {
      for (const need of state.ngo_donation_needs) {
        // Only active/accepting/partially fulfilled needs appear for citizens
        if (need.status === 'Draft' || need.status === 'Expired') continue;

        const org = orgMap.get(need.ngo_id);
        if (org) {
          const item: NgoNeedItem = {
            id: need.id,
            item: need.title,
            category: need.category as DonationType,
            quantityNeeded: need.quantity_needed || need.items_required,
            quantityCollected: need.quantity_collected,
            status: need.status === 'Fulfilled' ? 'Fulfilled' : need.status === 'Paused' ? 'Paused' : 'Accepting',
            urgency: need.urgency === 'Immediate' ? 'Immediate' : need.urgency === 'Low' ? 'Low' : 'Regular',
            closingDate: need.end_date,
            dropoffInstructions: need.dropoff_info,
            acceptsCourier: need.accepts_courier === 1,
          };
          // Filter out duplicate if existing
          org.currentNeeds = [item, ...org.currentNeeds.filter((n) => n.id !== need.id)];
        }
      }
    }

    // Attach published Campaigns from DB
    if (state.ngo_campaigns) {
      for (const cmp of state.ngo_campaigns) {
        if (cmp.status !== 'Active') continue;

        const org = orgMap.get(cmp.ngo_id);
        if (org) {
          const item: NgoCampaign = {
            id: cmp.id,
            ngoId: cmp.ngo_id,
            ngoName: cmp.ngo_name,
            title: cmp.title,
            cause: cmp.cause as NgoCauseCategory,
            description: cmp.description,
            targetAmountOrUnits: cmp.target_units,
            collectedAmountOrUnits: cmp.collected_units,
            deadline: cmp.end_date,
            needsRequested: JSON.parse(cmp.donation_types_accepted || '[]'),
            locationLabel: cmp.location,
            isSample: false,
          };
          org.activeCampaigns = [item, ...org.activeCampaigns.filter((c) => c.id !== cmp.id)];
        }
      }
    }

    // Attach published Events from DB
    if (state.ngo_events) {
      for (const evt of state.ngo_events) {
        if (evt.status !== 'Active') continue;

        const org = orgMap.get(evt.ngo_id);
        if (org) {
          const item: NgoEvent = {
            id: evt.id,
            ngoId: evt.ngo_id,
            ngoName: evt.ngo_name,
            title: evt.title,
            eventType: evt.event_type as NgoEvent['eventType'],
            date: evt.date,
            time: `${evt.start_time} - ${evt.end_time}`,
            venue: evt.location,
            description: evt.description,
            participationAction: evt.participation_type,
            contactPhone: evt.contact_info,
            isSample: false,
          };
          org.upcomingEvents = [item, ...org.upcomingEvents.filter((e) => e.id !== evt.id)];
        }
      }
    }

    // Attach published Volunteer Opportunities from DB
    if (state.ngo_volunteer_ops) {
      for (const vol of state.ngo_volunteer_ops) {
        if (vol.status !== 'Active') continue;

        const org = orgMap.get(vol.ngo_id);
        if (org) {
          if (!org.volunteerOpportunities) org.volunteerOpportunities = [];
          const item = {
            id: vol.id,
            title: vol.title,
            description: vol.description,
            requiredSkills: JSON.parse(vol.required_skills || '[]'),
            cause: vol.cause as NgoCauseCategory,
            location: vol.location,
            dateTime: vol.date_time,
            duration: vol.duration,
            volunteersRequired: vol.volunteers_required,
            opportunityType: vol.opportunity_type as 'One-time' | 'Recurring',
            contact: vol.contact,
          };
          org.volunteerOpportunities = [item, ...org.volunteerOpportunities.filter((v) => v.id !== vol.id)];
        }
      }
    }

    return Array.from(orgMap.values());
  }

  /**
   * Retrieves public NGOs list with calculated distances relative to userLocation,
   * applying filtering criteria if provided.
   */
  public static async getPublicNgos(criteria: NgoFilterCriteria = {}): Promise<PublicNgoOrg[]> {
    const rawNgos = await this.getAllNgosFromDb();
    const location = criteria.userLocation || DEFAULT_USER_LOCATION;
    const query = criteria.searchQuery?.trim().toLowerCase();

    // Calculate distance for all NGOs from the selected user coordinates
    const ngosWithDistance = rawNgos.map((ngo) => {
      const distanceKm = calculateDistanceKm(
        location.latitude,
        location.longitude,
        ngo.latitude,
        ngo.longitude
      );

      const campaignsWithDistance = ngo.activeCampaigns.map((c) => ({
        ...c,
        distanceKm,
      }));

      const eventsWithDistance = ngo.upcomingEvents.map((e) => ({
        ...e,
        distanceKm,
      }));

      return {
        ...ngo,
        activeCampaigns: campaignsWithDistance,
        upcomingEvents: eventsWithDistance,
        distanceKm,
      };
    });

    // Apply Filters
    return ngosWithDistance.filter((ngo) => {
      // 1. Distance filter
      if (criteria.maxDistanceKm && criteria.maxDistanceKm !== 'all') {
        const dist = ngo.distanceKm ?? 0;
        if (dist > criteria.maxDistanceKm) {
          return false;
        }
      }

      // 2. Cause filter
      if (criteria.cause && criteria.cause !== 'all') {
        if (!ngo.primaryCauses.includes(criteria.cause)) {
          return false;
        }
      }

      // 3. Service Category filter ("I Need Help" mode)
      if (criteria.serviceCategory && criteria.serviceCategory !== 'all') {
        const services = ngo.servicesProvided || [];
        const matchesService = services.some(
          (s) => s.toLowerCase() === criteria.serviceCategory?.toLowerCase()
        );
        if (!matchesService) {
          return false;
        }
      }

      // 4. Donation type filter ("I Want to Help" mode)
      if (criteria.donationTypes && criteria.donationTypes.length > 0) {
        const matchesDonation = criteria.donationTypes.some((selectedType) =>
          ngo.acceptedDonationTypes.includes(selectedType)
        );
        if (!matchesDonation) {
          return false;
        }
      }

      // 5. Search query
      if (query) {
        const matchesName = ngo.name.toLowerCase().includes(query);
        const matchesAbout = ngo.about.toLowerCase().includes(query);
        const matchesCity = ngo.city.toLowerCase().includes(query);
        const matchesAddress = ngo.address.toLowerCase().includes(query);
        const matchesCauses = ngo.primaryCauses.some((c) =>
          c.toLowerCase().includes(query)
        );
        const matchesDonations = ngo.acceptedDonationTypes.some((d) =>
          d.toLowerCase().includes(query)
        );
        const matchesServices = (ngo.servicesProvided || []).some((s) =>
          s.toLowerCase().includes(query)
        );
        const matchesNeeds = ngo.currentNeeds.some((n) =>
          n.item.toLowerCase().includes(query)
        );
        const matchesCampaigns = ngo.activeCampaigns.some(
          (c) =>
            c.title.toLowerCase().includes(query) ||
            c.description.toLowerCase().includes(query)
        );

        if (
          !matchesName &&
          !matchesAbout &&
          !matchesCity &&
          !matchesAddress &&
          !matchesCauses &&
          !matchesDonations &&
          !matchesServices &&
          !matchesNeeds &&
          !matchesCampaigns
        ) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  }

  /**
   * Retrieves single public NGO by ID with distance computed from location
   */
  public static async getPublicNgoById(
    id: string,
    userLocation?: UserLocation
  ): Promise<PublicNgoOrg | null> {
    const ngos = await this.getPublicNgos({ userLocation });
    return ngos.find((n) => n.id === id) || null;
  }

  /**
   * Retrieves saved NGO IDs for a specific citizen user
   */
  public static async getSavedNgoIds(userId: string): Promise<string[]> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const records = db.getState().saved_user_ngos || [];
    return records.filter((r) => r.user_id === userId).map((r) => r.ngo_id);
  }

  /**
   * Toggles save status for an NGO for a citizen user
   */
  public static async toggleSaveNgo(
    userId: string,
    ngoId: string
  ): Promise<{ saved: boolean; savedNgoIds: string[] }> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    if (!state.saved_user_ngos) {
      state.saved_user_ngos = [];
    }

    const existingIndex = state.saved_user_ngos.findIndex(
      (r) => r.user_id === userId && r.ngo_id === ngoId
    );

    let saved = false;
    if (existingIndex >= 0) {
      state.saved_user_ngos.splice(existingIndex, 1);
      saved = false;
    } else {
      const record: SavedUserNgoRecord = {
        id: `saved_user_ngo_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        user_id: userId,
        ngo_id: ngoId,
        saved_at: new Date().toISOString(),
      };
      state.saved_user_ngos.push(record);
      saved = true;
    }

    db.save();
    const savedNgoIds = state.saved_user_ngos
      .filter((r) => r.user_id === userId)
      .map((r) => r.ngo_id);

    return { saved, savedNgoIds };
  }

  /**
   * Retrieves user preferences or returns default configuration
   */
  public static async getUserPreferences(userId: string): Promise<CitizenPreferences> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    if (!state.user_preferences) {
      state.user_preferences = [];
    }

    const prefRecord = state.user_preferences.find((p) => p.user_id === userId);
    const savedNgoIds = await this.getSavedNgoIds(userId);

    if (prefRecord) {
      let defaultLocation: UserLocation = DEFAULT_USER_LOCATION;
      if (prefRecord.default_location) {
        try {
          defaultLocation = JSON.parse(prefRecord.default_location);
        } catch {}
      }

      let preferredDonationTypes: DonationType[] = [];
      if (prefRecord.preferred_donation_types) {
        try {
          preferredDonationTypes = JSON.parse(prefRecord.preferred_donation_types);
        } catch {}
      }

      let preferredCauses: NgoCauseCategory[] = [];
      if (prefRecord.preferred_causes) {
        try {
          preferredCauses = JSON.parse(prefRecord.preferred_causes);
        } catch {}
      }

      let preferredDistanceKm: number | 'all' = 10;
      if (prefRecord.preferred_distance_km) {
        preferredDistanceKm =
          prefRecord.preferred_distance_km === 'all'
            ? 'all'
            : Number(prefRecord.preferred_distance_km) || 10;
      }

      return {
        userId,
        defaultLocation,
        savedNgoIds,
        preferredDonationTypes,
        preferredCauses,
        preferredDistanceKm,
      };
    }

    return {
      userId,
      defaultLocation: DEFAULT_USER_LOCATION,
      savedNgoIds,
      preferredDonationTypes: [],
      preferredCauses: [],
      preferredDistanceKm: 10,
    };
  }

  /**
   * Updates citizen user preferences
   */
  public static async updateUserPreferences(
    userId: string,
    updates: Partial<Omit<CitizenPreferences, 'userId' | 'savedNgoIds'>>
  ): Promise<CitizenPreferences> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    if (!state.user_preferences) {
      state.user_preferences = [];
    }

    const prefIndex = state.user_preferences.findIndex((p) => p.user_id === userId);
    const now = new Date().toISOString();

    if (prefIndex >= 0) {
      const existing = state.user_preferences[prefIndex];
      if (updates.defaultLocation) {
        existing.default_location = JSON.stringify(updates.defaultLocation);
      }
      if (updates.preferredDonationTypes) {
        existing.preferred_donation_types = JSON.stringify(updates.preferredDonationTypes);
      }
      if (updates.preferredCauses) {
        existing.preferred_causes = JSON.stringify(updates.preferredCauses);
      }
      if (updates.preferredDistanceKm !== undefined) {
        existing.preferred_distance_km = String(updates.preferredDistanceKm);
      }
      existing.updated_at = now;
    } else {
      const newRecord: UserPreferencesRecord = {
        id: `pref_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        user_id: userId,
        default_location: updates.defaultLocation ? JSON.stringify(updates.defaultLocation) : undefined,
        preferred_donation_types: updates.preferredDonationTypes ? JSON.stringify(updates.preferredDonationTypes) : undefined,
        preferred_causes: updates.preferredCauses ? JSON.stringify(updates.preferredCauses) : undefined,
        preferred_distance_km: updates.preferredDistanceKm !== undefined ? String(updates.preferredDistanceKm) : '10',
        updated_at: now,
      };
      state.user_preferences.push(newRecord);
    }

    db.save();
    return this.getUserPreferences(userId);
  }
}
