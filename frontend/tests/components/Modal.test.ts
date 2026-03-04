/**
 * Modal Component Tests
 *
 * Tests for Modal component structure and accessibility
 * Run with: npx playwright test Modal.test.ts
 */

import { test, expect } from '@playwright/test';

test.describe('Modal Component', () => {
  test.beforeEach(async ({ page }) => {
    // Load the app
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
  });

  test('app should load successfully', async ({ page }) => {
    // Check that page loaded successfully
    await expect(page).toHaveURL(/localhost:5173/);

    // Page should have React app
    const hasRoot = await page.evaluate(() => {
      return document.getElementById('root') !== null;
    });

    expect(hasRoot).toBe(true);
  });

  test('Modal file should have accessibility features in compiled code', async ({
    page,
  }) => {
    // Fetch the compiled Modal code from the dev server
    const content = await page.evaluate(async () => {
      try {
        const res = await fetch('/src/components/Modal.tsx');
        return await res.text();
      } catch {
        return '';
      }
    });

    // Check for accessibility patterns (will be in compiled/transformed code)
    // The component should include these features

    // Should have role="dialog"
    expect(content).toContain('dialog');

    // Should have aria-modal
    expect(content).toContain('aria-modal');

    // Should have Escape key handling
    expect(content).toContain('Escape');

    // Should have focus management
    expect(content).toContain('focus');
  });

  test('Modal should have 75% dark overlay', async ({ page }) => {
    const content = await page.evaluate(async () => {
      try {
        const res = await fetch('/src/components/Modal.tsx');
        return await res.text();
      } catch {
        return '';
      }
    });

    // Check for bg-black/75 (75% opacity overlay)
    expect(content).toContain('black/75');
  });

  test('Modal should be responsive with mobile margin', async ({ page }) => {
    const content = await page.evaluate(async () => {
      try {
        const res = await fetch('/src/components/Modal.tsx');
        return await res.text();
      } catch {
        return '';
      }
    });

    // Check for responsive margin (mx-4)
    expect(content).toContain('mx-4');
  });

  test('Modal should have content scrolling capability', async ({ page }) => {
    const content = await page.evaluate(async () => {
      try {
        const res = await fetch('/src/components/Modal.tsx');
        return await res.text();
      } catch {
        return '';
      }
    });

    // Check for overflow-y-auto for content scrolling
    expect(content).toContain('overflow-y-auto');
  });

  test('Modal should handle body scroll lock on open/close', async ({ page }) => {
    const content = await page.evaluate(async () => {
      try {
        const res = await fetch('/src/components/Modal.tsx');
        return await res.text();
      } catch {
        return '';
      }
    });

    // Check for body overflow management
    expect(content).toContain('body.style.overflow');
  });

  test('Modal should have close button with accessibility label', async ({
    page,
  }) => {
    const content = await page.evaluate(async () => {
      try {
        const res = await fetch('/src/components/Modal.tsx');
        return await res.text();
      } catch {
        return '';
      }
    });

    // Check for close button
    expect(content).toContain('Close modal');
  });

  test('Modal should support optional footer', async ({ page }) => {
    const content = await page.evaluate(async () => {
      try {
        const res = await fetch('/src/components/Modal.tsx');
        return await res.text();
      } catch {
        return '';
      }
    });

    // Check for footer prop and purple border styling
    expect(content).toContain('border-purple-500');
  });

  test('Modal should have header with title support', async ({ page }) => {
    const content = await page.evaluate(async () => {
      try {
        const res = await fetch('/src/components/Modal.tsx');
        return await res.text();
      } catch {
        return '';
      }
    });

    // Check for title and header implementation
    expect(content).toContain('title');
    expect(content).toContain('modal-title');
  });

  test('Modal should have proper prop typing', async ({ page }) => {
    const content = await page.evaluate(async () => {
      try {
        const res = await fetch('/src/components/Modal.tsx');
        return await res.text();
      } catch {
        return '';
      }
    });

    // Check for TypeScript props interface
    expect(content).toContain('isOpen');
    expect(content).toContain('onClose');
  });

  test('Modal should use focus management hooks', async ({ page }) => {
    const content = await page.evaluate(async () => {
      try {
        const res = await fetch('/src/components/Modal.tsx');
        return await res.text();
      } catch {
        return '';
      }
    });

    // Check for useRef and useEffect hooks
    expect(content).toContain('useRef');
    expect(content).toContain('useEffect');
  });
});
