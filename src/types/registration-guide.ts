export type OrganisationType = 'Trust' | 'Society' | 'Section 8 Company' | 'Not Sure';

export type RegistrationStage = 'Starting New' | 'Already Registered';

export type SourceType = 'Central Government' | 'State Government' | 'Statutory Authority' | 'Official Manual';

export interface OfficialSource {
  url: string;
  domain: string;
  title: string;
  authority: string;
  tier: 1 | 2;
  lastChecked: string;
  isAvailable: boolean;
  notes?: string;
}

export interface DualLevelDescription {
  simpleExplanation: string;
  officialDetails: string;
}

export interface OrganisationTypeComparison {
  type: OrganisationType;
  title: string;
  tagline: string;
  governingAct: string;
  registeringAuthority: string;
  minimumFounders: string;
  managementBody: string;
  jurisdiction: 'State' | 'National / Central' | 'State with Multi-State Scope' | string;
  registrationPortal: string;
  portalUrl: string;
  generalRouteSummary: DualLevelDescription;
  keyAdvantages: string[];
  governanceConsiderations: string[];
  typicalDocuments: string[];
  officialSource: OfficialSource;
}

export interface RoadmapStep {
  stepNumber: number;
  title: string;
  description: DualLevelDescription;
  actionLabel?: string;
  actionUrl?: string;
  authority: string;
  checklistItems?: string[];
  isMandatory: boolean;
  officialSource: OfficialSource;
}

export interface StateRegistrationGuide {
  state: string;
  organisationType: OrganisationType;
  authorityName: string;
  portalName: string;
  portalUrl: string;
  overview: DualLevelDescription;
  steps: RoadmapStep[];
  requiredDocuments: string[];
  officialSource: OfficialSource;
}

export interface DocumentChecklistItem {
  id: string;
  name: string;
  category: 'Identity & Address' | 'Governing Instrument' | 'Office Proof' | 'Compliance & Affidavits';
  whyRequired: string;
  applicableOrgTypes: OrganisationType[];
  applicableStates?: string[]; // undefined means all states
  isOfficiallyMandated: boolean;
  officialSource: OfficialSource;
}

export interface GovernmentPortalItem {
  id: string;
  name: string;
  authority: string;
  category: 'Entity Registration' | 'Tax & Exemptions' | 'Civic Partnership' | 'Foreign Contribution' | 'Welfare Schemes';
  purpose: string;
  whoNeedsIt: string;
  officialUrl: string;
  lastChecked: string;
  officialSource: OfficialSource;
}

export interface TaxComplianceGuideItem {
  id: string;
  title: string;
  currentRequirement: string;
  governingAct: string;
  formName: string;
  formPurpose: DualLevelDescription;
  whoItAppliesTo: string;
  timingAndValidity: string;
  applicationProcess: string[];
  officialPortal: string;
  portalUrl: string;
  officialSource: OfficialSource;
}

export interface FcraGuideData {
  title: string;
  overview: DualLevelDescription;
  whoNeedsIt: string;
  registrationVsPriorPermission: {
    priorPermission: DualLevelDescription;
    regularRegistration: DualLevelDescription;
  };
  keyPrerequisites: string[];
  designatedBankRequirement: string;
  applicationPortal: string;
  portalUrl: string;
  officialSource: OfficialSource;
}

export interface NgoDarpanGuideData {
  title: string;
  overview: DualLevelDescription;
  importanceAndBenefits: string[];
  whoShouldRegister: string;
  signupSteps: {
    stepNumber: number;
    title: string;
    details: string;
  }[];
  mandatoryInformation: string[];
  uniqueIdIssuanceProcess: DualLevelDescription;
  officialPortal: string;
  portalUrl: string;
  officialSource: OfficialSource;
}

export interface QuestionnaireAnswers {
  stage: RegistrationStage;
  orgType: OrganisationType;
  state: string;
  primarySector: string;
  objectives: string[];
}

export interface GuideUserProgress {
  id?: string;
  userId: string;
  answers: QuestionnaireAnswers;
  checkedDocumentIds: string[];
  savedPortalIds: string[];
  savedSchemeIds: string[];
  currentStepIndex: number;
  lastUpdated: string;
}
