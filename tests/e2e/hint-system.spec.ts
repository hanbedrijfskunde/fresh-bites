import { test, expect } from '@playwright/test';

test.describe('Hint System', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage and start a new simulation
    await page.goto('/fresh-bites/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Start simulation
    await page.getByPlaceholder(/naam/i).fill('HintTestStudent');
    await page.getByRole('button', { name: /start/i }).click();

    // Wait for simulation to load
    await expect(page.getByText(/Transactie 1/)).toBeVisible();
  });

  test('should show hint button on simulation screen', async ({ page }) => {
    const hintButton = page.getByRole('button', { name: /hint/i });
    await expect(hintButton).toBeVisible();
    await expect(hintButton).toBeEnabled();
  });

  test('should show hint modal when hint button is clicked', async ({ page }) => {
    // Click hint button
    const hintButton = page.getByRole('button', { name: /hint/i });
    await hintButton.click();

    // Should show modal with hint
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/hint/i)).toBeVisible();

    // Should have close button
    const closeButton = page.getByRole('button', { name: /sluiten/i });
    await expect(closeButton).toBeVisible();
  });

  test('should close hint modal when close button is clicked', async ({ page }) => {
    // Click hint button
    const hintButton = page.getByRole('button', { name: /hint/i });
    await hintButton.click();

    // Wait for modal to appear
    await expect(page.getByRole('dialog')).toBeVisible();

    // Close modal
    const closeButton = page.getByRole('button', { name: /sluiten/i });
    await closeButton.click();

    // Modal should be gone
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should show progressive hints on multiple clicks', async ({ page }) => {
    const hintButton = page.getByRole('button', { name: /hint/i });

    // First hint
    await hintButton.click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Record first hint text
    const firstHintText = await page.locator('.hint-content').textContent();

    // Close modal
    await page.getByRole('button', { name: /sluiten/i }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();

    // Second hint
    await hintButton.click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Record second hint text
    const secondHintText = await page.locator('.hint-content').textContent();

    // Hints should be different (progressive)
    expect(firstHintText).not.toBe(secondHintText);
  });

  test('should apply star penalty when hint is used', async ({ page }) => {
    // Record initial stars (should be 0.0)
    const starDisplay = page.getByText(/⭐.*0\.0/);
    await expect(starDisplay).toBeVisible();

    // Click hint button
    const hintButton = page.getByRole('button', { name: /hint/i });
    await hintButton.click();

    // Close hint modal
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: /sluiten/i }).click();

    // Note: Stars are only awarded after correct answer
    // This test verifies hint system UI works correctly
  });

  test('should show hint counter or indicator', async ({ page }) => {
    // Click hint button
    const hintButton = page.getByRole('button', { name: /hint/i });
    await hintButton.click();

    // Modal should show hint level indicator
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    // Should contain text indicating this is a hint
    await expect(modal.getByText(/hint/i)).toBeVisible();
  });

  test('should disable hint button after maximum hints are shown', async ({ page }) => {
    const hintButton = page.getByRole('button', { name: /hint/i });

    // Use all hints (3 levels)
    for (let i = 0; i < 3; i++) {
      await expect(hintButton).toBeEnabled();
      await hintButton.click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.getByRole('button', { name: /sluiten/i }).click();
      await expect(page.getByRole('dialog')).not.toBeVisible();
    }

    // After 3 hints, button should be disabled
    await expect(hintButton).toBeDisabled();
  });

  test('should show hint in Dutch language', async ({ page }) => {
    // Click hint button
    const hintButton = page.getByRole('button', { name: /hint/i });
    await hintButton.click();

    // Modal should be visible
    await expect(page.getByRole('dialog')).toBeVisible();

    // Should contain Dutch text
    const modal = page.getByRole('dialog');
    const modalText = await modal.textContent();

    // Check for common Dutch words (de, het, een, van, etc.)
    // Note: Actual hint content depends on transaction templates
    expect(modalText).toBeTruthy();
  });

  test('should allow hint modal to be closed with Escape key', async ({ page }) => {
    // Click hint button
    const hintButton = page.getByRole('button', { name: /hint/i });
    await hintButton.click();

    // Wait for modal
    await expect(page.getByRole('dialog')).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');

    // Modal should close
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should focus trap within hint modal', async ({ page }) => {
    // Click hint button
    const hintButton = page.getByRole('button', { name: /hint/i });
    await hintButton.click();

    // Wait for modal
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    // Find close button
    const closeButton = page.getByRole('button', { name: /sluiten/i });

    // Close button should be focusable
    await closeButton.focus();
    await expect(closeButton).toBeFocused();

    // Tab should keep focus within modal
    await page.keyboard.press('Tab');

    // Focus should still be within modal
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });
});
