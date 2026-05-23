import { expect, test, type Locator, type Page } from '@playwright/test';

const routes = ['/', '/learning-plan', '/pathway-readiness', '/about'];

async function mockRegisterApiWhenNeeded(page: Page) {
  if (process.env.E2E_USE_MOCK === 'false') return;

  await page.route('**/api/teacher-pathway-submissions', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        contentType: 'application/json',
        json: [
          {
            id: 'ggsa-tp-2026-014',
            referenceNumber: 'GGSA-TP-2026-014',
            organisationName: 'Accessibility Smoke School',
            productName: 'Teacher Learning Plan',
            workflowStatus: 'Learning plan draft',
            riskLevel: 'Medium',
            submittedAt: '2026-05-22T01:00:00+10:00',
          },
        ],
      });
      return;
    }

    await route.continue();
  });
}

async function pageAccessibilityIssues(page: Page) {
  return page.evaluate(() => {
    const issues: string[] = [];
    const accessibleName = (element: Element) => {
      const id = element.getAttribute('id');
      const labelledBy = element.getAttribute('aria-labelledby');
      const labelText = id
        ? Array.from(document.querySelectorAll(`label[for="${CSS.escape(id)}"]`))
            .map((label) => label.textContent?.trim())
            .filter(Boolean)
            .join(' ')
        : '';
      const labelledByText = labelledBy
        ? labelledBy
            .split(/\s+/)
            .map((labelId) => document.getElementById(labelId)?.textContent?.trim())
            .filter(Boolean)
            .join(' ')
        : '';

      return [
        element.getAttribute('aria-label'),
        labelledByText,
        labelText,
        element.getAttribute('title'),
        element.getAttribute('placeholder'),
        element.textContent?.trim(),
        element instanceof HTMLInputElement ? element.value : '',
      ]
        .filter(Boolean)
        .join(' ')
        .trim();
    };

    const requiredLandmarks = [
      ['banner', 'header[role="banner"], header'],
      ['main', 'main, [role="main"]'],
      ['contentinfo', 'footer, [role="contentinfo"]'],
      ['navigation', 'nav, [role="navigation"]'],
    ] as const;

    requiredLandmarks.forEach(([name, selector]) => {
      if (!document.querySelector(selector)) {
        issues.push(`Missing ${name} landmark`);
      }
    });

    const h1Count = document.querySelectorAll('h1').length;
    if (h1Count !== 1) {
      issues.push(`Expected exactly one h1, found ${h1Count}`);
    }

    document.querySelectorAll('img').forEach((image) => {
      if (!image.hasAttribute('alt')) {
        issues.push(`Image missing alt text: ${image.getAttribute('src') ?? 'unknown src'}`);
      }
    });

    document.querySelectorAll('input, select, textarea').forEach((control) => {
      const type = control.getAttribute('type');
      if (type === 'hidden') return;
      if (type === 'submit' || type === 'button') return;

      if (!accessibleName(control)) {
        issues.push(`Form control missing accessible name: ${control.outerHTML.slice(0, 80)}`);
      }
    });

    document.querySelectorAll('button, a[href], [role="button"]').forEach((control) => {
      if (!accessibleName(control)) {
        issues.push(
          `Interactive control missing accessible name: ${control.outerHTML.slice(0, 80)}`,
        );
      }
    });

    document.querySelectorAll('ul > a[href], ol > a[href]').forEach((link) => {
      issues.push(`List link must be wrapped in li: ${link.outerHTML.slice(0, 80)}`);
    });

    document.querySelectorAll('.au-skip-link__link[href^="#"]').forEach((link) => {
      const targetId = link.getAttribute('href')?.slice(1);
      if (targetId && !document.getElementById(targetId)) {
        issues.push(`Skip link target missing: #${targetId}`);
      }
    });

    const ids = new Set<string>();
    document.querySelectorAll('[id]').forEach((element) => {
      const id = element.id;
      if (ids.has(id)) {
        issues.push(`Duplicate id: ${id}`);
      }
      ids.add(id);
    });

    return issues;
  });
}

async function expectReachableByTab(page: Page, locator: Locator, label: string) {
  await expect(locator, `${label} should exist before keyboard traversal`).toHaveCount(1);

  for (let index = 0; index < 40; index += 1) {
    await page.keyboard.press('Tab');
    const isFocused = await locator.evaluate((element) => document.activeElement === element);

    if (isFocused) return;
  }

  throw new Error(`${label} was not reachable by keyboard tab order.`);
}

type RgbColour = {
  b: number;
  g: number;
  r: number;
};

function parseColour(value: string): RgbColour {
  const colour = value.trim();
  const hexMatch = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(colour);

  if (hexMatch) {
    const hex =
      hexMatch[1].length === 3
        ? hexMatch[1]
            .split('')
            .map((channel) => channel + channel)
            .join('')
        : hexMatch[1];

    return {
      b: Number.parseInt(hex.slice(4, 6), 16),
      g: Number.parseInt(hex.slice(2, 4), 16),
      r: Number.parseInt(hex.slice(0, 2), 16),
    };
  }

  const rgbMatch = /^rgba?\((\d+),\s*(\d+),\s*(\d+)/i.exec(colour);

  if (rgbMatch) {
    return {
      b: Number.parseInt(rgbMatch[3], 10),
      g: Number.parseInt(rgbMatch[2], 10),
      r: Number.parseInt(rgbMatch[1], 10),
    };
  }

  throw new Error(`Unsupported colour format: ${value}`);
}

function channelLuminance(channel: number) {
  const scaled = channel / 255;
  return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(colour: RgbColour) {
  return (
    0.2126 * channelLuminance(colour.r) +
    0.7152 * channelLuminance(colour.g) +
    0.0722 * channelLuminance(colour.b)
  );
}

function contrastRatio(foreground: string, background: string) {
  const lighter = Math.max(
    relativeLuminance(parseColour(foreground)),
    relativeLuminance(parseColour(background)),
  );
  const darker = Math.min(
    relativeLuminance(parseColour(foreground)),
    relativeLuminance(parseColour(background)),
  );

  return (lighter + 0.05) / (darker + 0.05);
}

test.describe('accessibility and UX quality gates', () => {
  for (const route of routes) {
    test(`has accessible structure and metadata for ${route}`, async ({ page }) => {
      await mockRegisterApiWhenNeeded(page);
      await page.goto(route);

      await expect(page).toHaveTitle(/GGSA Teacher Pathway/);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        'content',
        /Headless WordPress and Next\.js teacher pathway portal/,
      );
      await expect(page.locator('main')).toHaveCount(1);

      const issues = await pageAccessibilityIssues(page);
      expect(issues).toEqual([]);
    });
  }

  test('uses accessible colour contrast tokens', async ({ page }) => {
    await mockRegisterApiWhenNeeded(page);
    await page.goto('/');

    const colours = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      const resolveToken = (value: string) => {
        let resolved = value.trim();

        for (let index = 0; index < 8; index += 1) {
          const token = /^var\((--[^,)]+)(?:,[^)]+)?\)$/.exec(resolved);
          if (!token) return resolved;
          resolved = styles.getPropertyValue(token[1]).trim();
        }

        return resolved;
      };
      const token = (name: string) => resolveToken(styles.getPropertyValue(name));

      return {
        info: token('--adha-hds-info'),
        panel: token('--adha-hds-surface-panel'),
        subheaderGradientEnd: token('--subheader-gradient-bg--end'),
        subheaderText: token('--subheader-text'),
        surface: token('--adha-hds-surface'),
        warningText: token('--adha-hds-warning-text'),
      };
    });

    expect(contrastRatio(colours.warningText, colours.surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(colours.info, colours.panel)).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(colours.subheaderText, colours.subheaderGradientEnd),
    ).toBeGreaterThanOrEqual(4.5);
  });

  async function expectHoverContrast(locator: Locator) {
    await locator.hover();

    const colours = await locator.evaluate((element) => {
      const styles = getComputedStyle(element);
      return {
        background: styles.backgroundColor,
        foreground: styles.color,
      };
    });

    expect(contrastRatio(colours.foreground, colours.background)).toBeGreaterThanOrEqual(4.5);
  }

  async function expectElementContrast(locator: Locator, backgroundLocator?: Locator) {
    const colours = await locator.evaluate((element, hasBackgroundLocator) => {
      const styles = getComputedStyle(element);
      const backgroundElement = hasBackgroundLocator
        ? element.closest('.au-footer, .health-sub-header--dark')
        : element;
      const backgroundStyles = getComputedStyle(backgroundElement ?? element);

      return {
        background: backgroundStyles.backgroundColor,
        foreground: styles.color,
      };
    }, Boolean(backgroundLocator));

    expect(contrastRatio(colours.foreground, colours.background)).toBeGreaterThanOrEqual(4.5);
  }

  test('keeps secondary button hover contrast accessible', async ({ page }) => {
    await mockRegisterApiWhenNeeded(page);
    await page.goto('/');

    const footerButton = page.locator('.au-footer__navigation-section .au-btn--secondary').first();

    await expectElementContrast(footerButton, page.locator('.au-footer'));
    await expectHoverContrast(page.getByRole('button', { name: 'Refresh register' }));
    await expectHoverContrast(footerButton);
  });

  test('supports keyboard access through the learning plan evidence workflow', async ({ page }) => {
    await mockRegisterApiWhenNeeded(page);
    await page.goto('/learning-plan');

    const skipLink = page.getByRole('link', { name: 'Skip to main content' });
    await page.keyboard.press('Tab');
    await expect(skipLink).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main-content$/);

    await expectReachableByTab(page, page.getByLabel('Evidence category'), 'Evidence category');
    await page.getByLabel('Evidence category').selectOption('Classroom artefact');

    await expectReachableByTab(page, page.getByLabel('Evidence file'), 'Evidence file');
    await expectReachableByTab(
      page,
      page.getByRole('button', { name: 'Sync to pathway register' }),
      'Sync button',
    );
  });

  test('supports keyboard access to readiness controls', async ({ page }) => {
    await mockRegisterApiWhenNeeded(page);
    await page.goto('/pathway-readiness');

    await expectReachableByTab(page, page.getByLabel(/Prerequisites:/), 'Readiness status select');
  });
});
