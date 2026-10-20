export type UserRole = 'ngo' | 'user';

export interface BaseUser {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NgoUser extends BaseUser {
  role: 'ngo';
  ngoName: string;
  registrationNumber: string; // NGO Darpan / Unique Reg ID
  focusSector: string; // Education, Healthcare, Rural Development, etc.
  contactPerson: string;
  phoneNumber: string;
  state: string;
  city?: string;
  address?: string;
  verified?: boolean;
}

export interface GeneralUser extends BaseUser {
  role: 'user';
  fullName: string;
  phoneNumber?: string;
  state?: string;
  preferredLanguage?: string;
}

export type AuthUser = NgoUser | GeneralUser;

export type SanitizedUser =
  | Omit<NgoUser, 'passwordHash'>
  | Omit<GeneralUser, 'passwordHash'>;

export interface AuthSession {
  userId: string;
  email: string;
  role: UserRole;
  displayName: string;
  expiresAt: number;
}
