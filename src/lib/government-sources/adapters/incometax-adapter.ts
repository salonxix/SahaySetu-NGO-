import type { TaxComplianceGuideItem, OfficialSource } from '@/types/registration-guide';
import type { SourceAdapter, SourceIngestionMetadata } from '../types';

export const INCOMETAX_OFFICIAL_SOURCE: OfficialSource = {
  url: 'https://www.incometax.gov.in/iec/foportal/help/charitable-trusts-and-institutions',
  domain: 'incometax.gov.in',
  title: 'Income Tax Department, Government of India - E-Filing & Statutory Exemption Rules for Charitable & Religious Institutions',
  authority: 'Central Board of Direct Taxes (CBDT), Ministry of Finance, Government of India',
  tier: 1,
  lastChecked: '2026-09-18',
  isAvailable: true,
};

export const IncomeTaxAdapter: SourceAdapter<{
  taxGuideItems: TaxComplianceGuideItem[];
}> = {
  sourceKey: 'central_income_tax_charitable',
  officialSource: INCOMETAX_OFFICIAL_SOURCE,

  async fetchAndNormalize() {
    const taxGuideItems: TaxComplianceGuideItem[] = [
      {
        id: 'tax_form_104_provisional',
        title: 'Provisional Registration / Approval for Newly Established Institutions (Form 104)',
        currentRequirement:
          'Mandatory for newly formed charitable trusts, societies, and Section 8 companies before receiving tax-exempt income or issuing donor tax certificates.',
        governingAct: 'Income Tax Act & Electronic Filing Notification Rules',
        formName: 'Form 104 (Application for Provisional Registration or Approval)',
        formPurpose: {
          simpleExplanation:
            'A streamlined online application for newly registered NGOs to receive provisional tax-exempt status for up to 3 years without having to wait for multi-year audit histories.',
          officialDetails:
            'Form 104 is filed electronically via the Income Tax e-Filing portal by newly established trusts/institutions that have not yet commenced operational activities or are in their initial setup phase. Once processed, an electronic provisional registration order is generated with a Unique Registration Number (URN).',
        },
        whoItAppliesTo:
          'Newly registered Trusts, Societies, and Section 8 Companies with charitable, educational, medical, relief of poverty, or environmental advancement objectives.',
        timingAndValidity:
          'Must be applied at least one month prior to the commencement of the previous year relevant to the assessment year. Provisional registration is valid for 3 assessment years.',
        applicationProcess: [
          'Log in to the official Income Tax e-Filing portal (incometax.gov.in) using the NGO entity PAN credentials.',
          'Navigate to e-File > Income Tax Forms > File Income Tax Forms.',
          'Select Form 104 (Application for Provisional Registration/Approval of Charitable or Religious Institution).',
          'Enter establishment details, objectives, PAN of trustees/directors, and registered office address.',
          'Attach certified copy of registration instrument (Trust Deed, Society Registration Certificate, or Section 8 MoA/AoA/CIN).',
          'Digitally sign and submit using the authorized signatory Digital Signature Certificate (DSC) or Electronic Verification Code (EVC).',
          'Download the generated Provisional Registration Order (Form 10AC/Order) containing the 16-digit URN.',
        ],
        officialPortal: 'Income Tax Department e-Filing Portal',
        portalUrl: 'https://eportal.incometax.gov.in/iec/foservices/#/login',
        officialSource: INCOMETAX_OFFICIAL_SOURCE,
      },
      {
        id: 'tax_form_105_regular',
        title: 'Regular Registration / Final Statutory Approval (Form 105)',
        currentRequirement:
          'Required for operating NGOs that have commenced charitable activities to transition from provisional status to regular 5-year statutory registration.',
        governingAct: 'Income Tax Act & CBDT Operational Guidelines',
        formName: 'Form 105 (Application for Regular Registration/Approval of Operational Charitable Institutions)',
        formPurpose: {
          simpleExplanation:
            'The comprehensive review process where the Income Tax authority inspects actual charitable work, audited books, and genuine utilization of funds to grant full 5-year tax exemption and donor deduction eligibility.',
          officialDetails:
            'Form 105 is submitted by institutions holding provisional registration at least 6 months prior to expiry of provisional validity or within 6 months of commencement of charitable activities, whichever is earlier. The Commissioner of Income Tax (Exemptions) verifies accounts and genuine activities before issuing the 5-year order.',
        },
        whoItAppliesTo:
          'Active NGOs currently operating on provisional registration or seeking renewal after completing active project execution.',
        timingAndValidity:
          'File within 6 months of commencing charitable activities or 6 months prior to expiry of provisional registration. Regular registration is valid for 5 assessment years.',
        applicationProcess: [
          'Log in to the Income Tax e-Filing portal with the NGO PAN.',
          'Navigate to File Income Tax Forms and select Form 105.',
          'Provide the existing Unique Registration Number (URN) from the provisional order.',
          'Upload detailed annual activity reports detailing civic programmes conducted, beneficiaries reached, and geographic scope.',
          'Upload certified balance sheets, profit/loss accounts, and audit reports (Form 10B/10BB where applicable) for relevant financial years.',
          'Submit and respond to any verification notices / queries issued by the CIT (Exemptions) on the e-Proceedings tab.',
          'Receive final 5-year Statutory Registration Order upon verification.',
        ],
        officialPortal: 'Income Tax Department e-Filing Portal',
        portalUrl: 'https://eportal.incometax.gov.in/iec/foservices/#/login',
        officialSource: INCOMETAX_OFFICIAL_SOURCE,
      },
      {
        id: 'tax_annual_filing_itr7',
        title: 'Annual Statutory Tax Filing (ITR-7 & Audit Report)',
        currentRequirement:
          'Every registered charitable trust, society, and Section 8 company must file annual Income Tax Return (ITR-7) regardless of whether income exceeds the basic exemption limit.',
        governingAct: 'Income Tax Act (Statutory Compliance & Return Filing)',
        formName: 'ITR-7 (Annual Return for Charitable & Religious Trusts / Section 8 Entities) + Audit Form',
        formPurpose: {
          simpleExplanation:
            'The annual declaration of receipts, donations, operational expenditure, and minimum 85% fund utilization for charitable objects in India.',
          officialDetails:
            'Filing of ITR-7 along with Chartered Accountant Audit Report (Form 10B/10BB) within the statutory due date (typically 31st October of the assessment year for audited entities) is mandatory to retain tax exemption under the Income Tax Act.',
        },
        whoItAppliesTo:
          'All registered Non-Profit entities holding provisional or regular income tax registrations.',
        timingAndValidity:
          'Annual filing due by 31st October of each Assessment Year following the close of the Financial Year.',
        applicationProcess: [
          'Close annual accounts and conduct statutory financial audit by an independent Chartered Accountant.',
          'CA uploads electronic Audit Report (Form 10B / 10BB) on the e-Filing portal.',
          'NGO authorized signatory accepts the CA audit report.',
          'Complete and submit ITR-7 electronically with Digital Signature Certificate (DSC).',
          'Maintain compliance audit records for statutory inspection.',
        ],
        officialPortal: 'Income Tax Department e-Filing Portal',
        portalUrl: 'https://eportal.incometax.gov.in/iec/foservices/#/login',
        officialSource: INCOMETAX_OFFICIAL_SOURCE,
      },
    ];

    const metadata: SourceIngestionMetadata = {
      sourceKey: this.sourceKey,
      source: INCOMETAX_OFFICIAL_SOURCE,
      lastRetrievedAt: new Date().toISOString(),
      status: 'ACTIVE_VERIFIED',
    };

    return {
      data: { taxGuideItems },
      metadata,
    };
  },
};
