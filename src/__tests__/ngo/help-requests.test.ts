import { describe, it, expect, beforeEach } from 'vitest';
import { Database } from '@/lib/db/database';
import { NgoPublishStore } from '@/lib/db/ngo-publish-store';

describe('Citizen Help Requests Lifecycle & NGO Coordination', () => {
  const citizenUserId = 'usr_citizen_test_01';
  const targetNgoId = 'ngo_test_01';

  beforeEach(() => {
    Database.getInstance().reset();
  });

  it('allows a citizen to submit a help request that routes directly to the matching NGO', async () => {
    // 1. Citizen creates help request
    const request = await NgoPublishStore.createHelpRequest(citizenUserId, {
      citizenName: 'Pooja Verma',
      citizenPhone: '+91 9123456780',
      citizenEmail: 'pooja@test.org',
      ngoId: targetNgoId,
      ngoName: 'Gram Vikas Seva Sansthan',
      category: 'Education support',
      needTitle: 'School books and stationery for 2 children',
      needDescription: 'NCERT Class 7 & 9 books required for the upcoming semester',
      itemsRequested: 'NCERT textbooks, 4 register notebooks',
      location: 'Najafgarh, New Delhi',
      urgency: 'Within a week',
    });

    expect(request.id).toBeDefined();
    expect(request.status).toBe('New');

    // 2. NGO retrieves incoming requests
    const incomingRequests = await NgoPublishStore.getIncomingHelpRequests(targetNgoId);
    expect(incomingRequests.length).toBe(1);
    expect(incomingRequests[0].needTitle).toBe('School books and stationery for 2 children');
    expect(incomingRequests[0].citizenName).toBe('Pooja Verma');

    // 3. NGO responds to request (Accepts and adds coordination notes)
    const acceptedRequest = await NgoPublishStore.updateHelpRequestStatus(
      targetNgoId,
      request.id,
      'Accepted',
      'Called citizen. Textbooks will be dispatched via local volunteer on Saturday.'
    );

    expect(acceptedRequest?.status).toBe('Accepted');
    expect(acceptedRequest?.ngoNotes).toContain('dispatched via local volunteer');

    // 4. Citizen checks request status
    const citizenRequests = await NgoPublishStore.getUserHelpRequests(citizenUserId);
    expect(citizenRequests.length).toBe(1);
    expect(citizenRequests[0].status).toBe('Accepted');
    expect(citizenRequests[0].ngoNotes).toBe(
      'Called citizen. Textbooks will be dispatched via local volunteer on Saturday.'
    );

    // 5. NGO marks request resolved
    const resolvedRequest = await NgoPublishStore.updateHelpRequestStatus(
      targetNgoId,
      request.id,
      'Resolved',
      'Materials delivered successfully.'
    );
    expect(resolvedRequest?.status).toBe('Resolved');
  });
});
