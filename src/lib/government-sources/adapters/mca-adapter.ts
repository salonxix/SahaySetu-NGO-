import type {
  OrganisationTypeComparison,
  StateRegistrationGuide,
  OfficialSource,
} from '@/types/registration-guide';
import type { SourceAdapter, SourceIngestionMetadata } from '../types';

export const MCA_OFFICIAL_SOURCE: OfficialSource = {
  url: 'https://www.mca.gov.in/content/mca/global/en/home.html',
  domain: 'mca.gov.in',
  title: 'Ministry of Corporate Affairs - Section 8 Company Incorporation Manual',
  authority: 'Ministry of Corporate Affairs (MCA), Government of India',
  tier: 1,
  lastChecked: '2026-09-15',
  isAvailable: true,
};

export const McaSection8Adapter: SourceAdapter<{
  comparison: OrganisationTypeComparison;
  centralGuide: StateRegistrationGuide;
}> = {
  sourceKey: 'central_mca_section8',
  officialSource: MCA_OFFICIAL_SOURCE,

  async fetchAndNormalize() {
    const comparison: OrganisationTypeComparison = {
      type: 'Section 8 Company',
      title: 'Section 8 Non-Profit Company',
      tagline: 'Nationwide corporate structure with statutory recognition and transparent governance',
      governingAct: 'Companies Act, 2013 (Section 8) & Companies (Incorporation) Rules',
      registeringAuthority: 'Ministry of Corporate Affairs (Registrar of Companies - RoC / Central Registration Centre - CRC)',
      minimumFounders: 'Minimum 2 Directors/Members (Private Limited structure) or 7 Members (Public Limited structure)',
      managementBody: 'Board of Directors',
      jurisdiction: 'National / Central (Valid across all States & UTs in India without separate state licenses)',
      registrationPortal: 'MCA Portal (SPICe+ Integrated Incorporation Service)',
      portalUrl: 'https://www.mca.gov.in/content/mca/global/en/home.html',
      generalRouteSummary: {
        simpleExplanation:
          'A Section 8 Company is formed under the central Companies Act for promoting commerce, art, science, education, charity, or social welfare. Profits cannot be distributed to members and must be applied toward promoting objects.',
        officialDetails:
          'Under Section 8(1) of the Companies Act, 2013, an association may be registered as a limited company without the addition of "Limited" or "Private Limited" to its name, subject to Central Government license and strict prohibition of dividend payment.',
      },
      keyAdvantages: [
        'Central registration valid across all Indian states and territories seamlessly',
        'Higher institutional credibility with corporate CSR donors, multilateral agencies, and government departments',
        'Standardized statutory filing, annual audited returns, and high governance transparency',
        'Easier transfer of leadership without re-registering property deeds',
      ],
      governanceConsiderations: [
        'Higher annual compliance rigor (Annual MCA filings: AOC-4, MGT-7, DIR-3 KYC, Statutory Audit by CA)',
        'Requires Central License from the Registrar of Companies before commencement of business',
        'Directors require valid Director Identification Numbers (DIN) and Class 3 Digital Signature Certificates (DSC)',
      ],
      typicalDocuments: [
        'Digital Signature Certificate (DSC) of all subscriber directors',
        'Director Identification Number (DIN) application via SPICe+',
        'Memorandum of Association (eMoA - INC-13) with non-profit objects',
        'Articles of Association (eAoA - INC-31)',
        'Declaration by Practicing Professional (CA/CS/CMA in Form INC-14)',
        'Declaration by each Director/Subscriber (Form INC-15)',
        'Registered office address proof (Utility bill not older than 2 months + NOC from owner)',
      ],
      officialSource: MCA_OFFICIAL_SOURCE,
    };

    const centralGuide: StateRegistrationGuide = {
      state: 'All India (Central MCA)',
      organisationType: 'Section 8 Company',
      authorityName: 'Registrar of Companies / Central Registration Centre (CRC)',
      portalName: 'Ministry of Corporate Affairs Portal (SPICe+ Service)',
      portalUrl: 'https://www.mca.gov.in/content/mca/global/en/home.html',
      overview: {
        simpleExplanation:
          'Section 8 company registration is completed 100% online through the central Ministry of Corporate Affairs SPICe+ integrated portal.',
        officialDetails:
          'Application for name reservation (SPICe+ Part A) and composite incorporation, PAN, TAN, EPFO, ESIC, and Section 8 License (SPICe+ Part B) is filed directly with the Central Registration Centre (CRC), Manesar / MCA.',
      },
      steps: [
        {
          stepNumber: 1,
          title: 'Obtain Digital Signature Certificates (DSC) & Director Identification',
          description: {
            simpleExplanation:
              'Obtain Class 3 Digital Signatures for proposed directors to digitally sign online MCA forms.',
            officialDetails:
              'Every subscriber and director must hold a valid Class 3 Digital Signature Certificate (DSC) issued by a licensed Certifying Authority (CA) in India for authenticated e-filing.',
          },
          authority: 'Licensed Certifying Authorities (CCA approved)',
          isMandatory: true,
          actionLabel: 'MCA DSC Guidelines',
          actionUrl: 'https://www.mca.gov.in/content/mca/global/en/home.html',
          checklistItems: ['Class 3 DSC for minimum 2 Directors', 'Aadhaar & PAN verification'],
          officialSource: MCA_OFFICIAL_SOURCE,
        },
        {
          stepNumber: 2,
          title: 'Reserve Name via SPICe+ Part A',
          description: {
            simpleExplanation:
              'Apply for name reservation on the MCA portal. Names must include words like Foundation, Forum, Association, Federation, Council, or Sansthan.',
            officialDetails:
              'SPICe+ Part A is submitted for name reservation. In accordance with Rule 8A of Companies (Incorporation) Rules, 2014, names must reflect the charitable / scientific / educational objective.',
          },
          authority: 'Central Registration Centre (CRC), MCA',
          isMandatory: true,
          actionLabel: 'Apply on SPICe+ Part A',
          actionUrl: 'https://www.mca.gov.in/content/mca/global/en/home.html',
          checklistItems: ['Unique name reflecting social cause', 'Objects summary in accordance with Section 8(1)'],
          officialSource: MCA_OFFICIAL_SOURCE,
        },
        {
          stepNumber: 3,
          title: 'Draft Memorandum & Articles of Association (eMoA & eAoA)',
          description: {
            simpleExplanation:
              'Draft the charter documents specifying the charitable objects and rules for operations and management.',
            officialDetails:
              'Electronic Memorandum of Association (eMoA in Form INC-13) and Electronic Articles of Association (eAoA in Form INC-31) must contain standard non-profit clauses prohibiting dividend distribution.',
          },
          authority: 'Ministry of Corporate Affairs',
          isMandatory: true,
          checklistItems: ['Form INC-13 (Charter of Non-Profit Objects)', 'Form INC-31 (Rules & Regulations)'],
          officialSource: MCA_OFFICIAL_SOURCE,
        },
        {
          stepNumber: 4,
          title: 'Submit SPICe+ Part B, AGILE-PRO-S & INC-12 License Application',
          description: {
            simpleExplanation:
              'Submit the integrated application form with director declarations, registered office proof, and professional certification.',
            officialDetails:
              'SPICe+ Part B integrates Section 8 License grant, company incorporation, PAN and TAN allotment, EPFO, ESIC registration, and professional tax enrollment.',
          },
          authority: 'Central Registration Centre (CRC), MCA',
          isMandatory: true,
          actionLabel: 'Complete SPICe+ Part B',
          actionUrl: 'https://www.mca.gov.in/content/mca/global/en/home.html',
          checklistItems: [
            'Form INC-14 (Declaration by Chartered Accountant/Company Secretary)',
            'Form INC-15 (Declaration by each subscriber director)',
            'Address Proof & Utility Bill of Registered Office (within 2 months)',
            'Rent Agreement & Owner NOC for office premises',
          ],
          officialSource: MCA_OFFICIAL_SOURCE,
        },
        {
          stepNumber: 5,
          title: 'Certificate of Incorporation & Section 8 License Issuance',
          description: {
            simpleExplanation:
              'Upon approval by the Registrar, you receive the official Certificate of Incorporation containing Corporate Identity Number (CIN), Section 8 License, PAN, and TAN.',
            officialDetails:
              'RoC issues Form INC-16 (Section 8 License) and Form INC-11 (Certificate of Incorporation) with CIN, PAN, and TAN embedded upon verification of statutory documents.',
          },
          authority: 'Registrar of Companies (RoC), MCA',
          isMandatory: true,
          checklistItems: ['Certificate of Incorporation (INC-11)', 'Section 8 License (INC-16)', 'PAN and TAN Letter'],
          officialSource: MCA_OFFICIAL_SOURCE,
        },
      ],
      requiredDocuments: [
        'PAN Card of all Directors and Subscribers',
        'Identity Proof (Aadhaar Card, Passport, or Voter ID)',
        'Address Proof of Directors (Bank Statement, Electricity Bill, or Telephone Bill not older than 2 months)',
        'Registered Office Proof (Electricity/Gas Bill + Rent Agreement + Owner NOC)',
        'Draft Non-profit Objects Clause for Form INC-13',
        'Professional Certification by CA/CS/CMA in Practice (INC-14)',
      ],
      officialSource: MCA_OFFICIAL_SOURCE,
    };

    const metadata: SourceIngestionMetadata = {
      sourceKey: this.sourceKey,
      source: MCA_OFFICIAL_SOURCE,
      lastRetrievedAt: new Date().toISOString(),
      status: 'ACTIVE_VERIFIED',
    };

    return {
      data: { comparison, centralGuide },
      metadata,
    };
  },
};
