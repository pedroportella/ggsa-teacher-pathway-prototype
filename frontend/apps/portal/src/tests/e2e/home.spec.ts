import { expect, test } from '@playwright/test';

test('loads the GGSA teacher pathway portal dashboard', async ({ page }) => {
  let releaseRegisterApi: (() => void) | undefined;
  let markRegisterApiRequested: (() => void) | undefined;
  const registerApiRequested = new Promise<void>((resolve) => {
    markRegisterApiRequested = resolve;
  });

  await page.route('**/api/teacher-pathway-submissions', async (route) => {
    markRegisterApiRequested?.();

    await new Promise<void>((resolve) => {
      releaseRegisterApi = resolve;
    });

    await route.fulfill({
      contentType: 'application/json',
      json: [
        {
          id: 'ggsa-tp-2026-014',
          referenceNumber: 'GGSA-TP-2026-014',
          organisationName: 'Services Boundary Smoke School',
          productName: 'Teacher Learning Plan',
          workflowStatus: 'Learning plan draft',
          riskLevel: 'Medium',
          submittedAt: '2026-05-22T01:00:00+10:00',
        },
      ],
    });
  });

  await page.goto('/');

  await expect(page.getByRole('heading', { name: /Teacher pathway register/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Learning plan register' })).toBeVisible();
  await expect(page.getByRole('status', { name: 'Loading learning plan register' })).toBeVisible();
  await expect(page.getByText('Cairns West State School')).toBeHidden();

  await registerApiRequested;
  releaseRegisterApi?.();

  await expect(page.getByRole('cell', { name: 'Services Boundary Smoke School' })).toBeVisible();
});

test('captures a teacher pathway submission into the register', async ({ page }) => {
  await page.goto('/learning-plan');

  await page.getByRole('button', { name: 'Attach sample evidence' }).click();
  await page.getByRole('button', { name: 'Submit to pathway register' }).click();

  await expect(page.getByText(/Teacher learning plan captured locally|Teacher learning plan sent/)).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Good to Great Schools Australia' })).toBeVisible();
});
