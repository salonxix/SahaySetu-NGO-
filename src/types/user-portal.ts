export type DonationType =
  | 'Money'
  | 'Clothes'
  | 'Books'
  | 'Food'
  | 'Medicines'
  | 'Stationery'
  | 'Toys'
  | 'Electronics'
  | 'Furniture'
  | 'Volunteer time'
  | 'Other';

export type NgoCauseCategory =
  | 'Education'
  | 'Healthcare'
  | 'Children'
  | 'Women & Girls'
  | 'Elderly'
  | 'Disability Support'
  | 'Environment'
  | 'Animal Welfare'
  | 'Rural Development'
  | 'Disaster Relief';

export type NeedStatus = 'Accepting' | 'Paused' | 'Fulfilled';
export type NeedUrgency = 'Immediate' | 'Regular' | 'Low';

export interface NgoNeedItem {
  id: string;
  item: string;
  category: DonationType;
  quantityNeeded: string;
  quantityCollected?: string;
  status: NeedStatus;
  urgency: NeedUrgency;
  closingDate?: string;
  dropoffInstructions?: string;
  acceptsCourier?: boolean;
}

export interface NgoCampaign {
  id: string;
  ngoId: string;
  ngoName: string;
  title: string;
  cause: NgoCauseCategory;
  description: string;
  targetAmountOrUnits?: string;
  collectedAmountOrUnits?: string;
  deadline?: string;
  needsRequested: string[];
  locationLabel: string;
  distanceKm?: number;
  isSample: boolean;
}

export type EventType =
  | 'Donation Drive'
  | 'Collection Camp'
  | 'Volunteer Event'
  | 'Awareness Event';

export interface NgoEvent {
  id: string;
  ngoId: string;
  ngoName: string;
  title: string;
  eventType: EventType;
  date: string;
  time: string;
  venue: string;
  description: string;
  participationAction: string;
  contactPhone?: string;
  distanceKm?: number;
  isSample: boolean;
}

export interface PublicNgoOrg {
  id: string;
  name: string;
  registrationNumber: string; // Darpan / Unique ID
  about: string;
  primaryCauses: NgoCauseCategory[];
  acceptedDonationTypes: DonationType[];
  servicesProvided?: string[];
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  website?: string;
  verified: boolean;
  establishedYear?: number;
  operatingHours?: string;
  currentNeeds: NgoNeedItem[];
  activeCampaigns: NgoCampaign[];
  upcomingEvents: NgoEvent[];
  volunteerOpportunities?: {
    id: string;
    title: string;
    description: string;
    requiredSkills: string[];
    cause: NgoCauseCategory;
    location: string;
    dateTime: string;
    duration: string;
    volunteersRequired: number;
    opportunityType: 'One-time' | 'Recurring';
    contact: string;
  }[];
  distanceKm?: number;
  isSample: boolean;
}

export interface UserLocation {
  label: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  isCustomOrBrowser: boolean;
}

export interface CitizenPreferences {
  userId: string;
  defaultLocation: UserLocation;
  savedNgoIds: string[];
  preferredDonationTypes: DonationType[];
  preferredCauses: NgoCauseCategory[];
  preferredDistanceKm: number | 'all';
}

export interface DistanceFilterOption {
  label: string;
  value: number | 'all';
}

export type ViewMode = 'list' | 'map';
