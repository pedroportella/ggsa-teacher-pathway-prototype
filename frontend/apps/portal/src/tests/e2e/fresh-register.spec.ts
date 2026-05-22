import { expect, test } from '@playwright/test';
import { generateRandomLearningPlan } from './utils/registerData';

test.skip(process.env.E2E_USE_MOCK !== 'false', 'Fresh register persistence test requires the real WordPress backend.');

test('loads refreshed seed data, creates a random record, and finds it after reloads', async ({ page }) => {
  const record = generateRandomLearningPlan();

  await page.goto('/register');

  await expect(page.getByRole('cell', { name: 'Cairns West State School' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Cape York Academy' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'St Marys Catholic School' })).toBeVisible();

  await page.goto('/learning-plan');
  await page.getByLabel('School or organisation').fill(record.organisationName);
  await page.getByLabel('Teacher or coordinator name').fill(record.contactName);
  await page.getByLabel('Contact email').fill(record.contactEmail);
  await page.getByLabel('Learning plan').fill(record.productName);
  await page.getByLabel('Cohort or intake').fill(record.productVersion);
  await page.getByLabel('Teacher course by career stage').selectOption(record.pathwayProfile);
  await page.getByLabel('Platform integration').fill(record.integrationType);
  await page.getByLabel('Pathway status').selectOption(record.workflowStatus);
  await page.getByLabel('Target commencement').fill(record.targetReleaseDate);
  await page.getByRole('button', { name: 'Attach sample evidence' }).click();
  await page.getByRole('button', { name: 'Submit to pathway register' }).click();

  await expect(page.getByText('Teacher learning plan sent to the WordPress pathway register.')).toBeVisible();
  await expect(page.getByRole('cell', { name: record.organisationName })).toBeVisible();

  await page.reload();
  await expect(page.getByRole('cell', { name: record.organisationName })).toBeVisible();

  await page.goto('/about');
  await page.goto('/register');
  await expect(page.getByRole('cell', { name: record.organisationName })).toBeVisible();
  await expect(page.getByRole('cell', { name: record.productName })).toBeVisible();
});
