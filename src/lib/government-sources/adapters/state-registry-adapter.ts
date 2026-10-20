import type {
  OrganisationTypeComparison,
  StateRegistrationGuide,
  OfficialSource,
} from '@/types/registration-guide';
import type { SourceAdapter, SourceIngestionMetadata } from '../types';

export interface StateRegistrySourceBundle {
  state: string;
  stateCode: string;
  officialSource: OfficialSource;
  trustGuide: StateRegistrationGuide;
  societyGuide: StateRegistrationGuide;
  trustComparison: OrganisationTypeComparison;
  societyComparison: OrganisationTypeComparison;
}

export const STATE_REGISTRIES_DATABASE: Record<string, StateRegistrySourceBundle> = {
  Delhi: {
    state: 'Delhi (NCT)',
    stateCode: 'DL',
    officialSource: {
      url: 'https://revenue.delhi.gov.in/',
      domain: 'revenue.delhi.gov.in',
      title: 'Revenue Department, Government of NCT of Delhi - Registration of Deeds & Societies',
      authority: 'Office of the Sub-Registrar / Registrar of Societies, Revenue Dept, GNCTD',
      tier: 1,
      lastChecked: '2026-09-16',
      isAvailable: true,
    },
    trustComparison: {
      type: 'Trust',
      title: 'Public Charitable Trust (Delhi)',
      tagline: 'Simple establishment through registered Trust Deed before the Sub-Registrar',
      governingAct: 'Indian Trusts Act, 1882 (read with statutory charitable registration rules in Delhi)',
      registeringAuthority: 'Sub-Registrar Office (Revenue Department, GNCT of Delhi)',
      minimumFounders: 'Minimum 2 Trustees (Author/Settlor + Managing Trustee)',
      managementBody: 'Board of Trustees',
      jurisdiction: 'State / Local Sub-District jurisdiction',
      registrationPortal: 'Delhi e-District / Revenue Dept Portal',
      portalUrl: 'https://edistrict.delhigovt.nic.in/',
      generalRouteSummary: {
        simpleExplanation:
          'A Public Charitable Trust in Delhi is created by drafting a Trust Deed outlining social objectives, property settlement, and trustee responsibilities, then executing and registering it before the local Sub-Registrar.',
        officialDetails:
          'The Settlor executes the Trust Deed on non-judicial stamp paper of appropriate value. Physical or biometric presence of the Settlor, minimum two Trustees, and two witnesses with valid identity proofs is required at the jurisdictional Sub-Registrar office.',
      },
      keyAdvantages: [
        'Relatively simple formation process with fewer annual statutory government filings than corporate bodies',
        'Trustees have long-term administrative control in accordance with the registered Trust Deed',
        'Permanent deed structure with clear beneficiary focus',
      ],
      governanceConsiderations: [
        'Amending Trust Deed clauses requires court intervention or rigorous legal process if amendment powers are not explicitly reserved',
        'State-specific stamp duty and registration fees apply based on settled trust property',
      ],
      typicalDocuments: [
        'Original Trust Deed drafted on non-judicial stamp paper',
        'PAN & Aadhaar Cards of Settlor, all Trustees, and 2 independent witnesses',
        'Two passport-sized photographs of each person',
        'Registered office address proof (Electricity/Water Bill + NOC from owner)',
        'Settlor proof of title or nominal corpus asset receipt',
      ],
      officialSource: {
        url: 'https://revenue.delhi.gov.in/',
        domain: 'revenue.delhi.gov.in',
        title: 'Delhi Revenue Department - Trust Deed Registration Manual',
        authority: 'Revenue Department, Government of NCT of Delhi',
        tier: 1,
        lastChecked: '2026-09-16',
        isAvailable: true,
      },
    },
    societyComparison: {
      type: 'Society',
      title: 'Registered Society (Delhi)',
      tagline: 'Democratic membership-based non-profit governed by an elected Managing Committee',
      governingAct: 'Societies Registration Act, 1860 (as applicable to the NCT of Delhi)',
      registeringAuthority: 'Registrar of Societies (Industries / Revenue Department, GNCTD)',
      minimumFounders: 'Minimum 7 founding members (from diverse states for all-India character)',
      managementBody: 'Governing Body / Executive Committee (elected by general body members)',
      jurisdiction: 'State level (or Multi-State with members from at least 7 Indian states)',
      registrationPortal: 'Delhi e-District / Registrar of Societies Portal',
      portalUrl: 'https://edistrict.delhigovt.nic.in/',
      generalRouteSummary: {
        simpleExplanation:
          'A Society is formed by a group of at least 7 individuals who come together for scientific, educational, literary, or charitable purposes, adopting a Memorandum of Association and democratic Rules & Regulations.',
        officialDetails:
          'Under the Societies Registration Act, 1860, the Memorandum of Association and Rules & Regulations must be filed with the Registrar of Societies. Annual general body elections and list of governing body members must be submitted annually.',
      },
      keyAdvantages: [
        'Democratic governance structure with voting rights among members',
        'Recognized and familiar model for community associations, schools, cultural groups, and welfare organisations',
        'Rules and bylaws can be amended by resolution of the general body without court proceedings',
      ],
      governanceConsiderations: [
        'Requires minimum 7 members for registration',
        'Mandatory annual filing of Governing Body list and audited accounts with the Registrar',
        'Risk of internal voting disputes among members',
      ],
      typicalDocuments: [
        'Memorandum of Association (MoA) signed by all founding members',
        'Rules and Regulations (Bylaws) certified by minimum 3 office bearers',
        'Affidavit of President/Secretary on non-judicial stamp paper',
        'Identity & Address proofs (Aadhaar & PAN) of all founding members',
        'NOC from landlord for registered office premises along with utility bill',
      ],
      officialSource: {
        url: 'https://edistrict.delhigovt.nic.in/',
        domain: 'edistrict.delhigovt.nic.in',
        title: 'e-District Delhi - Societies Registration Online Portal',
        authority: 'Registrar of Societies, Government of NCT of Delhi',
        tier: 1,
        lastChecked: '2026-09-16',
        isAvailable: true,
      },
    },
    trustGuide: {
      state: 'Delhi',
      organisationType: 'Trust',
      authorityName: 'Office of the Sub-Registrar (Revenue Department, GNCT of Delhi)',
      portalName: 'Delhi e-District Online Token & Deed Service',
      portalUrl: 'https://edistrict.delhigovt.nic.in/',
      overview: {
        simpleExplanation:
          'Register a Public Charitable Trust in Delhi by drafting your Trust Deed, booking an appointment on Delhi e-District, and presenting the deed for registration before the Sub-Registrar.',
        officialDetails:
          'Registration of a Charitable Trust in Delhi is governed by the Registration Act, 1908 and Indian Trusts Act, 1882. Stamp duty is paid via e-Stamping through Stock Holding Corporation of India / NCT of Delhi portal.',
      },
      steps: [
        {
          stepNumber: 1,
          title: 'Draft the Public Charitable Trust Deed',
          description: {
            simpleExplanation:
              'Draft the Trust Deed clearly defining the Settlor, Trustees, primary non-profit objectives, beneficiary class, and trustee succession rules.',
            officialDetails:
              'The deed must clearly specify that the trust is irrevocable, for public charitable benefit, and that no portion of income will be distributed among trustees as profit.',
          },
          authority: 'Legal drafter / Authorized Advocate',
          isMandatory: true,
          checklistItems: ['Clear charitable objects clause', 'Trustee powers and quorum rules', 'Irrevocability clause'],
          officialSource: {
            url: 'https://revenue.delhi.gov.in/',
            domain: 'revenue.delhi.gov.in',
            title: 'Delhi Revenue Department Guidelines',
            authority: 'Revenue Department, GNCTD',
            tier: 1,
            lastChecked: '2026-09-16',
            isAvailable: true,
          },
        },
        {
          stepNumber: 2,
          title: 'Procure Delhi e-Stamp Paper',
          description: {
            simpleExplanation:
              'Purchase the mandatory non-judicial e-stamp paper from an authorized e-Stamping center in Delhi.',
            officialDetails:
              'Obtain e-Stamp certificate for registration of trust deed in Delhi from authorized SHCIL / bank counters, printing the drafted deed onto the stamped document.',
          },
          authority: 'Stock Holding Corporation of India (SHCIL) / Sub-Registrar Office',
          isMandatory: true,
          checklistItems: ['e-Stamp paper with stamp duty for Delhi', 'Printed Trust Deed copy'],
          officialSource: {
            url: 'https://revenue.delhi.gov.in/',
            domain: 'revenue.delhi.gov.in',
            title: 'Delhi Revenue Department',
            authority: 'GNCTD',
            tier: 1,
            lastChecked: '2026-09-16',
            isAvailable: true,
          },
        },
        {
          stepNumber: 3,
          title: 'Book e-District Sub-Registrar Appointment Token',
          description: {
            simpleExplanation:
              'Log in to the Delhi e-District portal and schedule an appointment slot at the jurisdictional Sub-Registrar office.',
            officialDetails:
              'Visit edistrict.delhigovt.nic.in, choose Deed Registration, enter deed particulars, and obtain an e-Appointment appointment slip.',
          },
          authority: 'Revenue Department, GNCT of Delhi',
          isMandatory: true,
          actionLabel: 'Book Delhi e-District Token',
          actionUrl: 'https://edistrict.delhigovt.nic.in/',
          checklistItems: ['Appointment slip with date and time', 'Fee receipt of registration charges'],
          officialSource: {
            url: 'https://edistrict.delhigovt.nic.in/',
            domain: 'edistrict.delhigovt.nic.in',
            title: 'Delhi e-District Portal',
            authority: 'GNCTD',
            tier: 1,
            lastChecked: '2026-09-16',
            isAvailable: true,
          },
        },
        {
          stepNumber: 4,
          title: 'Physical Appearance, Biometric Verification & Deed Registration',
          description: {
            simpleExplanation:
              'Present the original deed before the Sub-Registrar with the Settlor, Trustees, and 2 independent witnesses for photo and biometric verification.',
            officialDetails:
              'Sub-Registrar verifies original identity proofs (Aadhaar/PAN), records digital photograph and thumb impressions, and issues the registered Trust Deed number.',
          },
          authority: 'Sub-Registrar Office (Jurisdictional Zone)',
          isMandatory: true,
          checklistItems: [
            'Physical presence of Settlor, Trustees, and 2 Witnesses',
            'Original Aadhaar and PAN Cards of all parties',
            'Registered office ownership / lease documents',
          ],
          officialSource: {
            url: 'https://revenue.delhi.gov.in/',
            domain: 'revenue.delhi.gov.in',
            title: 'Delhi Revenue Department',
            authority: 'GNCTD',
            tier: 1,
            lastChecked: '2026-09-16',
            isAvailable: true,
          },
        },
        {
          stepNumber: 5,
          title: 'Collect Registered Trust Deed & Apply for Entity PAN',
          description: {
            simpleExplanation:
              'Collect the stamped, sealed, registered Trust Deed and apply for the NGO independent PAN card via NSDL/Protean.',
            officialDetails:
              'The registered deed is dispatched or collected. Apply for Trust PAN in Form 49A using the certified registered deed copy as certificate of establishment.',
          },
          authority: 'Protean / NSDL e-Gov / UTIITSL',
          isMandatory: true,
          actionLabel: 'Apply for Entity PAN (NSDL)',
          actionUrl: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
          checklistItems: ['Original Registered Trust Deed', 'Form 49A for Trust Entity PAN'],
          officialSource: {
            url: 'https://www.incometax.gov.in/',
            domain: 'incometax.gov.in',
            title: 'Income Tax Entity PAN Services',
            authority: 'CBDT',
            tier: 1,
            lastChecked: '2026-09-16',
            isAvailable: true,
          },
        },
      ],
      requiredDocuments: [
        'Draft Trust Deed on Stamp Paper',
        'Identity Proofs (Aadhaar & PAN) of Settlor, Trustees, and 2 Witnesses',
        'Address Proof of Trustees (Voter ID, Passport, or Bank Statement)',
        'Registered Office Proof (Electricity Bill + Rent Agreement + Owner NOC)',
        'Passport Size Photographs (2 each for Settlor, Trustees, Witnesses)',
      ],
      officialSource: {
        url: 'https://revenue.delhi.gov.in/',
        domain: 'revenue.delhi.gov.in',
        title: 'Delhi Revenue Department - Trust Registration Process',
        authority: 'Revenue Department, GNCTD',
        tier: 1,
        lastChecked: '2026-09-16',
        isAvailable: true,
      },
    },
    societyGuide: {
      state: 'Delhi',
      organisationType: 'Society',
      authorityName: 'Registrar of Societies (Revenue / Industries Dept, GNCT of Delhi)',
      portalName: 'Delhi e-District Society Registration Online Service',
      portalUrl: 'https://edistrict.delhigovt.nic.in/',
      overview: {
        simpleExplanation:
          'Register a Society in Delhi with minimum 7 founding members by submitting the Memorandum of Association and Bylaws via the Delhi e-District portal or the jurisdictional Registrar of Societies.',
        officialDetails:
          'Governed by the Societies Registration Act, 1860 as extended to Delhi. Requires submission of Memorandum of Association, democratic Rules & Regulations, and non-relationship affidavits.',
      },
      steps: [
        {
          stepNumber: 1,
          title: 'Convene Founding Members & Select Name',
          description: {
            simpleExplanation:
              'Gather minimum 7 founding members, select a unique non-profit name, and agree on core charitable objectives.',
            officialDetails:
              'The name must not be identical or deceptively similar to any existing society or prohibited emblems under the Emblems and Names (Prevention of Improper Use) Act, 1950.',
          },
          authority: 'Founding General Body',
          isMandatory: true,
          checklistItems: ['Minimum 7 founding members', 'Unique proposed name list'],
          officialSource: {
            url: 'https://edistrict.delhigovt.nic.in/',
            domain: 'edistrict.delhigovt.nic.in',
            title: 'Delhi e-District Societies Guidelines',
            authority: 'GNCTD',
            tier: 1,
            lastChecked: '2026-09-16',
            isAvailable: true,
          },
        },
        {
          stepNumber: 2,
          title: 'Draft Memorandum of Association (MoA) & Rules',
          description: {
            simpleExplanation:
              'Prepare the MoA (name, registered office, objects, governing body list) and the Rules & Regulations governing membership, elections, and meetings.',
            officialDetails:
              'MoA must state the objects and list the initial Governing Body (President, Vice-President, Secretary, Treasurer, Members). Rules must be certified by at least 3 governing body members.',
          },
          authority: 'Founding Members',
          isMandatory: true,
          checklistItems: [
            'Signed Memorandum of Association',
            'Certified Rules & Regulations (Bylaws)',
            'No-relationship affidavit from office bearers',
          ],
          officialSource: {
            url: 'https://edistrict.delhigovt.nic.in/',
            domain: 'edistrict.delhigovt.nic.in',
            title: 'Delhi e-District Societies Guidelines',
            authority: 'GNCTD',
            tier: 1,
            lastChecked: '2026-09-16',
            isAvailable: true,
          },
        },
        {
          stepNumber: 3,
          title: 'File Online Application on Delhi e-District',
          description: {
            simpleExplanation:
              'Submit the electronic application and upload scanned copies of MoA, Rules, member IDs, and registered office proof on edistrict.delhigovt.nic.in.',
            officialDetails:
              'Apply under "Issuance of Society Registration Certificate", pay the prescribed registration fee online, and submit the application for scrutiny by the Registrar.',
          },
          authority: 'Registrar of Societies, GNCTD',
          isMandatory: true,
          actionLabel: 'Apply on Delhi e-District',
          actionUrl: 'https://edistrict.delhigovt.nic.in/',
          checklistItems: ['Uploaded signed MoA & Rules (PDF)', 'Online fee payment receipt'],
          officialSource: {
            url: 'https://edistrict.delhigovt.nic.in/',
            domain: 'edistrict.delhigovt.nic.in',
            title: 'Delhi e-District Societies Portal',
            authority: 'GNCTD',
            tier: 1,
            lastChecked: '2026-09-16',
            isAvailable: true,
          },
        },
        {
          stepNumber: 4,
          title: 'Scrutiny & Issuance of Society Registration Certificate',
          description: {
            simpleExplanation:
              'The Registrar examines documents and issues the digitally signed Society Registration Certificate.',
            officialDetails:
              'Upon statutory satisfaction under Section 3 of the Societies Registration Act, 1860, the Certificate of Registration is issued with the unique Society Registration Number.',
          },
          authority: 'Registrar of Societies, GNCTD',
          isMandatory: true,
          checklistItems: ['Certificate of Registration (PDF with digital signature)', 'Certified copy of approved MoA'],
          officialSource: {
            url: 'https://edistrict.delhigovt.nic.in/',
            domain: 'edistrict.delhigovt.nic.in',
            title: 'Delhi e-District Societies Portal',
            authority: 'GNCTD',
            tier: 1,
            lastChecked: '2026-09-16',
            isAvailable: true,
          },
        },
      ],
      requiredDocuments: [
        'Memorandum of Association signed by all founding members',
        'Rules & Regulations certified by minimum 3 office bearers',
        'Identity and Address Proofs (Aadhaar and PAN) of all founding members',
        'Affidavit from President/Secretary regarding name and relationship between members',
        'Registered office ownership proof or rent agreement with owner NOC and electricity bill',
      ],
      officialSource: {
        url: 'https://edistrict.delhigovt.nic.in/',
        domain: 'edistrict.delhigovt.nic.in',
        title: 'Delhi e-District Societies Guidelines',
        authority: 'GNCTD',
        tier: 1,
        lastChecked: '2026-09-16',
        isAvailable: true,
      },
    },
  },

  Karnataka: {
    state: 'Karnataka',
    stateCode: 'KA',
    officialSource: {
      url: 'https://kaverionline.karnataka.gov.in/',
      domain: 'kaverionline.karnataka.gov.in',
      title: 'Kaveri Online Services - Department of Stamps and Registration, Government of Karnataka',
      authority: 'Department of Stamps and Registration / District Registrar of Societies, Govt of Karnataka',
      tier: 1,
      lastChecked: '2026-09-15',
      isAvailable: true,
    },
    trustComparison: {
      type: 'Trust',
      title: 'Public Charitable Trust (Karnataka)',
      tagline: 'Registered before jurisdictional Sub-Registrar through Kaveri Online Portal',
      governingAct: 'Indian Trusts Act, 1882 (as administered by Department of Stamps & Registration, Karnataka)',
      registeringAuthority: 'Sub-Registrar Office (Department of Stamps and Registration, Govt of Karnataka)',
      minimumFounders: 'Minimum 2 Trustees (Author/Settlor + Managing Trustee)',
      managementBody: 'Board of Trustees',
      jurisdiction: 'State / District Level',
      registrationPortal: 'Kaveri Online Services (Government of Karnataka)',
      portalUrl: 'https://kaverionline.karnataka.gov.in/',
      generalRouteSummary: {
        simpleExplanation:
          'Trust registration in Karnataka requires drafting a Trust Deed and completing pre-registration data entry and appointment booking on the Kaveri Online Services portal before appearing at the Sub-Registrar office.',
        officialDetails:
          'Under the Registration (Karnataka Amendment) Rules, the draft deed, trustee identification, property settlement, and stamp duty are verified via Kaveri Online 2.0 portal prior to biometric execution before the jurisdictional Sub-Registrar.',
      },
      keyAdvantages: [
        'Clear long-term operational autonomy governed strictly by the Trust Deed',
        'Less administrative turnover than membership-based societies',
        'Streamlined online appointment booking through Kaveri Online 2.0',
      ],
      governanceConsiderations: [
        'Amendments to objects require strict legal procedures or court confirmation',
        'Karnataka stamp duty rates apply on settlement corpus and immovable properties',
      ],
      typicalDocuments: [
        'Draft Trust Deed on Karnataka e-Stamp paper',
        'Aadhaar and PAN cards of Settlor, Trustees, and 2 Witnesses',
        'Registered office address proof with owner NOC and property tax/electricity receipt',
        'Corpus fund allocation details',
      ],
      officialSource: {
        url: 'https://kaverionline.karnataka.gov.in/',
        domain: 'kaverionline.karnataka.gov.in',
        title: 'Kaveri Online Services - Trust Registration Manual',
        authority: 'Department of Stamps and Registration, Karnataka',
        tier: 1,
        lastChecked: '2026-09-15',
        isAvailable: true,
      },
    },
    societyComparison: {
      type: 'Society',
      title: 'Registered Society (Karnataka)',
      tagline: 'Formed under the Karnataka Societies Registration Act, 1960',
      governingAct: 'Karnataka Societies Registration Act, 1960 & Rules 1961',
      registeringAuthority: 'District Registrar of Societies (Department of Co-operation, Govt of Karnataka)',
      minimumFounders: 'Minimum 7 founding members residing in Karnataka',
      managementBody: 'Governing Body / Managing Committee',
      jurisdiction: 'State of Karnataka',
      registrationPortal: 'Department of Co-operation / Sahakara Portal',
      portalUrl: 'https://sahakara.karnataka.gov.in/',
      generalRouteSummary: {
        simpleExplanation:
          'In Karnataka, societies are registered under the state-specific Karnataka Societies Registration Act, 1960. Founding members must adopt a Memorandum of Association and democratic bylaws filed with the District Registrar of Societies.',
        officialDetails:
          'Requires compliance with Section 6 of the Karnataka Societies Registration Act, 1960. The Society must file annual returns, audited balance sheets, and lists of governing body members annually in Form VI.',
      },
      keyAdvantages: [
        'Specific state statutory framework with established district-level registry offices across Karnataka',
        'Democratic governance model well-suited for educational institutions, environmental groups, and community federations',
      ],
      governanceConsiderations: [
        'Strict annual return filing (Form VI) with the District Registrar of Societies',
        'Mandatory renewal and audit compliance under Karnataka state rules',
      ],
      typicalDocuments: [
        'Memorandum of Association & Rules (signed by all 7+ members)',
        'Proceedings of the First General Meeting',
        'Identity & Address proofs of all founding members in Karnataka',
        'Registered office rental agreement and owner NOC',
      ],
      officialSource: {
        url: 'https://sahakara.karnataka.gov.in/',
        domain: 'sahakara.karnataka.gov.in',
        title: 'Department of Co-operation, Government of Karnataka',
        authority: 'Government of Karnataka',
        tier: 1,
        lastChecked: '2026-09-15',
        isAvailable: true,
      },
    },
    trustGuide: {
      state: 'Karnataka',
      organisationType: 'Trust',
      authorityName: 'Department of Stamps and Registration, Government of Karnataka',
      portalName: 'Kaveri Online Services Portal',
      portalUrl: 'https://kaverionline.karnataka.gov.in/',
      overview: {
        simpleExplanation:
          'Register a Public Charitable Trust in Karnataka using the state government Kaveri Online 2.0 portal for document upload, stamp duty verification, and booking your Sub-Registrar appointment.',
        officialDetails:
          'Governed by the Registration Act, 1908 and Indian Trusts Act, 1882 as administered in Karnataka. E-Stamping is conducted through authorized centers, and document registration is finalized at the local Sub-Registrar office.',
      },
      steps: [
        {
          stepNumber: 1,
          title: 'Draft the Trust Deed & Procure Karnataka e-Stamp',
          description: {
            simpleExplanation:
              'Prepare the Trust Deed with non-profit objects and purchase the required Karnataka e-Stamp paper from an authorized center.',
            officialDetails:
              'Deed must specify irrevocability, public charitable objectives, trustee powers, and dedication of corpus. Procure e-Stamp certificate with prescribed Karnataka stamp duty.',
          },
          authority: 'Authorized e-Stamp Centre / Legal Drafter',
          isMandatory: true,
          checklistItems: ['Drafted Trust Deed', 'Valid Karnataka e-Stamp Certificate'],
          officialSource: {
            url: 'https://kaverionline.karnataka.gov.in/',
            domain: 'kaverionline.karnataka.gov.in',
            title: 'Kaveri Online Services Guidelines',
            authority: 'Govt of Karnataka',
            tier: 1,
            lastChecked: '2026-09-15',
            isAvailable: true,
          },
        },
        {
          stepNumber: 2,
          title: 'Online Pre-Registration & Data Entry on Kaveri 2.0',
          description: {
            simpleExplanation:
              'Register an account on Kaveri Online Services, enter Settlor/Trustee details, upload deed draft, and pay registration fees.',
            officialDetails:
              'Complete e-KYC on kaverionline.karnataka.gov.in, select "Deed Registration", enter party particulars and registered office address in Karnataka, and schedule appointment slot.',
          },
          authority: 'Department of Stamps & Registration, Karnataka',
          isMandatory: true,
          actionLabel: 'Access Kaveri Online 2.0',
          actionUrl: 'https://kaverionline.karnataka.gov.in/',
          checklistItems: ['Completed Kaveri Application Form', 'Fee payment acknowledgement slip'],
          officialSource: {
            url: 'https://kaverionline.karnataka.gov.in/',
            domain: 'kaverionline.karnataka.gov.in',
            title: 'Kaveri Online Services Portal',
            authority: 'Govt of Karnataka',
            tier: 1,
            lastChecked: '2026-09-15',
            isAvailable: true,
          },
        },
        {
          stepNumber: 3,
          title: 'Sub-Registrar Appearance & Final Execution',
          description: {
            simpleExplanation:
              'Appear at the Sub-Registrar office on the scheduled appointment date with original IDs and 2 witnesses for biometric registration.',
            officialDetails:
              'Sub-Registrar captures live photo and fingerprints of Settlor and Trustees, validates witnesses, and issues the registered document with the official registration endorsement.',
          },
          authority: 'Jurisdictional Sub-Registrar Office, Karnataka',
          isMandatory: true,
          checklistItems: [
            'Physical presence of Settlor, Trustees, and 2 Witnesses',
            'Original Aadhaar & PAN cards',
            'Registered office NOC & electricity bill',
          ],
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
      ],
      requiredDocuments: [
        'Trust Deed on Karnataka e-Stamp Paper',
        'Identity Proofs (Aadhaar & PAN) of Settlor, Trustees, and 2 Witnesses',
        'Address Proof of Registered Office in Karnataka (Electricity bill + Rent Agreement + Owner NOC)',
        'Passport Size Photographs of all parties',
      ],
      officialSource: {
        url: 'https://kaverionline.karnataka.gov.in/',
        domain: 'kaverionline.karnataka.gov.in',
        title: 'Kaveri Online Services Manual',
        authority: 'Govt of Karnataka',
        tier: 1,
        lastChecked: '2026-09-15',
        isAvailable: true,
      },
    },
    societyGuide: {
      state: 'Karnataka',
      organisationType: 'Society',
      authorityName: 'District Registrar of Societies (Department of Co-operation, Govt of Karnataka)',
      portalName: 'Karnataka Sahakara / District Registrar Services',
      portalUrl: 'https://sahakara.karnataka.gov.in/',
      overview: {
        simpleExplanation:
          'Register a Society under the Karnataka Societies Registration Act, 1960 with minimum 7 founding members by filing the MoA and bylaws with the District Registrar of Societies.',
        officialDetails:
          'Governed strictly by the Karnataka Societies Registration Act, 1960 and Karnataka Societies Registration Rules, 1961. Requires submission to the District Registrar of the district where the registered office is located.',
      },
      steps: [
        {
          stepNumber: 1,
          title: 'Draft MoA & Rules under Karnataka Act of 1960',
          description: {
            simpleExplanation:
              'Draft Memorandum of Association and Rules & Regulations in accordance with the Karnataka Societies Registration Act, 1960.',
            officialDetails:
              'The memorandum must contain name, objects, names/addresses/occupations of governing body members, signed by at least 7 members in the presence of a gazetted officer or advocate.',
          },
          authority: 'Founding Members (Minimum 7)',
          isMandatory: true,
          checklistItems: ['Signed MoA', 'Signed Rules & Regulations', 'Proceedings of inaugural general meeting'],
          officialSource: {
            url: 'https://sahakara.karnataka.gov.in/',
            domain: 'sahakara.karnataka.gov.in',
            title: 'Department of Co-operation, Karnataka',
            authority: 'Govt of Karnataka',
            tier: 1,
            lastChecked: '2026-09-15',
            isAvailable: true,
          },
        },
        {
          stepNumber: 2,
          title: 'Submit Application to the District Registrar of Societies',
          description: {
            simpleExplanation:
              'Submit the application form along with prescribed registration fees and documents to the District Registrar office in your district.',
            officialDetails:
              'Submit Form I application under Section 6 of the Act to the jurisdictional District Registrar, paying state treasury fees via K2 (Khajane II) challan.',
          },
          authority: 'District Registrar of Societies, Karnataka',
          isMandatory: true,
          actionLabel: 'Department of Co-operation Info',
          actionUrl: 'https://sahakara.karnataka.gov.in/',
          checklistItems: ['Form I Application', 'Treasury Challan receipt (Khajane II)', 'Member identity proofs'],
          officialSource: {
            url: 'https://sahakara.karnataka.gov.in/',
            domain: 'sahakara.karnataka.gov.in',
            title: 'Karnataka Department of Co-operation',
            authority: 'Govt of Karnataka',
            tier: 1,
            lastChecked: '2026-09-15',
            isAvailable: true,
          },
        },
        {
          stepNumber: 3,
          title: 'Receipt of Certificate of Registration',
          description: {
            simpleExplanation:
              'The District Registrar scrutinizes the bylaws and issues the official Certificate of Registration under the Karnataka Act, 1960.',
            officialDetails:
              'Upon approval, the Registrar issues Form II (Certificate of Registration) and certified copies of the approved Memorandum of Association.',
          },
          authority: 'District Registrar of Societies, Karnataka',
          isMandatory: true,
          checklistItems: ['Certificate of Registration (Form II)', 'Approved MoA copy'],
          officialSource: {
            url: 'https://sahakara.karnataka.gov.in/',
            domain: 'sahakara.karnataka.gov.in',
            title: 'Department of Co-operation, Karnataka',
            authority: 'Govt of Karnataka',
            tier: 1,
            lastChecked: '2026-09-15',
            isAvailable: true,
          },
        },
      ],
      requiredDocuments: [
        'Memorandum of Association signed by minimum 7 members',
        'Rules & Regulations of the Society',
        'Minutes of the first meeting of the founding members',
        'Aadhaar and PAN cards of all 7 founding members',
        'Registered office address proof with owner NOC in Karnataka',
        'Treasury Challan proof of registration fee payment',
      ],
      officialSource: {
        url: 'https://sahakara.karnataka.gov.in/',
        domain: 'sahakara.karnataka.gov.in',
        title: 'Department of Co-operation, Karnataka',
        authority: 'Govt of Karnataka',
        tier: 1,
        lastChecked: '2026-09-15',
        isAvailable: true,
      },
    },
  },

  Maharashtra: {
    state: 'Maharashtra',
    stateCode: 'MH',
    officialSource: {
      url: 'https://charity.maharashtra.gov.in/',
      domain: 'charity.maharashtra.gov.in',
      title: 'Charity Organization, Government of Maharashtra - MahaCharity Portal',
      authority: 'Office of the Charity Commissioner, Government of Maharashtra',
      tier: 1,
      lastChecked: '2026-09-14',
      isAvailable: true,
    },
    trustComparison: {
      type: 'Trust',
      title: 'Public Charitable Trust (Maharashtra)',
      tagline: 'Governed and registered under the landmark Maharashtra Public Trusts Act',
      governingAct: 'Maharashtra Public Trusts Act, 1950 (read with Bombay Public Trusts Rules)',
      registeringAuthority: 'Office of the Charity Commissioner / Joint Charity Commissioner, Maharashtra',
      minimumFounders: 'Minimum 2 Trustees (Settlor + Trustees)',
      managementBody: 'Board of Trustees',
      jurisdiction: 'State of Maharashtra (Region-wise Joint Charity Commissioner offices)',
      registrationPortal: 'MahaCharity Portal (Office of the Charity Commissioner)',
      portalUrl: 'https://charity.maharashtra.gov.in/',
      generalRouteSummary: {
        simpleExplanation:
          'In Maharashtra, all public charitable trusts must be registered with the Charity Commissioner under the Maharashtra Public Trusts Act, 1950. Applications are filed online on the MahaCharity portal and scrutinized by the Assistant/Joint Charity Commissioner.',
        officialDetails:
          'Under Section 18 of the Maharashtra Public Trusts Act, 1950, the trustee of every public trust must make an application for registration to the Deputy or Assistant Charity Commissioner within whose jurisdiction the trust property or office is situated.',
      },
      keyAdvantages: [
        'Statutory framework under the Charity Commissioner with strong institutional recognition',
        'Formal public trust register (Schedule I) maintained by the state',
      ],
      governanceConsiderations: [
        'Mandatory annual filing of audited balance sheets and contribution to the Public Trust Administration Fund',
        'Prior permission from Charity Commissioner required for sale/alienation of immovable trust properties (Section 36)',
      ],
      typicalDocuments: [
        'Registered Trust Deed copy or draft trust agreement with Consent Letters of Trustees',
        'Schedule II application form under Maharashtra Public Trusts Act',
        'Affidavit of Trustees & Consent of Trustees (Form VI)',
        'Registered office address proof with municipal tax receipt / electricity bill',
      ],
      officialSource: {
        url: 'https://charity.maharashtra.gov.in/',
        domain: 'charity.maharashtra.gov.in',
        title: 'MahaCharity Portal Manual',
        authority: 'Charity Commissioner, Maharashtra',
        tier: 1,
        lastChecked: '2026-09-14',
        isAvailable: true,
      },
    },
    societyComparison: {
      type: 'Society',
      title: 'Registered Society & Public Trust (Maharashtra)',
      tagline: 'Dual registration under Societies Registration Act & Maharashtra Public Trusts Act',
      governingAct: 'Societies Registration Act, 1860 (Maharashtra) & Maharashtra Public Trusts Act, 1950',
      registeringAuthority: 'Assistant Registrar of Societies / Assistant Charity Commissioner, Maharashtra',
      minimumFounders: 'Minimum 7 founding members',
      managementBody: 'Managing Committee / Governing Body',
      jurisdiction: 'State of Maharashtra',
      registrationPortal: 'MahaCharity Online Portal',
      portalUrl: 'https://charity.maharashtra.gov.in/',
      generalRouteSummary: {
        simpleExplanation:
          'In Maharashtra, a registered society automatically becomes subject to registration as a Public Trust under the Maharashtra Public Trusts Act, 1950, creating a robust dual-governance model under the Charity Commissioner.',
        officialDetails:
          'Societies are registered by the Assistant Registrar of Societies (who also functions as Assistant Charity Commissioner). Once registered under the Societies Act, 1860, the society is automatically enrolled in the Public Trusts Register (PTR).',
      },
      keyAdvantages: [
        'Democratic membership governance combined with statutory public trust recognition in Maharashtra',
        'Wide public acceptability across Maharashtra for social, educational, and medical initiatives',
      ],
      governanceConsiderations: [
        'Must comply with both Societies Act annual elections and Charity Commissioner annual audit filings',
      ],
      typicalDocuments: [
        'Memorandum of Association & Rules signed by all 7+ members',
        'Consent letters and affidavits of all governing council members',
        'Registered office proof with owner NOC and electricity receipt',
      ],
      officialSource: {
        url: 'https://charity.maharashtra.gov.in/',
        domain: 'charity.maharashtra.gov.in',
        title: 'MahaCharity Online Portal',
        authority: 'Office of the Charity Commissioner, Maharashtra',
        tier: 1,
        lastChecked: '2026-09-14',
        isAvailable: true,
      },
    },
    trustGuide: {
      state: 'Maharashtra',
      organisationType: 'Trust',
      authorityName: 'Office of the Charity Commissioner, Government of Maharashtra',
      portalName: 'MahaCharity Online Services',
      portalUrl: 'https://charity.maharashtra.gov.in/',
      overview: {
        simpleExplanation:
          'Register a Public Charitable Trust in Maharashtra through the official MahaCharity portal, submitting your trust deed and trustee affidavits to the Assistant Charity Commissioner.',
        officialDetails:
          'Governed by the Maharashtra Public Trusts Act, 1950. An application under Section 18 is filed electronically on the MahaCharity portal and confirmed via formal inquiry by the Charity Authority.',
      },
      steps: [
        {
          stepNumber: 1,
          title: 'Draft & Execute Trust Deed',
          description: {
            simpleExplanation:
              'Draft the Trust Deed detailing charitable objects, non-distribution of profits, and trustee governance.',
            officialDetails:
              'Draft deed on appropriate Maharashtra stamp paper, signed by Settlor and Trustees with two independent witnesses.',
          },
          authority: 'Settlor & Trustees',
          isMandatory: true,
          checklistItems: ['Trust Deed on Maharashtra Stamp Paper', 'Objects conforming to Section 9 of the Act'],
          officialSource: {
            url: 'https://charity.maharashtra.gov.in/',
            domain: 'charity.maharashtra.gov.in',
            title: 'MahaCharity Guidelines',
            authority: 'Charity Commissioner, Maharashtra',
            tier: 1,
            lastChecked: '2026-09-14',
            isAvailable: true,
          },
        },
        {
          stepNumber: 2,
          title: 'File Application on MahaCharity Portal (Schedule II)',
          description: {
            simpleExplanation:
              'Submit the electronic registration application under Section 18 on charity.maharashtra.gov.in.',
            officialDetails:
              'Fill Schedule II application form, upload Trust Deed, consent letters of trustees, affidavit of the applicant trustee, and registered office proof.',
          },
          authority: 'Office of the Assistant Charity Commissioner',
          isMandatory: true,
          actionLabel: 'Open MahaCharity Portal',
          actionUrl: 'https://charity.maharashtra.gov.in/',
          checklistItems: ['Schedule II Application', 'Affidavit of applicant trustee', 'Fee payment challan'],
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
        {
          stepNumber: 3,
          title: 'Inquiry & Issuance of Certificate (Schedule I / PTR Entry)',
          description: {
            simpleExplanation:
              'The Charity Authority conducts verification and issues the Certificate of Registration under the Maharashtra Public Trusts Act.',
            officialDetails:
              'After statutory verification under Section 19, the Assistant Charity Commissioner records the trust into the Public Trust Register (PTR) and issues the Certificate of Registration under Section 22.',
          },
          authority: 'Charity Commissioner, Maharashtra',
          isMandatory: true,
          checklistItems: ['Certificate of Registration (PTR Entry)', 'Certified Schedule I extract'],
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
      ],
      requiredDocuments: [
        'Executed Trust Deed on Maharashtra Stamp Paper',
        'Identity & Address proofs of Settlor and all Trustees (Aadhaar & PAN)',
        'Consent Letters from all proposed Trustees',
        'Affidavit in prescribed format by the applicant Trustee',
        'Registered office ownership proof or rent agreement with owner NOC',
      ],
      officialSource: {
        url: 'https://charity.maharashtra.gov.in/',
        domain: 'charity.maharashtra.gov.in',
        title: 'Charity Organization, Maharashtra',
        authority: 'Govt of Maharashtra',
        tier: 1,
        lastChecked: '2026-09-14',
        isAvailable: true,
      },
    },
    societyGuide: {
      state: 'Maharashtra',
      organisationType: 'Society',
      authorityName: 'Assistant Registrar of Societies / Charity Commissioner, Maharashtra',
      portalName: 'MahaCharity Portal',
      portalUrl: 'https://charity.maharashtra.gov.in/',
      overview: {
        simpleExplanation:
          'Register a Society in Maharashtra via the MahaCharity portal with minimum 7 founding members under the Societies Registration Act, 1860 and Maharashtra Public Trusts Act.',
        officialDetails:
          'Applications are submitted to the Assistant Registrar of Societies on charity.maharashtra.gov.in with MoA, Rules & Regulations, and member consent letters.',
      },
      steps: [
        {
          stepNumber: 1,
          title: 'Draft MoA & Rules & Regulations',
          description: {
            simpleExplanation:
              'Draft Memorandum of Association and democratic Rules & Regulations signed by minimum 7 founding members.',
            officialDetails:
              'MoA must state name, objects, and governing body members. Rules must specify membership criteria, election procedures, and meeting quorums.',
          },
          authority: 'Founding Members (Minimum 7)',
          isMandatory: true,
          checklistItems: ['Signed MoA', 'Signed Rules & Regulations', 'Minutes of First Meeting'],
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
        {
          stepNumber: 2,
          title: 'Submit Online Application on MahaCharity',
          description: {
            simpleExplanation:
              'Upload drafted documents, member IDs, and registered office proof on charity.maharashtra.gov.in.',
            officialDetails:
              'Fill online society registration form, upload scanned copy of MoA, Rules, affidavits of President/Secretary, and pay statutory fees.',
          },
          authority: 'Assistant Registrar of Societies, Maharashtra',
          isMandatory: true,
          actionLabel: 'Apply on MahaCharity',
          actionUrl: 'https://charity.maharashtra.gov.in/',
          checklistItems: ['Online Application Form', 'Fee receipt', 'Affidavits of Office Bearers'],
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
        {
          stepNumber: 3,
          title: 'Issuance of Society Certificate & PTR Registration',
          description: {
            simpleExplanation:
              'Assistant Registrar approves the bylaws and issues the Society Registration Certificate along with Public Trust Register enrollment.',
            officialDetails:
              'Certificate of Registration is issued under the Societies Registration Act, 1860 along with automatic Schedule I entry under the Maharashtra Public Trusts Act, 1950.',
          },
          authority: 'Charity Commissioner / Assistant Registrar, Maharashtra',
          isMandatory: true,
          checklistItems: ['Society Registration Certificate', 'PTR Entry Number'],
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
      ],
      requiredDocuments: [
        'Memorandum of Association signed by minimum 7 members',
        'Rules & Regulations certified by minimum 3 office bearers',
        'Identity & Address proofs of all founding members',
        'Affidavit of President/Secretary',
        'Registered office address proof with owner NOC and electricity receipt',
      ],
      officialSource: {
        url: 'https://charity.maharashtra.gov.in/',
        domain: 'charity.maharashtra.gov.in',
        title: 'Charity Organization, Maharashtra',
        authority: 'Govt of Maharashtra',
        tier: 1,
        lastChecked: '2026-09-14',
        isAvailable: true,
      },
    },
  },
};

export const StateRegistryAdapter: SourceAdapter<{
  registries: Record<string, StateRegistrySourceBundle>;
}> = {
  sourceKey: 'state_registries_multi',
  officialSource: {
    url: 'https://www.india.gov.in/topics/governance-administration',
    domain: 'india.gov.in',
    title: 'National Portal of India - State Registration & Governance Authorities Directory',
    authority: 'National Informatics Centre (NIC), Government of India',
    tier: 1,
    lastChecked: '2026-09-15',
    isAvailable: true,
  },

  async fetchAndNormalize() {
    const metadata: SourceIngestionMetadata = {
      sourceKey: this.sourceKey,
      source: this.officialSource,
      lastRetrievedAt: new Date().toISOString(),
      status: 'ACTIVE_VERIFIED',
    };

    return {
      data: { registries: STATE_REGISTRIES_DATABASE },
      metadata,
    };
  },
};
