import { describe, expect, it } from 'vitest';
import { blankSubmission } from './domain';
import { calculateReadinessScore, getOutstandingCategories } from './readiness';

describe('teacher pathway readiness', () => {
  it('calculates readiness from completed controls', () => {
    const submission = {
      ...blankSubmission,
      controlChecks: blankSubmission.controlChecks.map((check, index) => ({
        ...check,
        status: index < 2 ? 'Complete' : check.status,
      })),
    };

    expect(calculateReadinessScore(submission)).toBe(50);
  });

  it('returns unique outstanding control categories', () => {
    expect(getOutstandingCategories(blankSubmission.controlChecks)).toEqual([
      'Prerequisites',
      'Core modules',
      'Evidence portfolio',
      'Certification',
    ]);
  });
});
