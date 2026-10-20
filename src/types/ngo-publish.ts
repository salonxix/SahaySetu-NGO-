import type { DonationType, NgoCauseCategory } from './user-portal';

export type NgoNeedStatus =
  | 'Draft'
  | 'Accepting'
  | 'Paused'
  | 'Partially Fulfilled'
  | 'Fulfilled'
  | 'Expired';

export type NgoCampaignStatus =
  | 'Draft'
  | 'Active'
  | 'Paused'
  | 'Completed'
  | 'Expired';

export type NgoEventStatus =
  | 'Draft'
  | 'Active'
  | 'Cancelled'
  | 'Completed';

export type NgoVolunteerOpStatus =
  | 'Draft'
  | 'Active'
  | 'Paused'
  | 'Closed';

export type HelpRequestStatus =
  | 'New'
  | 'Under Review'
  | 'Accepted'
  | 'Declined'
  | 'Resolved';

export type HelpServiceCategory =
  | 'Food assistance'
  | 'Education support'
  | 'Medical assistance'
  | 'Medicine assistance'
  | 'Shelter support'
  | 'Employment support'
  | 'Women support'
  | 'Child welfare'
  | 'Elderly support'
  | 'Disability support'
  | 'Government scheme assistance'
  | 'Disaster support';

export const ALL_HELP_SERVICES: { id: HelpServiceCategory; label: string; icon: string; description: string }[] = [
  { id: 'Food assistance', label: 'Food Assistance', icon: '🍲', description: 'Grain rations, cooked meals, nutritional kits' },
  { id: 'Education support', label: 'Education Support', icon: '📚', description: 'Books, school fees, tutoring, digital devices' },
  { id: 'Medical assistance', label: 'Medical Assistance', icon: '🏥', description: 'Health checkups, hospital navigation, patient aid' },
  { id: 'Medicine assistance', label: 'Medicine Assistance', icon: '💊', description: 'Essential prescription medicines, healthcare supplies' },
  { id: 'Shelter support', label: 'Shelter Support', icon: '🏠', description: 'Temporary housing, emergency shelter, bedding' },
  { id: 'Employment support', label: 'Employment Support', icon: '💼', description: 'Skill training, job linkages, livelihood tools' },
  { id: 'Women support', label: 'Women Support', icon: '👩', description: 'Self-help groups, legal aid, safety, maternal health' },
  { id: 'Child welfare', label: 'Child Welfare', icon: '🧒', description: 'Child care, nutrition, adoption aid, protection' },
  { id: 'Elderly support', label: 'Elderly Support', icon: '👴', description: 'Elder care, companionship, pensions guidance' },
  { id: 'Disability support', label: 'Disability Support', icon: '♿', description: 'Assistive devices, accessibility aid, therapy' },
  { id: 'Government scheme assistance', label: 'Govt Scheme Assistance', icon: '🏛️', description: 'Application help for Aadhaar, ration cards, pensions, schemes' },
  { id: 'Disaster support', label: 'Disaster Support', icon: '🚨', description: 'Flood/fire relief, dry rations, rehabilitation' },
];

export const ALL_DONATION_TYPES: DonationType[] = [
  'Money',
  'Books',
  'Clothes',
  'Food',
  'Medicines',
  'Stationery',
  'Toys',
  'Electronics',
  'Furniture',
  'Volunteer time',
  'Other',
];

export interface NgoPublishProfile {
  id: string;
  ngoId: string;
  ngoName: string;
  about: string;
  logoUrl?: string;
  primaryCause: NgoCauseCategory;
  additionalCauses: NgoCauseCategory[];
  address: string;
  city: string;
  district?: string;
  state: string;
  pincode: string;
  operatingAreas: string[];
  contactPerson: string;
  phone: string;
  email: string;
  website?: string;
  acceptedDonationTypes: DonationType[];
  servicesProvided: HelpServiceCategory[];
  operatingHours?: string;
  establishedYear?: number;
  latitude: number;
  longitude: number;
  updatedAt: string;
}

export interface NgoDonationNeed {
  id: string;
  ngoId: string;
  ngoName: string;
  title: string;
  category: DonationType;
  causeCategory?: NgoCauseCategory;
  description: string;
  itemsRequired: string;
  quantityNeeded?: string;
  quantityCollected?: string;
  location: string;
  preferredContributionType: DonationType;
  startDate?: string;
  endDate?: string;
  dropoffInfo?: string;
  acceptsCourier: boolean;
  contactInfo: string;
  status: NgoNeedStatus;
  urgency: 'Immediate' | 'Regular' | 'Low';
  createdAt: string;
  updatedAt: string;
}

export interface NgoCampaignItem {
  id: string;
  ngoId: string;
  ngoName: string;
  title: string;
  description: string;
  cause: NgoCauseCategory;
  objective: string;
  donationTypesAccepted: DonationType[];
  location: string;
  startDate: string;
  endDate: string;
  targetUnits?: string;
  collectedUnits?: string;
  contact: string;
  status: NgoCampaignStatus;
  createdAt: string;
  updatedAt: string;
}

export interface NgoEventItem {
  id: string;
  ngoId: string;
  ngoName: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  eventType: 'Donation Drive' | 'Medical Camp' | 'Volunteer Activity' | 'Educational Workshop' | 'Awareness Event' | 'Community Event';
  participationType: 'Open to All' | 'Registration Required' | 'Invitation Only';
  contactInfo: string;
  status: NgoEventStatus;
  createdAt: string;
  updatedAt: string;
}

export interface NgoVolunteerOp {
  id: string;
  ngoId: string;
  ngoName: string;
  title: string;
  description: string;
  requiredSkills: string[];
  cause: NgoCauseCategory;
  location: string;
  dateTime: string;
  duration: string;
  volunteersRequired: number;
  volunteersEnrolled?: number;
  opportunityType: 'One-time' | 'Recurring';
  contact: string;
  status: NgoVolunteerOpStatus;
  createdAt: string;
  updatedAt: string;
}

export interface HelpRequest {
  id: string;
  userId: string;
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
  status: HelpRequestStatus;
  ngoNotes?: string;
  createdAt: string;
  updatedAt: string;
}
