import { describe, it, expect } from 'vitest';
import { McaSection8Adapter } from '@/lib/government-sources/adapters/mca-adapter';
import { IncomeTaxAdapter } from '@/lib/government-sources/adapters/incometax-adapter';
import { NgoDarpanAdapter } from '@/lib/government-sources/adapters/ngodarpan-adapter';
import { FcraAdapter } from '@/lib/government-sources/adapters/fcra-adapter';
import { STATE_REGISTRIES_DATABASE } from '@/lib/government-sources/adapters/state-registry-adapter';
import { GuideStore } from '@/lib/government-sources/guide-store';
import type { RoadmapStep, TaxComplianceGuideItem, DocumentChecklistItem, GovernmentPortalItem } from '@/types/registration-guide';
import type { Scheme } from '@/types/ngo';

describe('Official Government Source Adapters & Attribution', () => {
  it('MCA Adapter provides official MCA Section 8 details with valid tier-1 source metadata', async () => {
    const result = await McaSection8Adapter.fetchAndNormalize();
    const data = result.data.comparison;

    expect(data.type).toBe('Section 8 Company');
    expect(data.governingAct).toContain('Companies Act, 2013');
    expect(data.registeringAuthority).toContain('Ministry of Corporate Affairs');
    expect(data.portalUrl).toContain('mca.gov.in');
    expect(data.officialSource.url).toContain('mca.gov.in');
    expect(data.officialSource.authority).toBe('Ministry of Corporate Affairs (MCA), Government of India');
    expect(data.officialSource.lastChecked).toBeDefined();

    // Check roadmap steps
    const roadmapSteps = result.data.centralGuide.steps;
    expect(roadmapSteps.length).toBeGreaterThanOrEqual(4);
    expect(roadmapSteps[0].title).toContain('DSC');
    expect(roadmapSteps.some((s: RoadmapStep) => s.title.includes('SPICe+ Part A'))).toBe(true);
    expect(roadmapSteps.some((s: RoadmapStep) => s.title.includes('SPICe+ Part B'))).toBe(true);
  });

  it('Income Tax Adapter provides Form 104 provisional and Form 105 regular procedures', async () => {
    const result = await IncomeTaxAdapter.fetchAndNormalize();
    const items = result.data.taxGuideItems;

    expect(items.length).toBeGreaterThanOrEqual(3);

    // Form 104 provisional check
    const item104 = items.find((i: TaxComplianceGuideItem) => i.id === 'tax_form_104_provisional');
    expect(item104).toBeDefined();
    expect(item104?.formName).toContain('Form 104');
    expect(item104?.timingAndValidity).toContain('3 assessment years');
    expect(item104?.officialSource.url).toContain('incometax.gov.in');

    // Form 105 regular check
    const item105 = items.find((i: TaxComplianceGuideItem) => i.id === 'tax_form_105_regular');
    expect(item105).toBeDefined();
    expect(item105?.formName).toContain('Form 105');
    expect(item105?.timingAndValidity).toContain('5 assessment years');

    // ITR-7 annual filing check
    const itemItr7 = items.find((i: TaxComplianceGuideItem) => i.id === 'tax_annual_filing_itr7');
    expect(itemItr7).toBeDefined();
    expect(itemItr7?.governingAct).toContain('Income Tax Act');
  });

  it('NGO Darpan Adapter provides NITI Aayog registration requirements', async () => {
    const result = await NgoDarpanAdapter.fetchAndNormalize();
    const data = result.data.darpanGuide;

    expect(data.portalUrl).toBe('https://ngodarpan.gov.in/');
    expect(data.officialSource.authority).toContain('NITI Aayog');
    expect(data.mandatoryInformation.some((info: string) => info.toLowerCase().includes('pan'))).toBe(true);
    expect(data.signupSteps.length).toBeGreaterThanOrEqual(4);
    expect(data.overview.simpleExplanation).toContain('NGO Darpan');
  });

  it('FCRA Adapter provides MHA foreign contribution prior permission (FC-3B) and 5-year registration (FC-3A)', async () => {
    const result = await FcraAdapter.fetchAndNormalize();
    const data = result.data.fcraGuide;

    expect(data.overview.officialDetails).toContain('Foreign Contribution (Regulation) Act, 2010');
    expect(data.officialSource.authority).toContain('Ministry of Home Affairs');
    expect(data.portalUrl).toBe('https://fcraonline.nic.in/');
    expect(data.registrationVsPriorPermission.priorPermission.simpleExplanation).toContain('Form FC-3B');
    expect(data.registrationVsPriorPermission.regularRegistration.simpleExplanation).toContain('Form FC-3A');
    expect(data.designatedBankRequirement).toContain('State Bank of India');
  });

  it('State Registry Adapter resolves authentic state portals for Delhi, Karnataka, Maharashtra', () => {
    // Karnataka
    const karnatakaBundle = STATE_REGISTRIES_DATABASE['Karnataka'];
    expect(karnatakaBundle.trustGuide.state).toBe('Karnataka');
    expect(karnatakaBundle.trustGuide.portalUrl).toContain('kaverionline.karnataka.gov.in');
    expect(karnatakaBundle.societyGuide.authorityName).toContain('Registrar of Societies');

    // Delhi
    const delhiBundle = STATE_REGISTRIES_DATABASE['Delhi'];
    expect(delhiBundle.trustGuide.state).toBe('Delhi');
    expect(delhiBundle.societyGuide.portalUrl).toContain('edistrict.delhigovt.nic.in');

    // Maharashtra
    const maharashtraBundle = STATE_REGISTRIES_DATABASE['Maharashtra'];
    expect(maharashtraBundle.trustGuide.state).toBe('Maharashtra');
    expect(maharashtraBundle.trustGuide.authorityName).toContain('Office of the Charity Commissioner');
    expect(maharashtraBundle.trustGuide.portalUrl).toContain('charity.maharashtra.gov.in');
  });
});

describe('GuideStore Unified Resolution & Ingestion', () => {
  it('resolves comparisons with all 3 organisation types', async () => {
    const comparisons = await GuideStore.getOrganisationTypeComparisons('Delhi');
    expect(comparisons.length).toBe(3);
    const types = comparisons.map((c) => c.type);
    expect(types).toContain('Trust');
    expect(types).toContain('Society');
    expect(types).toContain('Section 8 Company');
  });

  it('resolves state roadmaps dynamically without fallback dummy data', async () => {
    const guide = await GuideStore.getStateRegistrationGuide('Karnataka', 'Society');
    expect(guide.state).toBe('Karnataka');
    expect(guide.organisationType).toBe('Society');
    expect(guide.steps.length).toBeGreaterThanOrEqual(3);
    expect(guide.portalUrl).toContain('karnataka.gov.in');
  });

  it('filters document checklist dynamically based on organisation type and state', async () => {
    const section8Docs = await GuideStore.getDocumentChecklist('Section 8 Company', 'Delhi');
    expect(section8Docs.some((d: DocumentChecklistItem) => d.name.includes('DSC'))).toBe(true);
    expect(section8Docs.some((d: DocumentChecklistItem) => d.name.includes('INC-13') || d.name.includes('SPICe+'))).toBe(true);

    const trustDocs = await GuideStore.getDocumentChecklist('Trust', 'Karnataka');
    expect(trustDocs.some((d: DocumentChecklistItem) => d.name.includes('Trust Deed'))).toBe(true);
  });

  it('discovers personalized schemes based on state and sector matching', () => {
    const schemes = GuideStore.getPersonalizedSchemes('Delhi', 'Education');
    expect(schemes.length).toBeGreaterThan(0);
    expect(schemes.some((s: Scheme) => s.sector === 'Education')).toBe(true);
  });

  it('provides comprehensive portals directory categorized by purpose', async () => {
    const portals = await GuideStore.getGovernmentPortals();
    expect(portals.length).toBeGreaterThanOrEqual(7);
    const categories = new Set(portals.map((p: GovernmentPortalItem) => p.category));
    expect(categories.has('Entity Registration')).toBe(true);
    expect(categories.has('Tax & Exemptions')).toBe(true);
    expect(categories.has('Civic Partnership')).toBe(true);
    expect(categories.has('Foreign Contribution')).toBe(true);
  });
});
