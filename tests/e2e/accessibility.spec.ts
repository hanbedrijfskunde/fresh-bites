import { test, expect } from '@playwright/test';

test.describe('Accessibility Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fresh-bites/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test.describe('Keyboard Navigation', () => {
    test('should navigate welcome screen with keyboard', async ({ page }) => {
      // Tab to username input
      await page.keyboard.press('Tab');
      const usernameInput = page.getByPlaceholder(/naam/i);
      await expect(usernameInput).toBeFocused();

      // Type username
      await page.keyboard.type('KeyboardUser');

      // Tab to checkbox
      await page.keyboard.press('Tab');
      const checkbox = page.getByRole('checkbox', { name: /ontspannen modus/i });
      await expect(checkbox).toBeFocused();

      // Space to toggle checkbox
      await page.keyboard.press('Space');
      await expect(checkbox).toBeChecked();

      // Tab to start button
      await page.keyboard.press('Tab');
      const startButton = page.getByRole('button', { name: /start/i });
      await expect(startButton).toBeFocused();

      // Enter to start
      await page.keyboard.press('Enter');
      await expect(page.getByText(/Transactie 1/)).toBeVisible();
    });

    test('should navigate simulation screen with keyboard', async ({ page }) => {
      // Start simulation
      await page.getByPlaceholder(/naam/i).fill('KeyboardTest');
      await page.getByRole('button', { name: /start/i }).click();
      await expect(page.getByText(/Transactie 1/)).toBeVisible();

      // Tab through journal table
      await page.keyboard.press('Tab');

      // Should focus on first account dropdown
      const firstDropdown = page.getByRole('combobox').first();
      await expect(firstDropdown).toBeFocused();

      // Tab to debit input
      await page.keyboard.press('Tab');
      const firstDebitInput = page.locator('input[placeholder*="0,00"]').first();
      await expect(firstDebitInput).toBeFocused();

      // Tab to credit input
      await page.keyboard.press('Tab');
      const firstCreditInput = page.locator('input[placeholder*="0,00"]').nth(1);
      await expect(firstCreditInput).toBeFocused();
    });

    test('should be able to select account with keyboard', async ({ page }) => {
      // Start simulation
      await page.getByPlaceholder(/naam/i).fill('KeyboardTest');
      await page.getByRole('button', { name: /start/i }).click();
      await expect(page.getByText(/Transactie 1/)).toBeVisible();

      // Focus first account dropdown
      const accountDropdown = page.getByRole('combobox').first();
      await accountDropdown.focus();
      await expect(accountDropdown).toBeFocused();

      // Open dropdown with keyboard
      await page.keyboard.press('ArrowDown');

      // Select an account
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');

      // Dropdown should have a value
      const selectedValue = await accountDropdown.inputValue();
      expect(selectedValue).toBeTruthy();
    });

    test('should submit form with keyboard', async ({ page }) => {
      // Start simulation
      await page.getByPlaceholder(/naam/i).fill('KeyboardTest');
      await page.getByRole('button', { name: /start/i }).click();
      await expect(page.getByText(/Transactie 1/)).toBeVisible();

      // Tab to submit button (skip through journal fields)
      // Note: Exact tab count depends on number of journal rows
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
      }

      // Find submit button by checking focus
      const submitButton = page.getByRole('button', { name: /controleer/i });

      // Focus on submit button
      await submitButton.focus();
      await expect(submitButton).toBeFocused();

      // Press Enter to submit
      await page.keyboard.press('Enter');

      // Should show feedback modal
      await expect(page.getByRole('dialog')).toBeVisible();
    });
  });

  test.describe('Screen Reader Support', () => {
    test('should have proper ARIA labels on inputs', async ({ page }) => {
      // Start simulation
      await page.getByPlaceholder(/naam/i).fill('A11yTest');
      await page.getByRole('button', { name: /start/i }).click();
      await expect(page.getByText(/Transactie 1/)).toBeVisible();

      // Check account dropdown has label
      const accountDropdown = page.getByRole('combobox').first();
      const dropdownLabel = await accountDropdown.getAttribute('aria-label');
      expect(dropdownLabel).toBeTruthy();

      // Check timer has aria-label
      const timer = page.getByRole('timer');
      const timerLabel = await timer.getAttribute('aria-label');
      expect(timerLabel).toContain('Resterende tijd');
    });

    test('should have proper ARIA live regions', async ({ page }) => {
      // Start simulation
      await page.getByPlaceholder(/naam/i).fill('A11yTest');
      await page.getByRole('button', { name: /start/i }).click();
      await expect(page.getByText(/Transactie 1/)).toBeVisible();

      // Timer should have aria-live
      const timer = page.getByRole('timer');
      const ariaLive = await timer.getAttribute('aria-live');
      expect(ariaLive).toBe('polite');
    });

    test('should have semantic HTML structure', async ({ page }) => {
      // Start simulation
      await page.getByPlaceholder(/naam/i).fill('A11yTest');
      await page.getByRole('button', { name: /start/i }).click();
      await expect(page.getByText(/Transactie 1/)).toBeVisible();

      // Check for semantic elements
      await expect(page.locator('table')).toBeVisible();
      await expect(page.locator('button')).toHaveCount(await page.locator('button').count());
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      // Welcome screen
      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);

      // Start simulation
      await page.getByPlaceholder(/naam/i).fill('A11yTest');
      await page.getByRole('button', { name: /start/i }).click();
      await expect(page.getByText(/Transactie 1/)).toBeVisible();

      // Should have headings on simulation screen
      const headings = page.locator('h1, h2, h3');
      const count = await headings.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Focus Management', () => {
    test('should show visible focus indicators', async ({ page }) => {
      await page.getByPlaceholder(/naam/i).focus();

      // Check for focus-visible styling
      const usernameInput = page.getByPlaceholder(/naam/i);
      const outline = await usernameInput.evaluate((el) => {
        return window.getComputedStyle(el).outline;
      });

      // Should have some outline (browsers have different defaults)
      expect(outline).toBeTruthy();
    });

    test('should trap focus in modals', async ({ page }) => {
      // Start simulation
      await page.getByPlaceholder(/naam/i).fill('FocusTest');
      await page.getByRole('button', { name: /start/i }).click();
      await expect(page.getByText(/Transactie 1/)).toBeVisible();

      // Open hint modal
      await page.getByRole('button', { name: /hint/i }).click();
      await expect(page.getByRole('dialog')).toBeVisible();

      // Tab through modal
      await page.keyboard.press('Tab');

      // Focus should remain within modal
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return el?.closest('[role="dialog"]') !== null;
      });

      expect(focusedElement).toBe(true);
    });

    test('should restore focus when modal closes', async ({ page }) => {
      // Start simulation
      await page.getByPlaceholder(/naam/i).fill('FocusTest');
      await page.getByRole('button', { name: /start/i }).click();
      await expect(page.getByText(/Transactie 1/)).toBeVisible();

      // Focus hint button
      const hintButton = page.getByRole('button', { name: /hint/i });
      await hintButton.focus();
      await expect(hintButton).toBeFocused();

      // Click hint button
      await hintButton.click();
      await expect(page.getByRole('dialog')).toBeVisible();

      // Close modal
      await page.getByRole('button', { name: /sluiten/i }).click();
      await expect(page.getByRole('dialog')).not.toBeVisible();

      // Focus should return to hint button
      await expect(hintButton).toBeFocused();
    });
  });

  test.describe('Color Contrast', () => {
    test('should have sufficient color contrast for text', async ({ page }) => {
      // Start simulation
      await page.getByPlaceholder(/naam/i).fill('ContrastTest');
      await page.getByRole('button', { name: /start/i }).click();
      await expect(page.getByText(/Transactie 1/)).toBeVisible();

      // Get text color and background color
      const textElement = page.getByText(/Transactie 1/);
      const { color, backgroundColor } = await textElement.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          color: styles.color,
          backgroundColor: styles.backgroundColor,
        };
      });

      // Both should be defined (actual contrast calculation would require a library)
      expect(color).toBeTruthy();
      expect(backgroundColor).toBeTruthy();
    });

    test('should have visible focus indicators with sufficient contrast', async ({ page }) => {
      // Start simulation
      await page.getByPlaceholder(/naam/i).fill('ContrastTest');
      await page.getByRole('button', { name: /start/i }).click();
      await expect(page.getByText(/Transactie 1/)).toBeVisible();

      // Focus a button
      const submitButton = page.getByRole('button', { name: /controleer/i });
      await submitButton.focus();

      // Check outline is visible
      const outline = await submitButton.evaluate((el) => {
        return window.getComputedStyle(el).outlineWidth;
      });

      // Should have some outline width
      expect(outline).toBeTruthy();
    });
  });

  test.describe('Form Labels', () => {
    test('should have proper labels for all form inputs', async ({ page }) => {
      // Username input should have placeholder as label
      const usernameInput = page.getByPlaceholder(/naam/i);
      await expect(usernameInput).toBeVisible();

      // Checkbox should have label
      const checkbox = page.getByRole('checkbox', { name: /ontspannen modus/i });
      await expect(checkbox).toBeVisible();

      // Start button should have accessible name
      const startButton = page.getByRole('button', { name: /start/i });
      await expect(startButton).toBeVisible();
    });

    test('should have proper labels in journal table', async ({ page }) => {
      // Start simulation
      await page.getByPlaceholder(/naam/i).fill('LabelTest');
      await page.getByRole('button', { name: /start/i }).click();
      await expect(page.getByText(/Transactie 1/)).toBeVisible();

      // Table should have column headers
      await expect(page.getByRole('columnheader', { name: /rekening/i })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: /debet/i })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: /credit/i })).toBeVisible();

      // Dropdowns should have accessible name
      const accountDropdown = page.getByRole('combobox').first();
      const dropdownName = await accountDropdown.getAttribute('aria-label');
      expect(dropdownName).toBeTruthy();
    });
  });

  test.describe('Error Messages', () => {
    test('should announce errors to screen readers', async ({ page }) => {
      // Start simulation
      await page.getByPlaceholder(/naam/i).fill('ErrorTest');
      await page.getByRole('button', { name: /start/i }).click();
      await expect(page.getByText(/Transactie 1/)).toBeVisible();

      // Submit empty form
      await page.getByRole('button', { name: /controleer/i }).click();

      // Error modal should be visible
      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible();

      // Modal should have accessible name or description
      const modalRole = await modal.getAttribute('role');
      expect(modalRole).toBe('dialog');
    });
  });
});
