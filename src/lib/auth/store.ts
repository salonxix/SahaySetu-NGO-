import type {
  AuthUser,
  NgoUser,
  GeneralUser,
  SanitizedUser,
} from '@/types/auth';
import { Database, type UserRecord, type NgoProfileRecord, type CitizenProfileRecord } from '../db/database';
import { ensureDatabaseSeeded } from '../db/seed';

export async function ensureDemoUsers() {
  await ensureDatabaseSeeded();
}

// Automatically ensure seeded users on module load
void ensureDemoUsers();

function mapToAuthUser(
  userRecord: UserRecord,
  ngoProfile?: NgoProfileRecord | null,
  citizenProfile?: CitizenProfileRecord | null
): AuthUser {
  if (userRecord.role === 'ngo') {
    return {
      id: ngoProfile?.id || userRecord.id,
      email: userRecord.email,
      passwordHash: userRecord.password_hash,
      role: 'ngo',
      ngoName: ngoProfile?.ngo_name || 'Registered NGO',
      registrationNumber: ngoProfile?.registration_number || 'REG-PENDING',
      focusSector: ngoProfile?.focus_sector || 'General Welfare',
      contactPerson: ngoProfile?.contact_person || 'Nodal Officer',
      phoneNumber: ngoProfile?.phone_number || '',
      state: ngoProfile?.state || 'Delhi',
      city: ngoProfile?.city,
      address: ngoProfile?.address,
      verified: ngoProfile?.verified === 1,
      createdAt: userRecord.created_at,
      updatedAt: userRecord.updated_at,
    };
  }

  return {
    id: citizenProfile?.id || userRecord.id,
    email: userRecord.email,
    passwordHash: userRecord.password_hash,
    role: 'user',
    fullName: citizenProfile?.full_name || 'Citizen User',
    phoneNumber: citizenProfile?.phone_number,
    state: citizenProfile?.state,
    preferredLanguage: citizenProfile?.preferred_language,
    createdAt: userRecord.created_at,
    updatedAt: userRecord.updated_at,
  };
}

export class UserStore {
  static async findByEmail(email: string): Promise<AuthUser | null> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const emailKey = email.trim().toLowerCase();
    const user = db.getState().users.find((u) => u.email.toLowerCase() === emailKey);

    if (!user) return null;

    if (user.role === 'ngo') {
      const ngoProfile = db.getState().ngo_profiles.find((p) => p.user_id === user.id);
      return mapToAuthUser(user, ngoProfile);
    } else {
      const citizenProfile = db.getState().citizen_profiles.find((p) => p.user_id === user.id);
      return mapToAuthUser(user, null, citizenProfile);
    }
  }

  static async findById(id: string): Promise<AuthUser | null> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();

    // Check by user ID or profile ID
    let user = state.users.find((u) => u.id === id);
    let ngoProfile: NgoProfileRecord | undefined;
    let citizenProfile: CitizenProfileRecord | undefined;

    if (!user) {
      // Check if id is a ngo_profile id
      const foundNgo = state.ngo_profiles.find((p) => p.id === id);
      if (foundNgo) {
        ngoProfile = foundNgo;
        user = state.users.find((u) => u.id === foundNgo.user_id);
      } else {
        // Check if id is a citizen_profile id
        const foundCitizen = state.citizen_profiles.find((p) => p.id === id);
        if (foundCitizen) {
          citizenProfile = foundCitizen;
          user = state.users.find((u) => u.id === foundCitizen.user_id);
        }
      }
    } else {
      const currentUserId = user.id;
      if (user.role === 'ngo') {
        ngoProfile = state.ngo_profiles.find((p) => p.user_id === currentUserId);
      } else {
        citizenProfile = state.citizen_profiles.find((p) => p.user_id === currentUserId);
      }
    }

    if (!user) return null;

    return mapToAuthUser(user, ngoProfile, citizenProfile);
  }


  static async createNgoUser(
    data: Omit<NgoUser, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<NgoUser> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    const emailKey = data.email.trim().toLowerCase();

    if (state.users.some((u) => u.email.toLowerCase() === emailKey)) {
      throw new Error('An account with this email address already exists');
    }

    const now = new Date().toISOString();
    const userId = `usr_ngo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const ngoProfileId = `ngo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const userRecord: UserRecord = {
      id: userId,
      email: emailKey,
      password_hash: data.passwordHash,
      role: 'ngo',
      created_at: now,
      updated_at: now,
    };

    const ngoRecord: NgoProfileRecord = {
      id: ngoProfileId,
      user_id: userId,
      ngo_name: data.ngoName,
      registration_number: data.registrationNumber,
      focus_sector: data.focusSector,
      contact_person: data.contactPerson,
      phone_number: data.phoneNumber,
      state: data.state,
      city: data.city,
      address: data.address,
      verified: data.verified ? 1 : 0,
      created_at: now,
      updated_at: now,
    };

    state.users.push(userRecord);
    state.ngo_profiles.push(ngoRecord);
    db.save();

    return {
      ...data,
      id: ngoProfileId,
      email: emailKey,
      createdAt: now,
      updatedAt: now,
    };
  }

  static async createGeneralUser(
    data: Omit<GeneralUser, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<GeneralUser> {
    await ensureDatabaseSeeded();
    const db = Database.getInstance();
    const state = db.getState();
    const emailKey = data.email.trim().toLowerCase();

    if (state.users.some((u) => u.email.toLowerCase() === emailKey)) {
      throw new Error('An account with this email address already exists');
    }

    const now = new Date().toISOString();
    const userId = `usr_ctz_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const citizenProfileId = `ctz_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const userRecord: UserRecord = {
      id: userId,
      email: emailKey,
      password_hash: data.passwordHash,
      role: 'user',
      created_at: now,
      updated_at: now,
    };

    const citizenRecord: CitizenProfileRecord = {
      id: citizenProfileId,
      user_id: userId,
      full_name: data.fullName,
      phone_number: data.phoneNumber,
      state: data.state,
      preferred_language: data.preferredLanguage,
      created_at: now,
      updated_at: now,
    };

    state.users.push(userRecord);
    state.citizen_profiles.push(citizenRecord);
    db.save();

    return {
      ...data,
      id: citizenProfileId,
      email: emailKey,
      createdAt: now,
      updatedAt: now,
    };
  }

  static sanitizeUser(user: AuthUser): SanitizedUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }

  static clear(): void {
    const db = Database.getInstance();
    db.reset();
  }
}

