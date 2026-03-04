/**
 * Playwright Test Template for UI Components
 *
 * Copy this template and rename to [ComponentName].test.ts
 * Run with: npx playwright test [ComponentName].test.ts
 */

import { test, expect } from '@playwright/test';

test.describe('ComponentName', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a page that renders your component
    await page.goto('http://localhost:5173');
  });

  test('should render component', async ({ page }) => {
    // Check if component is visible
    const component = page.locator('[data-testid="component-name"]');
    await expect(component).toBeVisible();
  });

  test('should handle interactions', async ({ page }) => {
    // Example: Click button and verify state change
    const button = page.locator('button');
    await button.click();

    // Verify UI updated
    const result = page.locator('[data-testid="result"]');
    await expect(result).toContainText('expected text');
  });

  test('should be keyboard accessible', async ({ page }) => {
    // Tab navigation
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBe('BUTTON');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const component = page.locator('[data-testid="component-name"]');
    await expect(component).toBeVisible();
  });

  test('should have accessible labels', async ({ page }) => {
    // Check for aria-label or aria-labelledby
    const button = page.locator('button');
    const ariaLabel = await button.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
  });
});
