export type DashboardTab =
  | 'dashboard'
  | 'schemes'
  | 'saved'
  | 'applications'
  | 'documents'
  | 'needs'
  | 'campaigns'
  | 'events'
  | 'volunteer-ops'
  | 'help-requests'
  | 'public-profile'
  | 'registration-guide'
  | 'opportunities'
  | 'help';

export type SchemeStatus = 'Open' | 'Rolling' | 'Review Stage' | 'Upcoming Cycle';

export interface EligibilityCriterion {
  id: string;
  category: 'sector' | 'location' | 'statutory' | 'experience' | 'audit';
  label: string;
  requirementDescription: string;
}

export interface Scheme {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  sector: string;
  department: string;
  targetBeneficiaries: string[];
  applicableStates: string[]; // ['All India'] or specific states
  aidType: string;
  status: SchemeStatus;
  eligibilityCriteria: EligibilityCriterion[];
  requiredDocuments: string[];
  applicationProcess: string[];
  officialSource: string;
  lastUpdated: string;
  tags: string[];
  isSample: boolean;
}

export type SchemeRecommendation = Scheme;

export type MatchStatus = 'matched' | 'needs_attention' | 'unclear';

export interface CriterionMatchResult {
  criterionId: string;
  label: string;
  status: MatchStatus;
  explanation: string;
}

export interface SchemeMatchEvaluation {
  schemeId: string;
  overallScore: number; // 0 - 100
  isRecommended: boolean;
  matchReasons: string[];
  criteriaResults: CriterionMatchResult[];
}

export type ApplicationStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Action Required'
  | 'Approved';

export interface ApplicationFormData {
  // Organisation Step
  signatoryDesignation?: string;
  alternatePhone?: string;
  // Eligibility Step
  eligibilityAcknowledged: boolean;
  // Required Info Step
  projectTitle: string;
  beneficiaryGroup: string;
  targetBeneficiaryCount: string;
  targetDistrict: string;
  projectSummary: string;
  expectedOutcomes: string;
  budgetRequested: string;
  // Documents Step
  readyDocuments: string[]; // List of document titles marked ready / attached
  // Meta
  savedStep?: number;
}

export interface NgoApplication {
  id: string;
  schemeId?: string;
  schemeTitle: string;
  department?: string;
  referenceNumber: string;
  status: ApplicationStatus;
  nextAction: string;
  lastUpdated: string;
  submittedAt?: string;
  submissionDeadline?: string;
  isSample: boolean;
  formData?: ApplicationFormData;
}

export type DocumentStatus = 'Uploaded' | 'Missing' | 'Needs Update';

export interface NgoDocumentItem {
  id: string;
  name: string;
  category: 'Statutory' | 'Tax Exemption' | 'Financial' | 'Governance';
  status: DocumentStatus;
  validTill?: string;
  notes?: string;
  isRequired: boolean;
}

export interface NgoOpportunity {
  id: string;
  title: string;
  partnerType: 'Corporate CSR' | 'Institutional Donor' | 'Volunteer Network';
  focusArea: string;
  description: string;
  deadline: string;
  isSample: boolean;
}
