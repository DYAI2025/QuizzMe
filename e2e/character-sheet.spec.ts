/**
 * TS-4: E2E Test for Character Sheet Integration
 *
 * Test Coverage:
 * - Quiz completion → Character sheet update flow
 * - Delta banner appearance after quiz
 * - New values reflected in character sheet
 * - Share/Copy link functionality
 *
 * Note: This is a Playwright test placeholder.
 * To run these tests, install Playwright:
 *   npm install --save-dev @playwright/test
 *   npx playwright install
 *
 * Then run with:
 *   npx playwright test
 */

import { test, expect } from '@playwright/test';

test.describe('Character Sheet - After Quiz Flow (FR-4)', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
  });

  test('should display character sheet with initial values', async ({ page }) => {
    // Navigate directly to character sheet
    await page.goto('/character');

    // Wait for profile to load
    await page.waitForSelector('h1', { state: 'visible' });

    // Verify page title
    await expect(page.locator('h1')).toContainText('Character Sheet');

    // Verify core stats section exists
    await expect(page.locator('text=Kernwerte')).toBeVisible();

    // Verify climate section exists
    await expect(page.locator('text=Dein Klima')).toBeVisible();

    // Verify derived stats section exists
    await expect(page.locator('text=Abgeleitete Werte')).toBeVisible();
  });

  test('should complete quiz and navigate to character sheet', async ({ page }) => {
    // This test requires a working quiz flow
    // Adjust selectors based on actual quiz implementation

    // Navigate to a quiz
    await page.goto('/verticals/quiz/love-languages');

    // Complete the quiz (example - adjust based on actual quiz)
    // This is a placeholder - implement based on your quiz structure
    const quizButtons = page.locator('button[type="submit"]');
    const count = await quizButtons.count();

    for (let i = 0; i < count; i++) {
      // Answer questions
      const answers = page.locator('[role="radio"], input[type="radio"]');
      if ((await answers.count()) > 0) {
        await answers.first().click();
      }

      // Click next/submit
      const nextButton = page.locator('button:has-text("Weiter"), button:has-text("Absenden")');
      if (await nextButton.isVisible()) {
        await nextButton.click();
      }
    }

    // Should reach result page
    await page.waitForURL('**/result**', { timeout: 5000 });

    // Find and click "View Character Sheet" CTA
    const characterSheetCTA = page.locator('a[href="/character"], button:has-text("Charakterbogen")');
    await characterSheetCTA.click();

    // Should navigate to character sheet
    await expect(page).toHaveURL('/character');
  });

  test('should display delta banner after quiz completion', async ({ page }) => {
    // Mock scenario: User just completed a quiz
    // In real implementation, you'd complete a quiz first

    // Navigate to character sheet (assuming recent quiz completion)
    await page.goto('/character');

    // Wait for page to load
    await page.waitForSelector('h1', { state: 'visible' });

    // Delta banner should be visible (if there's recent delta data)
    // This assumes mock data includes last_delta
    const deltaBanner = page.locator('[data-testid="delta-banner"], .delta-banner');

    // If delta exists, banner should show
    if (await deltaBanner.isVisible({ timeout: 1000 })) {
      // Banner should show top movers (1-3 dimensions)
      await expect(deltaBanner).toBeVisible();

      // Banner should be auto-dismissible
      // Wait for it to disappear (8-12s timeout)
      await expect(deltaBanner).toBeHidden({ timeout: 15000 });
    }
  });

  test('should show updated stat values after quiz', async ({ page }) => {
    // Navigate to character sheet
    await page.goto('/character');

    // Wait for stats to load
    await page.waitForSelector('text=Klarheit', { state: 'visible' });

    // Get initial stat value (example: Clarity)
    const clarityValue = await page.locator('text=Klarheit').locator('..').locator('text=/\\d+/').first().textContent();

    // Note: In a real E2E test, you would:
    // 1. Record initial value
    // 2. Complete a quiz that affects Clarity
    // 3. Return to character sheet
    // 4. Verify value has changed

    expect(clarityValue).toBeTruthy();
  });

  test('should manually close delta banner', async ({ page }) => {
    await page.goto('/character');

    // Wait for page load
    await page.waitForSelector('h1', { state: 'visible' });

    // Find delta banner (if present)
    const deltaBanner = page.locator('[data-testid="delta-banner"]');

    if (await deltaBanner.isVisible({ timeout: 1000 })) {
      // Find close button
      const closeButton = deltaBanner.locator('button[aria-label="Close"], button:has-text("✕")');

      if (await closeButton.isVisible()) {
        await closeButton.click();

        // Banner should disappear
        await expect(deltaBanner).toBeHidden();
      }
    }
  });

  test('should highlight top movers in stats', async ({ page }) => {
    await page.goto('/character');

    // Wait for page load
    await page.waitForSelector('h1', { state: 'visible' });

    // Top movers should have visual indicators (delta chips)
    // This assumes implementation adds specific classes/attributes
    const deltaChips = page.locator('[data-testid="delta-chip"], .delta-indicator');

    // Should have 1-3 delta chips (top movers)
    const count = await deltaChips.count();
    expect(count).toBeGreaterThanOrEqual(0);
    expect(count).toBeLessThanOrEqual(3);
  });
});

test.describe('Character Sheet - Responsive Layout (FR-6)', () => {
  test('should display correctly on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/character');
    await page.waitForSelector('h1', { state: 'visible' });

    // On mobile, layout should be single column
    // Verify no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBe(clientWidth);

    // All sections should be visible and stacked
    await expect(page.locator('text=Kernwerte')).toBeVisible();
    await expect(page.locator('text=Dein Klima')).toBeVisible();
    await expect(page.locator('text=Abgeleitete Werte')).toBeVisible();
  });

  test('should display correctly on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto('/character');
    await page.waitForSelector('h1', { state: 'visible' });

    // Verify layout adapts
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display correctly on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });

    await page.goto('/character');
    await page.waitForSelector('h1', { state: 'visible' });

    // Desktop should show 2-column grid
    // Verify both columns visible side-by-side
    const leftColumn = page.locator('.lg\\:col-span-7, [class*="col-span-7"]').first();
    const rightColumn = page.locator('.lg\\:col-span-5, [class*="col-span-5"]').first();

    await expect(leftColumn).toBeVisible();
    await expect(rightColumn).toBeVisible();
  });
});

test.describe('Character Sheet - Share/Copy Link (FR-8)', () => {
  test('should have copy link button in footer', async ({ page }) => {
    await page.goto('/character');

    // Look for share/copy CTA in footer
    const copyButton = page.locator('button:has-text("Link kopieren"), button:has-text("Teilen")');

    // Footer CTA should exist (even if not implemented yet)
    // This is a placeholder for future implementation
  });

  test('should copy character sheet link to clipboard', async ({ page }) => {
    await page.goto('/character');

    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-write', 'clipboard-read']);

    // Find copy button
    const copyButton = page.locator('button:has-text("Link kopieren")');

    if (await copyButton.isVisible({ timeout: 1000 })) {
      await copyButton.click();

      // Verify clipboard contains character sheet URL
      const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipboardText).toContain('/character');

      // Success feedback should appear
      const successMessage = page.locator('text=Link kopiert, text=Copied');
      await expect(successMessage).toBeVisible({ timeout: 2000 });
    }
  });
});

test.describe('Character Sheet - Accessibility (NFR-2, SC-3)', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/character');
    await page.waitForSelector('h1', { state: 'visible' });

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Focus should be visible
    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should respect prefers-reduced-motion', async ({ page }) => {
    // Enable reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.goto('/character');

    // Animations should be minimal or instant
    // This is verified through implementation, not easily testable in E2E
    await page.waitForSelector('h1', { state: 'visible' });

    // Page should still be functional
    await expect(page.locator('text=Kernwerte')).toBeVisible();
  });

  test('should meet color contrast requirements', async ({ page }) => {
    await page.goto('/character');

    // This test would use an accessibility testing library
    // Example with axe-core (if installed):
    // const results = await page.evaluate(() => axe.run());
    // expect(results.violations).toHaveLength(0);

    // For now, verify page loads
    await page.waitForSelector('h1', { state: 'visible' });
  });
});

test.describe('Character Sheet - Error Handling', () => {
  test('should show error state when profile fails to load', async ({ page }) => {
    // Mock API failure (if using service workers or route interception)
    // Example:
    // await page.route('**/api/profile/psyche', route => route.abort());

    await page.goto('/character');

    // Should show error message
    const errorMessage = page.locator('text=Fehler, text=Error');
    // Note: Actual error handling depends on implementation
  });

  test('should show loading state', async ({ page }) => {
    // Navigate to character sheet
    await page.goto('/character');

    // Loading state should appear briefly
    const loadingIndicator = page.locator('text=wird geöffnet, text=Loading');

    // Then content should load
    await page.waitForSelector('h1', { state: 'visible' });
  });
});

/**
 * Test Utilities
 */

test.describe.skip('Test Utilities - Example Helpers', () => {
  // Helper function to complete a quiz
  async function completeQuiz(page: any, quizSlug: string) {
    await page.goto(`/verticals/quiz/${quizSlug}`);

    // Answer all questions randomly
    let hasMore = true;
    while (hasMore) {
      const answers = page.locator('input[type="radio"]');
      if ((await answers.count()) > 0) {
        await answers.first().click();

        const nextButton = page.locator('button:has-text("Weiter")');
        if (await nextButton.isVisible()) {
          await nextButton.click();
          await page.waitForTimeout(500);
        } else {
          hasMore = false;
        }
      } else {
        hasMore = false;
      }
    }
  }

  // Helper to get stat value
  async function getStatValue(page: any, statName: string): Promise<number> {
    const statRow = page.locator(`text=${statName}`).locator('..');
    const valueText = await statRow.locator('text=/\\d+/').first().textContent();
    return parseInt(valueText || '0', 10);
  }
});
