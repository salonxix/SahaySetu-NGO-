import type {
  Scheme,
  NgoApplication,
  NgoDocumentItem,
  NgoOpportunity,
} from '@/types/ngo';
import { SCHEMES_CATALOG } from './mock-schemes';

export const DEMO_SCHEMES: Scheme[] = SCHEMES_CATALOG;

export const DEMO_APPLICATIONS: NgoApplication[] = [
  {
    id: 'app-01',
    schemeTitle: 'Integrated Rural Education Support Grant',
    referenceNumber: 'SCH-EDU-2026-0891',
    status: 'Action Required',
    nextAction: 'Upload audited balance sheet for FY 2024-25 by 30th Sep',
    lastUpdated: 'Yesterday at 3:45 PM',
    submissionDeadline: '30 Sep 2026',
    isSample: true,
  },
  {
    id: 'app-02',
    schemeTitle: 'Grassroots Community Health Worker Subsidy',
    referenceNumber: 'SCH-HLT-2026-0214',
    status: 'Under Review',
    nextAction: 'Awaiting field verification officer review (Stage 2 of 3)',
    lastUpdated: '3 days ago',
    isSample: true,
  },
];

export const DEMO_DOCUMENTS: NgoDocumentItem[] = [
  {
    id: 'doc-01',
    name: 'NGO Darpan Registration Certificate',
    category: 'Statutory',
    status: 'Uploaded',
    validTill: 'Active / Valid',
    isRequired: true,
  },
  {
    id: 'doc-02',
    name: '12A Income Tax Exemption Order',
    category: 'Tax Exemption',
    status: 'Uploaded',
    validTill: 'Permanent',
    isRequired: true,
  },
  {
    id: 'doc-03',
    name: '80G Tax Exemption Certificate',
    category: 'Tax Exemption',
    status: 'Needs Update',
    validTill: 'Expiring in 45 days',
    notes: 'Renewal filing required for continuous 80G validity.',
    isRequired: true,
  },
  {
    id: 'doc-04',
    name: 'Annual Audited Financial Statements (FY 2024-25)',
    category: 'Financial',
    status: 'Missing',
    notes: 'Required for all central ministry grant applications.',
    isRequired: true,
  },
  {
    id: 'doc-05',
    name: 'MCA Form CSR-1 Registration',
    category: 'Governance',
    status: 'Uploaded',
    validTill: 'Active',
    isRequired: false,
  },
];

export const DEMO_OPPORTUNITIES: NgoOpportunity[] = [
  {
    id: 'opp-01',
    title: 'CSR Rural Education Collaboration Grant',
    partnerType: 'Corporate CSR',
    focusArea: 'Primary Education & Digital Kits',
    description: 'Corporate Foundation seeking NGO implementation partners for solar-powered tablet classrooms in rural schools.',
    deadline: '15 Oct 2026',
    isSample: true,
  },
  {
    id: 'opp-02',
    title: 'Civic Tech Volunteers Network Support',
    partnerType: 'Volunteer Network',
    focusArea: 'Digital Skill Training',
    description: 'Pro-bono software engineers and designers available to train youth and assist grassroots NGOs with operational digitisation.',
    deadline: 'Rolling Intake',
    isSample: true,
  },
];
