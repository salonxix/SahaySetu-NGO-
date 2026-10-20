import { Database, type RegistrationGuideProgressRecord } from '@/lib/db/database';
import type {
  OrganisationType,
  OrganisationTypeComparison,
  StateRegistrationGuide,
  DocumentChecklistItem,
  GovernmentPortalItem,
  TaxComplianceGuideItem,
  FcraGuideData,
  NgoDarpanGuideData,
  GuideUserProgress,
  QuestionnaireAnswers,
} from '@/types/registration-guide';
import { McaSection8Adapter, MCA_OFFICIAL_SOURCE } from './adapters/mca-adapter';
import { IncomeTaxAdapter, INCOMETAX_OFFICIAL_SOURCE } from './adapters/incometax-adapter';
import { NgoDarpanAdapter, NGODARPAN_OFFICIAL_SOURCE } from './adapters/ngodarpan-adapter';
import { FcraAdapter, FCRA_OFFICIAL_SOURCE } from './adapters/fcra-adapter';
import { STATE_REGISTRIES_DATABASE } from './adapters/state-registry-adapter';
import { SCHEMES_CATALOG } from '@/lib/ngo/mock-schemes';
import type { Scheme } from '@/types/ngo';

export class GovernmentGuideStore {
  /**
   * Return Organisation Type Comparisons for Trust, Society, and Section 8 Company
   * personalized to the selected state.
   */
  public static async getOrganisationTypeComparisons(state: string = 'Delhi'): Promise<OrganisationTypeComparison[]> {
    const normalizedState = this.normalizeStateKey(state);
    const stateBundle = STATE_REGISTRIES_DATABASE[normalizedState] || STATE_REGISTRIES_DATABASE['Delhi'];
    const mcaData = await McaSection8Adapter.fetchAndNormalize();

    return [
      stateBundle.trustComparison,
      stateBundle.societyComparison,
      mcaData.data.comparison,
    ];
  }

  /**
   * Return step-by-step registration roadmap and official guide for state and org type.
   */
  public static async getStateRegistrationGuide(
    state: string = 'Delhi',
    orgType: OrganisationType = 'Trust'
  ): Promise<StateRegistrationGuide> {
    if (orgType === 'Section 8 Company') {
      const mcaData = await McaSection8Adapter.fetchAndNormalize();
      return mcaData.data.centralGuide;
    }

    const normalizedState = this.normalizeStateKey(state);
    const stateBundle = STATE_REGISTRIES_DATABASE[normalizedState] || STATE_REGISTRIES_DATABASE['Delhi'];

    if (orgType === 'Society') {
      return stateBundle.societyGuide;
    }

    // Default to Trust
    return stateBundle.trustGuide;
  }

  /**
   * Return dynamic document checklist based on org type and state.
   */
  public static async getDocumentChecklist(
    orgType: OrganisationType = 'Trust',
    state: string = 'Delhi'
  ): Promise<DocumentChecklistItem[]> {
    const allDocuments: DocumentChecklistItem[] = [
      {
        id: 'doc_aadhaar_pan_members',
        name: 'PAN & Aadhaar Cards of Founders / Trustees / Directors',
        category: 'Identity & Address',
        whyRequired:
          'Mandatory statutory identity verification for all governing members across MCA, Sub-Registrars, and Income Tax databases.',
        applicableOrgTypes: ['Trust', 'Society', 'Section 8 Company'],
        isOfficiallyMandated: true,
        officialSource: MCA_OFFICIAL_SOURCE,
      },
      {
        id: 'doc_photos_members',
        name: 'Passport Size Photographs of All Key Functionaries',
        category: 'Identity & Address',
        whyRequired:
          'Required for deed physical execution, Society register records, and DIN/DSC KYC files.',
        applicableOrgTypes: ['Trust', 'Society', 'Section 8 Company'],
        isOfficiallyMandated: true,
        officialSource: {
          url: 'https://revenue.delhi.gov.in/',
          domain: 'revenue.delhi.gov.in',
          title: 'State Sub-Registrar Identification Guidelines',
          authority: 'Revenue Authorities',
          tier: 1,
          lastChecked: '2026-09-15',
          isAvailable: true,
        },
      },
      {
        id: 'doc_trust_deed',
        name: 'Draft Public Charitable Trust Deed (on Stamp Paper)',
        category: 'Governing Instrument',
        whyRequired:
          'The core foundational instrument defining non-profit objectives, beneficiary rights, and powers of trustees under the Indian Trusts Act.',
        applicableOrgTypes: ['Trust'],
        isOfficiallyMandated: true,
        officialSource: {
          url: 'https://revenue.delhi.gov.in/',
          domain: 'revenue.delhi.gov.in',
          title: 'Trust Deed Statutory Formats',
          authority: 'Revenue Department',
          tier: 1,
          lastChecked: '2026-09-15',
          isAvailable: true,
        },
      },
      {
        id: 'doc_moa_rules_society',
        name: 'Memorandum of Association (MoA) & Certified Rules & Regulations',
        category: 'Governing Instrument',
        whyRequired:
          'Mandated under the Societies Registration Act, 1860 (or relevant state Act). Defines objects, governing body composition, and democratic bylaws.',
        applicableOrgTypes: ['Society'],
        isOfficiallyMandated: true,
        officialSource: {
          url: 'https://edistrict.delhigovt.nic.in/',
          domain: 'edistrict.delhigovt.nic.in',
          title: 'Registrar of Societies MoA Requirements',
          authority: 'Registrar of Societies',
          tier: 1,
          lastChecked: '2026-09-15',
          isAvailable: true,
        },
      },
      {
        id: 'doc_mca_emoa_eaoa',
        name: 'eMoA (Form INC-13) & eAoA (Form INC-31)',
        category: 'Governing Instrument',
        whyRequired:
          'Mandatory electronic charter documents under Section 8 of the Companies Act, 2013 prohibiting dividend distribution.',
        applicableOrgTypes: ['Section 8 Company'],
        isOfficiallyMandated: true,
        officialSource: MCA_OFFICIAL_SOURCE,
      },
      {
        id: 'doc_dsc_directors',
        name: 'Class 3 Digital Signature Certificate (DSC)',
        category: 'Identity & Address',
        whyRequired:
          'Required for all directors to authenticate online filings on the central MCA portal.',
        applicableOrgTypes: ['Section 8 Company'],
        isOfficiallyMandated: true,
        officialSource: MCA_OFFICIAL_SOURCE,
      },
      {
        id: 'doc_registered_office_proof',
        name: 'Registered Office Address Proof (Utility Bill within 2 Months)',
        category: 'Office Proof',
        whyRequired:
          'Statutory proof of physical address of the NGO (Electricity bill, Telephone bill, or Water bill).',
        applicableOrgTypes: ['Trust', 'Society', 'Section 8 Company'],
        isOfficiallyMandated: true,
        officialSource: MCA_OFFICIAL_SOURCE,
      },
      {
        id: 'doc_owner_noc_rent',
        name: 'No Objection Certificate (NOC) & Rent Agreement from Premises Owner',
        category: 'Office Proof',
        whyRequired:
          'Confirms legal permission from the property owner to locate the registered non-profit office at the specified premises.',
        applicableOrgTypes: ['Trust', 'Society', 'Section 8 Company'],
        isOfficiallyMandated: true,
        officialSource: MCA_OFFICIAL_SOURCE,
      },
      {
        id: 'doc_inc14_professional_cert',
        name: 'Professional Declaration (Form INC-14 by CA/CS/CMA in Practice)',
        category: 'Compliance & Affidavits',
        whyRequired:
          'Certification by an independent practicing professional that all requirements of the Companies Act, 2013 have been complied with.',
        applicableOrgTypes: ['Section 8 Company'],
        isOfficiallyMandated: true,
        officialSource: MCA_OFFICIAL_SOURCE,
      },
      {
        id: 'doc_affidavit_non_relationship',
        name: 'No-Relationship / Integrity Affidavit on Non-Judicial Stamp Paper',
        category: 'Compliance & Affidavits',
        whyRequired:
          'Required by state Registrars of Societies to verify that founding office bearers are not closely related by blood in executive roles.',
        applicableOrgTypes: ['Society'],
        isOfficiallyMandated: true,
        officialSource: {
          url: 'https://edistrict.delhigovt.nic.in/',
          domain: 'edistrict.delhigovt.nic.in',
          title: 'Societies Registration Affidavit Forms',
          authority: 'Registrar of Societies',
          tier: 1,
          lastChecked: '2026-09-15',
          isAvailable: true,
        },
      },
    ];

    return allDocuments.filter((doc) => {
      if (orgType !== 'Not Sure' && !doc.applicableOrgTypes.includes(orgType)) {
        return false;
      }
      if (doc.applicableStates && !doc.applicableStates.includes(state)) {
        return false;
      }
      return true;
    });
  }

  /**
   * Return verified official government portals directory.
   */
  public static getGovernmentPortals(): GovernmentPortalItem[] {
    return this.getOfficialGovernmentPortals();
  }

  public static getOfficialGovernmentPortals(): GovernmentPortalItem[] {
    return [
      {
        id: 'portal_mca',
        name: 'Ministry of Corporate Affairs (MCA) Portal',
        authority: 'Ministry of Corporate Affairs, Government of India',
        category: 'Entity Registration',
        purpose:
          'Central portal for Section 8 Company incorporation (SPICe+), name reservation, director DIN issuance, and annual statutory corporate filings.',
        whoNeedsIt: 'Section 8 Non-Profit Companies',
        officialUrl: 'https://www.mca.gov.in/content/mca/global/en/home.html',
        lastChecked: '2026-09-15',
        officialSource: MCA_OFFICIAL_SOURCE,
      },
      {
        id: 'portal_incometax',
        name: 'Income Tax Department e-Filing Portal',
        authority: 'Central Board of Direct Taxes (CBDT), Ministry of Finance',
        category: 'Tax & Exemptions',
        purpose:
          'Electronic application for provisional tax registration (Form 104), regular registration (Form 105), filing annual returns (ITR-7), and audit reports (Form 10B/10BB).',
        whoNeedsIt: 'All registered Non-Profit Entities (Trusts, Societies, Section 8 Companies)',
        officialUrl: 'https://eportal.incometax.gov.in/',
        lastChecked: '2026-09-18',
        officialSource: INCOMETAX_OFFICIAL_SOURCE,
      },
      {
        id: 'portal_ngodarpan',
        name: 'NGO Darpan Portal (NITI Aayog)',
        authority: 'NITI Aayog & National Informatics Centre (NIC)',
        category: 'Civic Partnership',
        purpose:
          'Central repository and Unique Darpan ID generation system for voluntary organisations seeking Central Ministries grants, CSR partnerships, and public sector tenders.',
        whoNeedsIt: 'All operating NGOs applying for government schemes, grants, and CSR funds',
        officialUrl: 'https://ngodarpan.gov.in/',
        lastChecked: '2026-09-18',
        officialSource: NGODARPAN_OFFICIAL_SOURCE,
      },
      {
        id: 'portal_fcra',
        name: 'FCRA Online Portal (Ministry of Home Affairs)',
        authority: 'Foreigners Division, Ministry of Home Affairs, Government of India',
        category: 'Foreign Contribution',
        purpose:
          'Mandatory statutory portal for applying for foreign contribution Prior Permission (Form FC-3B), 5-year Registration (Form FC-3A), and filing annual returns (Form FC-4).',
        whoNeedsIt: 'NGOs planning to receive international grants or foreign donations',
        officialUrl: 'https://fcraonline.nic.in/',
        lastChecked: '2026-09-17',
        officialSource: FCRA_OFFICIAL_SOURCE,
      },
      {
        id: 'portal_myscheme',
        name: 'myScheme National Platform',
        authority: 'National e-Governance Division (NeGD) / Ministry of Electronics & IT',
        category: 'Welfare Schemes',
        purpose:
          'National platform discovering government welfare schemes, eligibility criteria, subsidy grants, and department application forms across ministries.',
        whoNeedsIt: 'NGOs and citizens discovering central and state welfare initiatives',
        officialUrl: 'https://www.myscheme.gov.in/',
        lastChecked: '2026-09-16',
        officialSource: {
          url: 'https://www.myscheme.gov.in/',
          domain: 'myscheme.gov.in',
          title: 'myScheme - National Scheme Discovery Platform',
          authority: 'MeitY / NeGD',
          tier: 1,
          lastChecked: '2026-09-16',
          isAvailable: true,
        },
      },
      {
        id: 'portal_delhi_edistrict',
        name: 'Delhi e-District / Revenue Services',
        authority: 'Revenue Department, Government of NCT of Delhi',
        category: 'Entity Registration',
        purpose:
          'Online appointment booking for Trust Deed registration before Sub-Registrars and issuance of Society Registration Certificates in Delhi.',
        whoNeedsIt: 'NGOs registering a Trust or Society in NCT of Delhi',
        officialUrl: 'https://edistrict.delhigovt.nic.in/',
        lastChecked: '2026-09-16',
        officialSource: {
          url: 'https://edistrict.delhigovt.nic.in/',
          domain: 'edistrict.delhigovt.nic.in',
          title: 'Delhi e-District Portal',
          authority: 'GNCT of Delhi',
          tier: 1,
          lastChecked: '2026-09-16',
          isAvailable: true,
        },
      },
      {
        id: 'portal_karnataka_kaveri',
        name: 'Kaveri Online Services 2.0 (Karnataka)',
        authority: 'Department of Stamps and Registration, Government of Karnataka',
        category: 'Entity Registration',
        purpose:
          'Pre-registration data entry, e-Stamping verification, and appointment booking for Trust registration before Sub-Registrars in Karnataka.',
        whoNeedsIt: 'NGOs registering a Trust in Karnataka',
        officialUrl: 'https://kaverionline.karnataka.gov.in/',
        lastChecked: '2026-09-15',
        officialSource: {
          url: 'https://kaverionline.karnataka.gov.in/',
          domain: 'kaverionline.karnataka.gov.in',
          title: 'Kaveri Online Services',
          authority: 'Govt of Karnataka',
          tier: 1,
          lastChecked: '2026-09-15',
          isAvailable: true,
        },
      },
      {
        id: 'portal_mahacharity',
        name: 'MahaCharity Portal (Maharashtra)',
        authority: 'Office of the Charity Commissioner, Government of Maharashtra',
        category: 'Entity Registration',
        purpose:
          'Online filing and statutory management of Public Charitable Trusts and Societies under the Maharashtra Public Trusts Act, 1950.',
        whoNeedsIt: 'All Public Trusts and Societies operating in Maharashtra',
        officialUrl: 'https://charity.maharashtra.gov.in/',
        lastChecked: '2026-09-14',
        officialSource: {
          url: 'https://charity.maharashtra.gov.in/',
          domain: 'charity.maharashtra.gov.in',
          title: 'MahaCharity Portal',
          authority: 'Charity Commissioner, Maharashtra',
          tier: 1,
          lastChecked: '2026-09-14',
          isAvailable: true,
        },
      },
    ];
  }

  /**
   * Return current Income Tax readiness guide (Forms 104/105).
   */
  public static async getTaxComplianceGuide(): Promise<TaxComplianceGuideItem[]> {
    const res = await IncomeTaxAdapter.fetchAndNormalize();
    return res.data.taxGuideItems;
  }

  /**
   * Return official FCRA guide.
   */
  public static async getFcraGuide(): Promise<FcraGuideData> {
    const res = await FcraAdapter.fetchAndNormalize();
    return res.data.fcraGuide;
  }

  /**
   * Return official NGO Darpan guide.
   */
  public static async getNgoDarpanGuide(): Promise<NgoDarpanGuideData> {
    const res = await NgoDarpanAdapter.fetchAndNormalize();
    return res.data.darpanGuide;
  }

  /**
   * Return personalized government schemes from catalog based on state, sector, and orgType.
   */
  public static getPersonalizedSchemes(
    state: string = 'Delhi',
    sector: string = 'Education',
    orgType?: OrganisationType
  ): Scheme[] {
    return SCHEMES_CATALOG.filter((scheme) => {
      // Sector match (case insensitive check)
      const sectorMatch =
        sector.toLowerCase() === 'all' ||
        scheme.sector.toLowerCase().includes(sector.toLowerCase()) ||
        scheme.tags.some((t) => t.toLowerCase().includes(sector.toLowerCase()));

      // State match (All India or matching state)
      const stateMatch =
        scheme.applicableStates.includes('All India') ||
        scheme.applicableStates.includes(state);

      if (orgType && orgType !== 'Not Sure') {
        // Optional structure filter
      }

      return sectorMatch && stateMatch;
    });
  }

  /**
   * Persist user progress in Database.
   */
  public static saveUserProgress(
    userId: string,
    answers: QuestionnaireAnswers,
    checkedDocumentIds: string[] = [],
    savedPortalIds: string[] = [],
    savedSchemeIds: string[] = [],
    currentStepIndex: number = 0
  ): GuideUserProgress {
    const db = Database.getInstance();
    const state = db.getState();
    const existingIndex = state.registration_guide_progress.findIndex((p) => p.user_id === userId);

    const now = new Date().toISOString();
    const record: RegistrationGuideProgressRecord = {
      id: existingIndex >= 0 ? state.registration_guide_progress[existingIndex].id : `guide_prog_${Date.now()}`,
      user_id: userId,
      answers: JSON.stringify(answers),
      checked_document_ids: JSON.stringify(checkedDocumentIds),
      saved_portal_ids: JSON.stringify(savedPortalIds),
      saved_scheme_ids: JSON.stringify(savedSchemeIds),
      current_step_index: currentStepIndex,
      last_updated: now,
    };

    if (existingIndex >= 0) {
      state.registration_guide_progress[existingIndex] = record;
    } else {
      state.registration_guide_progress.push(record);
    }

    db.save();

    return {
      id: record.id,
      userId,
      answers,
      checkedDocumentIds,
      savedPortalIds,
      savedSchemeIds,
      currentStepIndex,
      lastUpdated: now,
    };
  }

  /**
   * Retrieve saved user progress from Database.
   */
  public static getUserProgress(userId: string): GuideUserProgress | null {
    const db = Database.getInstance();
    const record = db.getState().registration_guide_progress.find((p) => p.user_id === userId);
    if (!record) return null;

    try {
      return {
        id: record.id,
        userId: record.user_id,
        answers: JSON.parse(record.answers),
        checkedDocumentIds: JSON.parse(record.checked_document_ids || '[]'),
        savedPortalIds: JSON.parse(record.saved_portal_ids || '[]'),
        savedSchemeIds: JSON.parse(record.saved_scheme_ids || '[]'),
        currentStepIndex: record.current_step_index || 0,
        lastUpdated: record.last_updated,
      };
    } catch {
      return null;
    }
  }

  private static normalizeStateKey(state: string): string {
    const s = state.trim().toLowerCase();
    if (s.includes('karnataka') || s.includes('bengaluru') || s.includes('bangalore')) return 'Karnataka';
    if (s.includes('maharashtra') || s.includes('mumbai') || s.includes('pune')) return 'Maharashtra';
    return 'Delhi';
  }
}

export const GuideStore = GovernmentGuideStore;

