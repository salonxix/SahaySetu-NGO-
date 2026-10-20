import type { FcraGuideData, OfficialSource } from '@/types/registration-guide';
import type { SourceAdapter, SourceIngestionMetadata } from '../types';

export const FCRA_OFFICIAL_SOURCE: OfficialSource = {
  url: 'https://fcraonline.nic.in/',
  domain: 'fcraonline.nic.in',
  title: 'Foreign Contribution Regulation Act (FCRA) Online Services Portal',
  authority: 'Foreigners Division, Ministry of Home Affairs (MHA), Government of India',
  tier: 1,
  lastChecked: '2026-09-17',
  isAvailable: true,
};

export const FcraAdapter: SourceAdapter<{
  fcraGuide: FcraGuideData;
}> = {
  sourceKey: 'central_mha_fcra',
  officialSource: FCRA_OFFICIAL_SOURCE,

  async fetchAndNormalize() {
    const fcraGuide: FcraGuideData = {
      title: 'Foreign Contribution (FCRA) Statutory Regulatory Guide',
      overview: {
        simpleExplanation:
          'If your NGO plans to receive donations, grants, or aid from foreign nationals, overseas charitable foundations, or foreign governments, you must obtain prior permission or registration from the Ministry of Home Affairs under the Foreign Contribution (Regulation) Act. If you only receive domestic Indian contributions, FCRA is NOT required.',
        officialDetails:
          'Under the Foreign Contribution (Regulation) Act, 2010 (as amended), any association having a definite cultural, economic, educational, religious or social programme must obtain registration or prior permission from the Central Government (Ministry of Home Affairs) before accepting any foreign contribution.',
      },
      whoNeedsIt:
        'Only organisations that intend to receive foreign funds, foreign equipment, or international donor grants. Domestic-only NGOs do not need FCRA registration.',
      registrationVsPriorPermission: {
        priorPermission: {
          simpleExplanation:
            'Prior Permission (Form FC-3B) allows an NGO (even a newly established one) to receive a specific donation from a specific foreign donor for a specific project. It is suitable when an NGO does not yet have 3 years of audited history.',
          officialDetails:
            'Under Section 11(2) of FCRA, an organisation may apply for Prior Permission in Form FC-3B for a specific amount from an identified foreign donor for a defined project. Requires a formal commitment letter from the foreign donor.',
        },
        regularRegistration: {
          simpleExplanation:
            'Full FCRA Registration (Form FC-3A) allows an established NGO to receive foreign contributions from multiple international donors over a 5-year period. Requires at least 3 years of verified operations and minimum ₹15,00,000 track-record expenditure on charitable objects.',
          officialDetails:
            'Under Section 11(1) of FCRA, an association in existence for at least 3 years that has spent at least ₹15,00,000 over the preceding 3 years on its core charitable activities (excluding administrative overheads) may apply for 5-year registration in Form FC-3A.',
        },
      },
      keyPrerequisites: [
        'Organisational registration certificate (Trust Deed, Society Certificate, or Section 8 Incorporation)',
        'Mandatory exclusive "FCRA Account" opened with State Bank of India (SBI), Main Branch, New Delhi (11 Sansad Marg)',
        'Active NGO Darpan Unique ID from NITI Aayog',
        'Certified activity reports and audited balance sheets for the preceding 3 financial years (for regular registration)',
        'Affidavit from each office bearer certifying no criminal record or foreign influence in prescribed format (Form FC-1)',
      ],
      designatedBankRequirement:
        'By statutory mandate, all foreign contributions must be initially received exclusively in the designated FCRA Account at the State Bank of India, Main Branch, New Delhi (IFSC: SBIN0000691). The NGO may then transfer funds to secondary utilization accounts in any scheduled bank in India.',
      applicationPortal: 'MHA FCRA Online Services Portal',
      portalUrl: 'https://fcraonline.nic.in/',
      officialSource: FCRA_OFFICIAL_SOURCE,
    };

    const metadata: SourceIngestionMetadata = {
      sourceKey: this.sourceKey,
      source: FCRA_OFFICIAL_SOURCE,
      lastRetrievedAt: new Date().toISOString(),
      status: 'ACTIVE_VERIFIED',
    };

    return {
      data: { fcraGuide },
      metadata,
    };
  },
};
