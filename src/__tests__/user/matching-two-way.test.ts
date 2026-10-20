import { describe, it, expect, beforeEach } from 'vitest';
import { Database } from '@/lib/db/database';
import { NgoPublishStore } from '@/lib/db/ngo-publish-store';
import { UserStore } from '@/lib/db/user-store';

describe('Two-Way NGO to Citizen Matching Flow', () => {
  const customNgoId = 'ngo_dynamic_test_01';
  const customNgoName = 'Gyan Jyoti Foundation';

  beforeEach(() => {
    Database.getInstance().reset();
  });

  it('connects NGO published data to citizen search and discovery seamlessly', async () => {
    // Step 1: NGO Publishes Profile with accepted donation types & services provided
    await NgoPublishStore.saveProfile(customNgoId, customNgoName, {
      about: 'Providing primary education support and educational kits across NCR.',
      primaryCause: 'Education',
      address: 'Near Hauz Khas Metro',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110016',
      latitude: 28.5494,
      longitude: 77.2001,
      phone: '+91 9876543210',
      email: 'gyanjyoti@test.org',
      acceptedDonationTypes: ['Books', 'Stationery'],
      servicesProvided: ['Education support'],
    });

    // Step 2: NGO Publishes Donation Need: "School Books Needed"
    await NgoPublishStore.createNeed(customNgoId, customNgoName, {
      title: 'School Books Needed',
      category: 'Books',
      causeCategory: 'Education',
      description: 'NCERT textbooks for Class 6-10',
      itemsRequired: '100 books',
      quantityNeeded: '100',
      location: 'Hauz Khas Centre',
      preferredContributionType: 'Books',
      acceptsCourier: true,
      contactInfo: '+91 9876543210',
      status: 'Accepting',
      urgency: 'Immediate',
    });

    // Step 3: NGO Publishes Campaign: "Back to School Drive"
    await NgoPublishStore.createCampaign(customNgoId, customNgoName, {
      title: 'Back to School Drive',
      description: 'Annual drive to equip 200 children with study materials',
      cause: 'Education',
      objective: 'Distribute 200 school bags and stationery kits',
      donationTypesAccepted: ['Books', 'Stationery'],
      location: 'South Delhi',
      startDate: '2026-09-15',
      endDate: '2026-10-31',
      targetUnits: '200 Kits',
      contact: 'info@gyanjyoti.org',
      status: 'Active',
    });

    // Step 4: NGO Publishes Event: "Community Book Collection Day"
    await NgoPublishStore.createEvent(customNgoId, customNgoName, {
      title: 'Community Book Collection Day',
      description: 'Drop off children books at Hauz Khas community hall',
      date: '2026-10-12',
      startTime: '10:00 AM',
      endTime: '04:00 PM',
      location: 'Community Hall, Hauz Khas, New Delhi',
      eventType: 'Donation Drive',
      participationType: 'Open to All',
      contactInfo: '+91 9876543210',
      status: 'Active',
    });

    // Step 5: NGO Publishes Volunteer Op: "Weekend Teaching Volunteer"
    await NgoPublishStore.createVolunteerOp(customNgoId, customNgoName, {
      title: 'Weekend Teaching Volunteer',
      description: 'Teach english and mathematics to students',
      requiredSkills: ['Teaching', 'English'],
      cause: 'Education',
      location: 'Hauz Khas, New Delhi',
      dateTime: 'Saturdays, 10:00 AM - 01:00 PM',
      duration: '3 months',
      volunteersRequired: 4,
      opportunityType: 'Recurring',
      contact: 'volunteer@gyanjyoti.org',
      status: 'Active',
    });

    // ==================== CITIZEN DISCOVERY VERIFICATION ====================

    // A. Citizen "I Want to Help" searches for "Books"
    const matchingNgosForBooks = await UserStore.getPublicNgos({
      donationTypes: ['Books'],
    });

    const gyanJyotiOrg = matchingNgosForBooks.find((n) => n.id === customNgoId);
    expect(gyanJyotiOrg).toBeDefined();
    expect(gyanJyotiOrg?.name).toBe('Gyan Jyoti Foundation');

    // B. Verify published Need appears on the organisation
    const publishedNeed = gyanJyotiOrg?.currentNeeds.find((n) => n.item === 'School Books Needed');
    expect(publishedNeed).toBeDefined();
    expect(publishedNeed?.status).toBe('Accepting');

    // C. Verify published Campaign appears
    const publishedCampaign = gyanJyotiOrg?.activeCampaigns.find((c) => c.title === 'Back to School Drive');
    expect(publishedCampaign).toBeDefined();

    // D. Verify published Event appears
    const publishedEvent = gyanJyotiOrg?.upcomingEvents.find((e) => e.title === 'Community Book Collection Day');
    expect(publishedEvent).toBeDefined();

    // E. Verify Volunteer Opportunity appears
    const publishedVolOp = gyanJyotiOrg?.volunteerOpportunities?.find((v) => v.title === 'Weekend Teaching Volunteer');
    expect(publishedVolOp).toBeDefined();

    // F. Citizen "I Need Help" searches for "Education support"
    const matchingNgosForHelp = await UserStore.getPublicNgos({
      serviceCategory: 'Education support',
    });

    const helpMatchedOrg = matchingNgosForHelp.find((n) => n.id === customNgoId);
    expect(helpMatchedOrg).toBeDefined();
    expect(helpMatchedOrg?.servicesProvided).toContain('Education support');
  });
});
