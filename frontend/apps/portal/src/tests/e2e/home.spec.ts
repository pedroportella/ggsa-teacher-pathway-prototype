import { expect, test } from '@playwright/test';

test('loads the GGSA teacher pathway portal dashboard', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /Teacher pathway register/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Learning plan register' })).toBeVisible();
  await expect(page.getByText('Cairns West State School')).toBeVisible();
});

test('captures a teacher pathway submission into the register', async ({ page }) => {
  await page.goto('/learning-plan');

  await page.getByRole('button', { name: 'Attach sample evidence' }).click();
  await page.getByRole('button', { name: 'Submit to pathway register' }).click();

  await expect(page.getByText(/Teacher learning plan captured locally|Teacher learning plan sent/)).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Good to Great Schools Australia' })).toBeVisible();
});
