import type { NgoUser } from '@/types/auth';
import type { Scheme, SchemeMatchEvaluation, CriterionMatchResult } from '@/types/ngo';

/**
 * Deterministic and explainable scheme matching evaluator.
 * Compares an NGO's registered profile against a scheme's criteria without AI/LLMs.
 */
export function evaluateSchemeEligibility(
  ngoUser: NgoUser | null,
  scheme: Scheme
): SchemeMatchEvaluation {
  const criteriaResults: CriterionMatchResult[] = [];
  const matchReasons: string[] = [];
  let score = 0;

  const userSector = (ngoUser?.focusSector || '').toLowerCase();
  const schemeSector = scheme.sector.toLowerCase();
  const userState = (ngoUser?.state || '').trim();

  // 1. Sector Alignment (Weight: 40)
  const isSectorMatch =
    Boolean(userSector) &&
    (userSector.includes(schemeSector) ||
      schemeSector.includes(userSector) ||
      (userSector.includes('rural') && schemeSector.includes('rural')) ||
      (userSector.includes('education') && schemeSector.includes('education')) ||
      (userSector.includes('health') && schemeSector.includes('health')) ||
      (userSector.includes('women') && schemeSector.includes('women')));

  if (isSectorMatch) {
    score += 40;
    matchReasons.push(`Sector match: Your NGO focuses on ${ngoUser?.focusSector}`);
    criteriaResults.push({
      criterionId: 'sector-match',
      label: 'Focus Sector Alignment',
      status: 'matched',
      explanation: `✓ Your NGO operates in "${ngoUser?.focusSector}", which directly aligns with ${scheme.sector}.`,
    });
  } else if (!userSector) {
    criteriaResults.push({
      criterionId: 'sector-match',
      label: 'Focus Sector Alignment',
      status: 'unclear',
      explanation: `? Profile incomplete: No primary focus sector set in your profile.`,
    });
  } else {
    criteriaResults.push({
      criterionId: 'sector-match',
      label: 'Focus Sector Alignment',
      status: 'needs_attention',
      explanation: `⚠ Sector difference: Scheme is designated for "${scheme.sector}", while your profile lists "${ngoUser?.focusSector}".`,
    });
  }

  // 2. Geographic / Location Alignment (Weight: 35)
  const isAllIndia = scheme.applicableStates.some((s) => s.toLowerCase() === 'all india');
  const isStateMatch = Boolean(userState) && scheme.applicableStates.some((s) => s.toLowerCase() === userState.toLowerCase());

  if (isAllIndia) {
    score += 35;
    matchReasons.push('Location: Covers All India');
    criteriaResults.push({
      criterionId: 'location-match',
      label: 'Geographic Scope',
      status: 'matched',
      explanation: `✓ Pan-India Scheme: Open to grassroots organizations operating anywhere in India.`,
    });
  } else if (isStateMatch) {
    score += 35;
    matchReasons.push(`Location match: Operates in ${userState}`);
    criteriaResults.push({
      criterionId: 'location-match',
      label: 'Geographic Scope',
      status: 'matched',
      explanation: `✓ State covered: Your operating state (${userState}) is included in this grant's target list.`,
    });
  } else if (!userState) {
    criteriaResults.push({
      criterionId: 'location-match',
      label: 'Geographic Scope',
      status: 'unclear',
      explanation: `? Operating state not specified in your profile. Scheme applies to: ${scheme.applicableStates.join(', ')}.`,
    });
  } else {
    criteriaResults.push({
      criterionId: 'location-match',
      label: 'Geographic Scope',
      status: 'needs_attention',
      explanation: `⚠ Geographic restriction: Scheme currently restricted to ${scheme.applicableStates.join(', ')}.`,
    });
  }

  // 3. NGO Darpan Registration (Weight: 25)
  const hasDarpan = Boolean(ngoUser?.registrationNumber && ngoUser.registrationNumber.trim().length > 0);

  if (hasDarpan) {
    score += 25;
    matchReasons.push('Darpan ID verified');
    criteriaResults.push({
      criterionId: 'darpan-match',
      label: 'NGO Darpan ID Requirement',
      status: 'matched',
      explanation: `✓ Darpan ID on record (${ngoUser?.registrationNumber}). Meets central statutory mandate.`,
    });
  } else {
    criteriaResults.push({
      criterionId: 'darpan-match',
      label: 'NGO Darpan ID Requirement',
      status: 'unclear',
      explanation: `? Darpan ID missing: Add your registration number in your profile to fulfill compliance verification.`,
    });
  }

  // Additional Scheme-specific checks
  for (const crit of scheme.eligibilityCriteria) {
    if (crit.category === 'experience') {
      criteriaResults.push({
        criterionId: crit.id,
        label: crit.label,
        status: 'needs_attention',
        explanation: `ℹ️ Self-verification required: ${crit.requirementDescription}`,
      });
    } else if (crit.category === 'audit') {
      criteriaResults.push({
        criterionId: crit.id,
        label: crit.label,
        status: 'needs_attention',
        explanation: `ℹ️ Document check: ${crit.requirementDescription}`,
      });
    }
  }

  return {
    schemeId: scheme.id,
    overallScore: Math.min(score, 100),
    isRecommended: score >= 60,
    matchReasons,
    criteriaResults,
  };
}
