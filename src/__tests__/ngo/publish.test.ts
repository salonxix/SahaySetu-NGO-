import { describe, it, expect, beforeEach } from 'vitest';
import { Database } from '@/lib/db/database';
import { NgoPublishStore } from '@/lib/db/ngo-publish-store';

describe('NGO Public Publishing & Data Store', () => {
  const testNgoId = 'ngo_test_publish_01';
  const testNgoName = 'Test Seva Trust';

  beforeEach(() => {
    Database.getInstance().reset();
  });

  it('allows an NGO to create and update a donation need', async () => {
    // 1. Create Need
    const need = await NgoPublishStore.createNeed(testNgoId, testNgoName, {
      title: 'School Books Needed',
      category: 'Books',
      causeCategory: 'Education',
      description: 'NCERT textbooks for primary classes',
      itemsRequired: '100 textbooks',
      quantityNeeded: '100',
      location: 'Rohini, New Delhi',
      preferredContributionType: 'Books',
      acceptsCourier: true,
      contactInfo: '+91 9876543210',
      status: 'Accepting',
      urgency: 'Immediate',
    });

    expect(need.id).toBeDefined();
    expect(need.title).toBe('School Books Needed');
    expect(need.status).toBe('Accepting');

    // 2. Fetch Needs
    const allNeeds = await NgoPublishStore.getNeeds(testNgoId);
    expect(allNeeds.length).toBe(1);
    expect(allNeeds[0].title).toBe('School Books Needed');

    // 3. Edit Need
    const updated = await NgoPublishStore.updateNeed(testNgoId, need.id, {
      quantityNeeded: '150',
      description: 'Updated requirement description',
    });
    expect(updated?.quantityNeeded).toBe('150');

    // 4. Pause Need
    const paused = await NgoPublishStore.updateNeed(testNgoId, need.id, {
      status: 'Paused',
    });
    expect(paused?.status).toBe('Paused');

    // 5. Fulfill Need
    const fulfilled = await NgoPublishStore.updateNeed(testNgoId, need.id, {
      status: 'Fulfilled',
    });
    expect(fulfilled?.status).toBe('Fulfilled');
  });

  it('allows an NGO to create, publish, and complete campaigns', async () => {
    const campaign = await NgoPublishStore.createCampaign(testNgoId, testNgoName, {
      title: 'Back to School Drive',
      description: 'Equipping underprivileged students with study kits',
      cause: 'Education',
      objective: 'Support 200 children with school kits',
      donationTypesAccepted: ['Books', 'Stationery', 'Money'],
      location: 'Central Delhi',
      startDate: '2026-09-20',
      endDate: '2026-10-20',
      targetUnits: '200 Kits',
      contact: 'info@testtrust.org',
      status: 'Active',
    });

    expect(campaign.id).toBeDefined();
    expect(campaign.status).toBe('Active');

    const campaigns = await NgoPublishStore.getCampaigns(testNgoId);
    expect(campaigns.length).toBe(1);
    expect(campaigns[0].title).toBe('Back to School Drive');

    // Update to Completed
    const completed = await NgoPublishStore.updateCampaign(testNgoId, campaign.id, {
      status: 'Completed',
    });
    expect(completed?.status).toBe('Completed');
  });

  it('allows an NGO to create and manage community events', async () => {
    const event = await NgoPublishStore.createEvent(testNgoId, testNgoName, {
      title: 'Community Book Collection Day',
      description: 'Drop off gently used textbooks and stationery',
      date: '2026-10-05',
      startTime: '10:00 AM',
      endTime: '04:00 PM',
      location: 'Community Hall, Sector 12, Dwarka',
      eventType: 'Donation Drive',
      participationType: 'Open to All',
      contactInfo: '+91 9876543210',
      status: 'Active',
    });

    expect(event.id).toBeDefined();
    expect(event.title).toBe('Community Book Collection Day');

    const events = await NgoPublishStore.getEvents(testNgoId);
    expect(events.length).toBe(1);
  });

  it('allows an NGO to create and publish volunteer opportunities', async () => {
    const volunteerOp = await NgoPublishStore.createVolunteerOp(testNgoId, testNgoName, {
      title: 'Weekend Teaching Volunteer',
      description: 'Teach basic mathematics and science',
      requiredSkills: ['Teaching', 'Mathematics'],
      cause: 'Education',
      location: 'South Delhi Centre',
      dateTime: 'Saturdays, 10:00 AM - 01:00 PM',
      duration: '2 months',
      volunteersRequired: 4,
      opportunityType: 'Recurring',
      contact: 'volunteer@testtrust.org',
      status: 'Active',
    });

    expect(volunteerOp.id).toBeDefined();
    expect(volunteerOp.requiredSkills).toContain('Teaching');

    const ops = await NgoPublishStore.getVolunteerOps(testNgoId);
    expect(ops.length).toBe(1);
  });

  it('allows an NGO to save public profile with accepted donations and services provided', async () => {
    const profile = await NgoPublishStore.saveProfile(testNgoId, testNgoName, {
      about: 'Transforming rural education through community empowerment.',
      primaryCause: 'Education',
      additionalCauses: ['Children', 'Women & Girls'],
      address: 'Plot 42, Vasant Kunj',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110070',
      contactPerson: 'Sunita Mehra',
      phone: '+91 9876543210',
      email: 'contact@testtrust.org',
      acceptedDonationTypes: ['Books', 'Stationery', 'Clothes'],
      servicesProvided: ['Education support', 'Women support'],
    });

    expect(profile.primaryCause).toBe('Education');
    expect(profile.acceptedDonationTypes).toContain('Books');
    expect(profile.servicesProvided).toContain('Education support');

    const fetched = await NgoPublishStore.getProfile(testNgoId);
    expect(fetched?.email).toBe('contact@testtrust.org');
    expect(fetched?.servicesProvided).toContain('Education support');
  });

  it('calculates overview metrics dynamically based on published items', async () => {
    await NgoPublishStore.createNeed(testNgoId, testNgoName, {
      title: 'Need 1',
      category: 'Books',
      description: 'Need description',
      itemsRequired: 'Items',
      location: 'Delhi',
      preferredContributionType: 'Books',
      acceptsCourier: false,
      contactInfo: '123',
      status: 'Accepting',
      urgency: 'Regular',
    });

    await NgoPublishStore.createCampaign(testNgoId, testNgoName, {
      title: 'Camp 1',
      description: 'Desc',
      cause: 'Education',
      objective: 'Obj',
      donationTypesAccepted: ['Books'],
      location: 'Delhi',
      startDate: '2026-09-01',
      endDate: '2026-10-01',
      contact: '123',
      status: 'Active',
    });

    const metrics = await NgoPublishStore.getOverviewMetrics(testNgoId);
    expect(metrics.activeNeedsCount).toBe(1);
    expect(metrics.activeCampaignsCount).toBe(1);
    expect(metrics.upcomingEventsCount).toBe(0);
  });
});
