import fs from 'fs';
import path from 'path';

export interface UserRecord {
  id: string;
  email: string;
  password_hash: string;
  role: 'ngo' | 'user';
  created_at: string;
  updated_at: string;
}

export interface NgoProfileRecord {
  id: string;
  user_id: string;
  ngo_name: string;
  registration_number: string;
  focus_sector: string;
  contact_person: string;
  phone_number: string;
  state: string;
  city?: string;
  address?: string;
  verified: number; // 0 or 1
  created_at: string;
  updated_at: string;
}

export interface CitizenProfileRecord {
  id: string;
  user_id: string;
  full_name: string;
  phone_number?: string;
  state?: string;
  preferred_language?: string;
  created_at: string;
  updated_at: string;
}

export interface SchemeRecord {
  id: string;
  name: string;
  short_description: string;
  full_description: string;
  sector: string;
  department: string;
  target_beneficiaries: string; // JSON array
  applicable_states: string; // JSON array
  aid_type: string;
  status: string;
  eligibility_criteria: string; // JSON array
  required_documents: string; // JSON array
  application_process: string; // JSON array
  official_source: string;
  last_updated: string;
  tags: string; // JSON array
  is_sample: number; // 1 = demo data
  created_at: string;
}

export interface SavedSchemeRecord {
  id: string;
  ngo_id: string;
  scheme_id: string;
  saved_at: string;
}

export interface ApplicationRecord {
  id: string;
  ngo_id: string;
  scheme_id?: string;
  scheme_title: string;
  department?: string;
  reference_number: string;
  status: string;
  next_action: string;
  form_data?: string; // JSON serialized ApplicationFormData
  submission_deadline?: string;
  submitted_at?: string;
  is_sample: number; // 1 = sample
  created_at: string;
  updated_at: string;
}

export interface StatusHistoryRecord {
  id: string;
  application_id: string;
  status: string;
  comment?: string;
  changed_by: string;
  created_at: string;
}

export interface DocumentRecord {
  id: string;
  ngo_id: string;
  name: string;
  category: string;
  status: string;
  valid_till?: string;
  notes?: string;
  is_required: number;
  created_at: string;
  updated_at: string;
}

export interface SavedUserNgoRecord {
  id: string;
  user_id: string;
  ngo_id: string;
  saved_at: string;
}

export interface UserPreferencesRecord {
  id: string;
  user_id: string;
  default_location?: string; // JSON serialized UserLocation
  preferred_donation_types?: string; // JSON array
  preferred_causes?: string; // JSON array
  preferred_distance_km?: string;
  updated_at: string;
}

export interface NgoPublicProfileRecord {
  id: string;
  ngo_id: string;
  ngo_name: string;
  about: string;
  logo_url?: string;
  primary_cause: string;
  additional_causes: string; // JSON array
  address: string;
  city: string;
  district?: string;
  state: string;
  pincode: string;
  operating_areas: string; // JSON array
  contact_person: string;
  phone: string;
  email: string;
  website?: string;
  accepted_donation_types: string; // JSON array
  services_provided: string; // JSON array
  operating_hours?: string;
  established_year?: number;
  latitude: number;
  longitude: number;
  updated_at: string;
}

export interface NgoDonationNeedRecord {
  id: string;
  ngo_id: string;
  ngo_name: string;
  title: string;
  category: string;
  cause_category?: string;
  description: string;
  items_required: string;
  quantity_needed?: string;
  quantity_collected?: string;
  location: string;
  preferred_contribution_type: string;
  start_date?: string;
  end_date?: string;
  dropoff_info?: string;
  accepts_courier: number; // 0 or 1
  contact_info: string;
  status: string;
  urgency: string;
  created_at: string;
  updated_at: string;
}

export interface NgoCampaignRecord {
  id: string;
  ngo_id: string;
  ngo_name: string;
  title: string;
  description: string;
  cause: string;
  objective: string;
  donation_types_accepted: string; // JSON array
  location: string;
  start_date: string;
  end_date: string;
  target_units?: string;
  collected_units?: string;
  contact: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface NgoEventRecord {
  id: string;
  ngo_id: string;
  ngo_name: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  event_type: string;
  participation_type: string;
  contact_info: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface NgoVolunteerOpRecord {
  id: string;
  ngo_id: string;
  ngo_name: string;
  title: string;
  description: string;
  required_skills: string; // JSON array
  cause: string;
  location: string;
  date_time: string;
  duration: string;
  volunteers_required: number;
  volunteers_enrolled?: number;
  opportunity_type: string;
  contact: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface HelpRequestRecord {
  id: string;
  user_id: string;
  citizen_name: string;
  citizen_phone: string;
  citizen_email?: string;
  ngo_id: string;
  ngo_name?: string;
  category: string;
  need_title: string;
  need_description: string;
  items_requested?: string;
  location: string;
  urgency: string;
  status: string;
  ngo_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface RegistrationGuideProgressRecord {
  id: string;
  user_id: string;
  answers: string; // JSON serialized QuestionnaireAnswers
  checked_document_ids: string; // JSON array
  saved_portal_ids: string; // JSON array
  saved_scheme_ids: string; // JSON array
  current_step_index: number;
  last_updated: string;
}

export interface DatabaseState {
  users: UserRecord[];
  ngo_profiles: NgoProfileRecord[];
  citizen_profiles: CitizenProfileRecord[];
  schemes: SchemeRecord[];
  saved_schemes: SavedSchemeRecord[];
  applications: ApplicationRecord[];
  application_status_history: StatusHistoryRecord[];
  documents: DocumentRecord[];
  saved_user_ngos: SavedUserNgoRecord[];
  user_preferences: UserPreferencesRecord[];
  ngo_public_profiles: NgoPublicProfileRecord[];
  ngo_donation_needs: NgoDonationNeedRecord[];
  ngo_campaigns: NgoCampaignRecord[];
  ngo_events: NgoEventRecord[];
  ngo_volunteer_ops: NgoVolunteerOpRecord[];
  help_requests: HelpRequestRecord[];
  registration_guide_progress: RegistrationGuideProgressRecord[];
}

const DEFAULT_STATE: DatabaseState = {
  users: [],
  ngo_profiles: [],
  citizen_profiles: [],
  schemes: [],
  saved_schemes: [],
  applications: [],
  application_status_history: [],
  documents: [],
  saved_user_ngos: [],
  user_preferences: [],
  ngo_public_profiles: [],
  ngo_donation_needs: [],
  ngo_campaigns: [],
  ngo_events: [],
  ngo_volunteer_ops: [],
  help_requests: [],
  registration_guide_progress: [],
};

export class Database {
  private static instance: Database;
  private filePath: string;
  private state: DatabaseState;
  private initialized: boolean = false;

  private constructor() {
    const dataDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch {
        // Handled if directory exists
      }
    }
    this.filePath = path.join(dataDir, 'sahaysetu.json');
    this.state = this.loadState();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private loadState(): DatabaseState {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        return { ...DEFAULT_STATE, ...JSON.parse(raw) };
      }
    } catch (e) {
      console.error('[Database] Failed to read database file, initializing default:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  public save(): void {
    try {
      const dataDir = path.dirname(this.filePath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch (e) {
      console.error('[Database] Failed to save database state:', e);
    }
  }


  public getState(): DatabaseState {
    return this.state;
  }

  public reset(): void {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.save();
    this.initialized = false;
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public setInitialized(value: boolean): void {
    this.initialized = value;
  }
}
