import type { NgoDarpanGuideData, OfficialSource } from '@/types/registration-guide';
import type { SourceAdapter, SourceIngestionMetadata } from '../types';

export const NGODARPAN_OFFICIAL_SOURCE: OfficialSource = {
  url: 'https://ngodarpan.gov.in/',
  domain: 'ngodarpan.gov.in',
  title: 'NGO Darpan (NGO-PS Portal) - Central Government & NITI Aayog Portal for Voluntary Organisations',
  authority: 'NITI Aayog & National Informatics Centre (NIC), Government of India',
  tier: 1,
  lastChecked: '2026-09-18',
  isAvailable: true,
};

export const NgoDarpanAdapter: SourceAdapter<{
  darpanGuide: NgoDarpanGuideData;
}> = {
  sourceKey: 'central_ngodarpan_niti_aayog',
  officialSource: NGODARPAN_OFFICIAL_SOURCE,

  async fetchAndNormalize() {
    const darpanGuide: NgoDarpanGuideData = {
      title: 'NGO Darpan Registration & Unique ID Guide (NITI Aayog)',
      overview: {
        simpleExplanation:
          'NGO Darpan is the Government of India official database maintained by NITI Aayog. Registering here gives your organisation a Unique Darpan ID, which is mandatory for applying for Central Ministries grants and corporate CSR schemes.',
        officialDetails:
          'NGO Darpan (NGO-Partnership System) was initiated by the Prime Minister Office and is managed by NITI Aayog in collaboration with NIC. It creates an interface between Voluntary Organisations (VOs) / Non-Governmental Organisations (NGOs) and key Central Ministries, Departments, and Government Bodies.',
      },
      importanceAndBenefits: [
        'Mandatory prerequisite for applying to central grants and welfare schemes across 35+ Ministries and Departments (e.g. MoSJE, MoWCD, MoRD, MoE)',
        'Required for corporate CSR collaborations and institutional partnerships across India',
        'Enhances credibility by listing your organisation on the public directory of verified voluntary organisations',
        'Direct tracking of grant applications through the unified e-Anudaan and ministry portal integrations',
      ],
      whoShouldRegister:
        'All registered Non-Governmental Organisations in India (Trusts, Societies, and Section 8 Companies) seeking government grants, CSR partnerships, or public collaboration.',
      signupSteps: [
        {
          stepNumber: 1,
          title: 'Account Creation (Sign Up)',
          details:
            'Visit ngodarpan.gov.in, select "Sign Up", and enter your official NGO Name, Mobile Number, and Email ID. Verify mobile and email via One-Time Passwords (OTPs). Create secure portal login credentials.',
        },
        {
          stepNumber: 2,
          title: 'Organisation Profile & Registration Details',
          details:
            'Enter registered address, state, district, city, registration number, registering authority, date of registration, and valid Entity PAN. Provide the Act under which the organisation was registered.',
        },
        {
          stepNumber: 3,
          title: 'Key Office Bearers & Members Information',
          details:
            'Provide details of at least 3 governing body members/trustees/directors (including Chief Functionary, President/Chairman, and Secretary/Treasurer). Enter their Full Name, Designation, Aadhaar Number, PAN, Email, and Mobile Number for online verification.',
        },
        {
          stepNumber: 4,
          title: 'Sectoral Focus & Working Areas',
          details:
            'Select primary focus sectors (e.g. Education, Health, Women, Rural Development), operating states/districts, major activities conducted, and details of past grants/achievements if applicable.',
        },
        {
          stepNumber: 5,
          title: 'Document Upload & Profile Submission',
          details:
            'Upload a clear scanned copy of your Registration Certificate (Trust Deed / Society Registration Certificate / Section 8 Certificate of Incorporation) and NGO PAN Card in PDF format (maximum 2MB). Submit for NIC / NITI Aayog verification.',
        },
        {
          stepNumber: 6,
          title: 'Verification & Unique ID Generation',
          details:
            'NITI Aayog and statutory databases verify the PAN, registration certificate, and member details. Once accepted, a Unique Darpan ID (e.g., DL/2026/0123456) is generated and issued.',
        },
      ],
      mandatoryInformation: [
        'Valid NGO Entity PAN Card copy (PDF)',
        'Official Registration Certificate / Trust Deed / Section 8 Incorporation Certificate',
        'Aadhaar numbers & PAN numbers of minimum 3 governing body members',
        'Registered office address proof & contact details',
        'Summary of focus areas and operational districts',
      ],
      uniqueIdIssuanceProcess: {
        simpleExplanation:
          'After submitting all required information, the system performs automated PAN & registration verification. Your Unique Darpan ID is generated online and sent to your registered email.',
        officialDetails:
          'Upon successful verification of uploaded documents and member identity details against UIDAI/CBDT databases, NITI Aayog issues a verified Unique ID certificate which can be downloaded directly from the NGO Darpan portal dashboard.',
      },
      officialPortal: 'NGO Darpan Official Portal (NITI Aayog)',
      portalUrl: 'https://ngodarpan.gov.in/',
      officialSource: NGODARPAN_OFFICIAL_SOURCE,
    };

    const metadata: SourceIngestionMetadata = {
      sourceKey: this.sourceKey,
      source: NGODARPAN_OFFICIAL_SOURCE,
      lastRetrievedAt: new Date().toISOString(),
      status: 'ACTIVE_VERIFIED',
    };

    return {
      data: { darpanGuide },
      metadata,
    };
  },
};
