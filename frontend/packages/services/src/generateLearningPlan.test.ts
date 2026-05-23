import { describe, expect, it } from 'vitest';
import { generateTeacherLearningPlan } from './generateLearningPlan';

describe('generateTeacherLearningPlan', () => {
  it('creates a learning plan from membership, entitlement and LearnDash adapter data', async () => {
    const plan = await generateTeacherLearningPlan();

    expect(plan.contactName).toBe('Ava Martin');
    expect(plan.organisationName).toBe('Good to Great Schools Australia');
    expect(plan.productName).toBe('Teacher Learning Plan');
    expect(plan.integrationType).toBe(
      'Generated from Membership, WooCommerce and LearnDash adapter context',
    );
    expect(plan.controlChecks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'prerequisites',
          status: 'Needs evidence',
        }),
        expect.objectContaining({
          id: 'core-modules',
          status: 'Needs evidence',
        }),
      ]),
    );
  });
});
