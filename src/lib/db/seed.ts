import { Database, type SchemeRecord, type DocumentRecord, type ApplicationRecord } from './database';
import { SCHEMES_CATALOG } from '../ngo/mock-schemes';
import { DEMO_DOCUMENTS, DEMO_APPLICATIONS } from '../ngo/mock-data';
import { hashPassword } from '../auth/security';

export async function ensureDatabaseSeeded(): Promise<void> {
  const db = Database.getInstance();
  if (db.isInitialized()) return;

  const state = db.getState();
  let modified = false;

  // 1. Seed Schemes Catalog (Prototype government schemes marked with is_sample = 1)
  if (state.schemes.length === 0) {
    const schemeRecords: SchemeRecord[] = SCHEMES_CATALOG.map((scheme) => ({
      id: scheme.id,
      name: scheme.name,
      short_description: scheme.shortDescription,
      full_description: scheme.fullDescription,
      sector: scheme.sector,
      department: scheme.department,
      target_beneficiaries: JSON.stringify(scheme.targetBeneficiaries),
      applicable_states: JSON.stringify(scheme.applicableStates),
      aid_type: scheme.aidType,
      status: scheme.status,
      eligibility_criteria: JSON.stringify(scheme.eligibilityCriteria),
      required_documents: JSON.stringify(scheme.requiredDocuments),
      application_process: JSON.stringify(scheme.applicationProcess),
      official_source: scheme.officialSource,
      last_updated: scheme.lastUpdated,
      tags: JSON.stringify(scheme.tags),
      is_sample: 1,
      created_at: new Date().toISOString(),
    }));
    state.schemes.push(...schemeRecords);
    modified = true;
  }

  // 2. Seed Default Demo Accounts if users table is empty
  if (state.users.length === 0) {
    const defaultHash = await hashPassword('Password123');
    const now = new Date().toISOString();

    // Demo NGO
    const demoNgoUserId = 'usr_demo_ngo_01';
    const demoNgoProfileId = 'ngo_demo_01';

    state.users.push({
      id: demoNgoUserId,
      email: 'demo@sahaysetungo.org',
      password_hash: defaultHash,
      role: 'ngo',
      created_at: now,
      updated_at: now,
    });

    state.ngo_profiles.push({
      id: demoNgoProfileId,
      user_id: demoNgoUserId,
      ngo_name: 'Gram Vikas Seva Sansthan',
      registration_number: 'DL/2021/0284918',
      focus_sector: 'Rural Development & Education',
      phone_number: '+91 9876543210',
      contact_person: 'Aarav Sharma',
      state: 'Delhi',
      city: 'New Delhi',
      address: 'Sector 12, Dwarka',
      verified: 1,
      created_at: now,
      updated_at: now,
    });

    // Seed initial saved scheme for demo NGO
    state.saved_schemes.push({
      id: 'saved_demo_01',
      ngo_id: demoNgoProfileId,
      scheme_id: 'sch-01',
      saved_at: now,
    });

    // Seed demo applications for demo NGO
    const demoAppRecords: ApplicationRecord[] = DEMO_APPLICATIONS.map((app) => ({
      id: app.id,
      ngo_id: demoNgoProfileId,
      scheme_id: app.schemeId,
      scheme_title: app.schemeTitle,
      department: app.department,
      reference_number: app.referenceNumber,
      status: app.status,
      next_action: app.nextAction,
      form_data: app.formData ? JSON.stringify(app.formData) : undefined,
      submission_deadline: app.submissionDeadline,
      submitted_at: app.submittedAt,
      is_sample: app.isSample ? 1 : 0,
      created_at: now,
      updated_at: now,
    }));
    state.applications.push(...demoAppRecords);

    // Seed demo documents for demo NGO
    const demoDocRecords: DocumentRecord[] = DEMO_DOCUMENTS.map((doc) => ({
      id: doc.id,
      ngo_id: demoNgoProfileId,
      name: doc.name,
      category: doc.category,
      status: doc.status,
      valid_till: doc.validTill,
      notes: doc.notes,
      is_required: doc.isRequired ? 1 : 0,
      created_at: now,
      updated_at: now,
    }));
    state.documents.push(...demoDocRecords);

    // Seed Demo NGO Public Profile
    state.ngo_public_profiles = state.ngo_public_profiles || [];
    state.ngo_public_profiles.push({
      id: 'pub_prof_demo_01',
      ngo_id: demoNgoProfileId,
      ngo_name: 'Gram Vikas Seva Sansthan',
      about: 'Dedicated to community empowerment, girl child education, and rural livelihoods in Delhi NCR and Western UP since 2012.',
      primary_cause: 'Education',
      additional_causes: JSON.stringify(['Children', 'Women & Girls', 'Rural Development']),
      address: 'Plot 18, Institutional Area, Sector 12, Dwarka',
      city: 'New Delhi',
      district: 'South West Delhi',
      state: 'Delhi',
      pincode: '110075',
      operating_areas: JSON.stringify(['Dwarka', 'Najafgarh', 'Uttam Nagar', 'Palam']),
      contact_person: 'Aarav Sharma',
      phone: '+91 9876543210',
      email: 'contact@gramvikas.org',
      website: 'https://gramvikas-seva.org',
      accepted_donation_types: JSON.stringify(['Books', 'Stationery', 'Clothes', 'Volunteer time']),
      services_provided: JSON.stringify(['Education support', 'Women support', 'Child welfare', 'Government scheme assistance']),
      operating_hours: 'Mon-Sat: 9:00 AM - 6:00 PM',
      established_year: 2012,
      latitude: 28.5921,
      longitude: 77.046,
      updated_at: now,
    });

    // Seed Demo NGO Donation Needs
    state.ngo_donation_needs = state.ngo_donation_needs || [];
    state.ngo_donation_needs.push({
      id: 'need_demo_01',
      ngo_id: demoNgoProfileId,
      ngo_name: 'Gram Vikas Seva Sansthan',
      title: 'Class 6-10 NCERT Textbooks & Notebooks',
      category: 'Books',
      cause_category: 'Education',
      description: 'Urgent requirement of English & Hindi medium textbooks and unruled notebooks for 120 students in our remedial evening learning centre.',
      items_required: 'NCERT standard textbooks, geometry boxes, long register notebooks',
      quantity_needed: '120 sets',
      quantity_collected: '45 sets',
      location: 'Dwarka Sector 12 Centre',
      preferred_contribution_type: 'Books',
      start_date: '2026-09-01',
      end_date: '2026-10-31',
      dropoff_info: 'Gate 2 Community Centre, Sector 12 Dwarka (10 AM - 5 PM)',
      accepts_courier: 1,
      contact_info: '+91 9876543210 (Aarav Sharma)',
      status: 'Accepting',
      urgency: 'Immediate',
      created_at: now,
      updated_at: now,
    });

    // Seed Demo NGO Campaigns
    state.ngo_campaigns = state.ngo_campaigns || [];
    state.ngo_campaigns.push({
      id: 'cmp_demo_01',
      ngo_id: demoNgoProfileId,
      ngo_name: 'Gram Vikas Seva Sansthan',
      title: 'Har Bachha School Abhiyan',
      description: 'A community drive to ensure 250 out-of-school children get essential study materials, school bags, and stationery kits.',
      cause: 'Education',
      objective: 'Provide learning kits to 250 students for the upcoming academic cycle.',
      donation_types_accepted: JSON.stringify(['Books', 'Stationery', 'Money']),
      location: 'Dwarka & Najafgarh clusters, New Delhi',
      start_date: '2026-09-10',
      end_date: '2026-11-15',
      target_units: '250 Learning Kits',
      collected_units: '110 Learning Kits',
      contact: 'aarav@gramvikas.org | +91 9876543210',
      status: 'Active',
      created_at: now,
      updated_at: now,
    });

    // Seed Demo NGO Events
    state.ngo_events = state.ngo_events || [];
    state.ngo_events.push({
      id: 'evt_demo_01',
      ngo_id: demoNgoProfileId,
      ngo_name: 'Gram Vikas Seva Sansthan',
      title: 'Mega Book & Stationery Collection Camp',
      description: 'Community drop-off drive for gently used books, uniforms, and stationery kits. Volunteers will help sort and stamp materials.',
      date: '2026-10-04',
      start_time: '10:00 AM',
      end_time: '4:00 PM',
      location: 'Community Hall, Sector 12, Dwarka, New Delhi',
      event_type: 'Donation Drive',
      participation_type: 'Open to All',
      contact_info: 'Call +91 9876543210 or email info@gramvikas.org',
      status: 'Active',
      created_at: now,
      updated_at: now,
    });

    // Seed Demo NGO Volunteer Ops
    state.ngo_volunteer_ops = state.ngo_volunteer_ops || [];
    state.ngo_volunteer_ops.push({
      id: 'vol_demo_01',
      ngo_id: demoNgoProfileId,
      ngo_name: 'Gram Vikas Seva Sansthan',
      title: 'Weekend Remedial Mathematics & Science Mentor',
      description: 'Mentor middle-school students in foundational math and science concepts on Saturday & Sunday mornings.',
      required_skills: JSON.stringify(['Teaching', 'Mathematics', 'Hindi/English fluency']),
      cause: 'Education',
      location: 'Sector 12 Centre, Dwarka, New Delhi',
      date_time: 'Saturdays & Sundays, 10:00 AM - 12:30 PM',
      duration: '3 months (2.5 hrs/week)',
      volunteers_required: 6,
      volunteers_enrolled: 2,
      opportunity_type: 'Recurring',
      contact: 'volunteer@gramvikas.org',
      status: 'Active',
      created_at: now,
      updated_at: now,
    });

    // Seed Demo Help Requests
    state.help_requests = state.help_requests || [];
    state.help_requests.push({
      id: 'req_demo_01',
      user_id: 'usr_demo_citizen_01',
      citizen_name: 'Pooja Verma',
      citizen_phone: '+91 9123456780',
      citizen_email: 'citizen@sahaysetu.org',
      ngo_id: demoNgoProfileId,
      ngo_name: 'Gram Vikas Seva Sansthan',
      category: 'Education support',
      need_title: 'School books and notebooks for 2 children',
      need_description: 'Looking for 7th and 9th standard NCERT Hindi medium textbooks and notebooks for my two children for the term.',
      items_requested: 'NCERT Class 7 & 9 Science and Math books, 6 register notebooks',
      location: 'Najafgarh, New Delhi',
      urgency: 'Within a week',
      status: 'New',
      created_at: now,
      updated_at: now,
    });

    // Demo Citizen User
    const demoCitizenUserId = 'usr_demo_citizen_01';
    state.users.push({
      id: demoCitizenUserId,
      email: 'citizen@sahaysetu.org',
      password_hash: defaultHash,
      role: 'user',
      created_at: now,
      updated_at: now,
    });

    state.citizen_profiles.push({
      id: 'ctz_demo_01',
      user_id: demoCitizenUserId,
      full_name: 'Pooja Verma',
      phone_number: '+91 9123456780',
      state: 'Uttar Pradesh',
      preferred_language: 'Hindi',
      created_at: now,
      updated_at: now,
    });

    modified = true;
  }

  if (modified) {
    db.save();
  }
  db.setInitialized(true);
}
