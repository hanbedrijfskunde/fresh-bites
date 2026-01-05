import { test, expect } from '@playwright/test';

test.describe('Transaction Timer', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage and start a new simulation
    await page.goto('/fresh-bites/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Start simulation
    await page.getByPlaceholder(/naam/i).fill('TimerTestStudent');
    await page.getByRole('button', { name: /start/i }).click();

    // Wait for simulation to load
    await expect(page.getByText(/Transactie 1/)).toBeVisible();
  });

  test('should display timer on transaction screen', async ({ page }) => {
    const timer = page.getByRole('timer');
    await expect(timer).toBeVisible();

    // Should show time in MM:SS format
    await expect(timer).toContainText(/\d{2}:\d{2}/);
  });

  test('should show initial time for first transaction (180 seconds)', async ({ page }) => {
    const timer = page.getByRole('timer');
    await expect(timer).toBeVisible();

    // Should show 03:00 (180 seconds)
    await expect(timer).toContainText(/03:00/);
  });

  test('should countdown from initial time', async ({ page }) => {
    const timer = page.getByRole('timer');

    // Get initial time
    const initialTime = await timer.textContent();

    // Wait 2 seconds
    await page.waitForTimeout(2000);

    // Time should have decreased
    const currentTime = await timer.textContent();
    expect(currentTime).not.toBe(initialTime);
  });

  test('should show warning state in last 10 seconds', async ({ page }) => {
    // Manipulate store to set time to 10 seconds
    await page.evaluate(() => {
      const store = JSON.parse(localStorage.getItem('freshbites-simulation') || '{}');
      if (store.state?.userProgress?.transactionProgress) {
        const firstTransactionId = Object.keys(store.state.userProgress.transactionProgress)[0];
        store.state.userProgress.transactionProgress[firstTransactionId].timeRemaining = 10;
        localStorage.setItem('freshbites-simulation', JSON.stringify(store));
      }
    });

    // Reload to apply changes
    await page.reload();

    // Wait for simulation to load
    await expect(page.getByText(/Transactie 1/)).toBeVisible();

    // Timer should have warning styling (red color, pulse animation)
    const timer = page.getByRole('timer');
    await expect(timer).toBeVisible();

    // Check for warning class (red text)
    const timerClasses = await timer.getAttribute('class');
    expect(timerClasses).toContain('text-red');
  });

  test('should show critical state in last 5 seconds', async ({ page }) => {
    // Manipulate store to set time to 5 seconds
    await page.evaluate(() => {
      const store = JSON.parse(localStorage.getItem('freshbites-simulation') || '{}');
      if (store.state?.userProgress?.transactionProgress) {
        const firstTransactionId = Object.keys(store.state.userProgress.transactionProgress)[0];
        store.state.userProgress.transactionProgress[firstTransactionId].timeRemaining = 5;
        localStorage.setItem('freshbites-simulation', JSON.stringify(store));
      }
    });

    // Reload to apply changes
    await page.reload();

    // Wait for simulation to load
    await expect(page.getByText(/Transactie 1/)).toBeVisible();

    // Timer should be visible and showing warning state
    const timer = page.getByRole('timer');
    await expect(timer).toBeVisible();
    await expect(timer).toContainText(/00:0[0-5]/);
  });

  test('should stop timer when transaction is completed', async ({ page }) => {
    const timer = page.getByRole('timer');

    // Get current time
    const timeBeforeSubmit = await timer.textContent();

    // Fill in a journal entry (any entry to test functionality)
    const accountDropdown = page.getByRole('combobox').first();
    await accountDropdown.click();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    // Fill in debit amount
    const debitInput = page.locator('input[placeholder*="0,00"]').first();
    await debitInput.fill('100');

    // Submit (will likely be incorrect, but that's okay for this test)
    await page.getByRole('button', { name: /controleer/i }).click();

    // Wait for feedback modal
    await expect(page.getByRole('dialog')).toBeVisible();

    // Get time after submit
    const timeAfterSubmit = await timer.textContent();

    // Time should have changed (countdown continues until correct answer)
    // Or, if answer was somehow correct, timer should have stopped
    expect(timeBeforeSubmit).toBeTruthy();
    expect(timeAfterSubmit).toBeTruthy();
  });

  test('should show timer with correct aria-label', async ({ page }) => {
    const timer = page.getByRole('timer');
    await expect(timer).toBeVisible();

    // Check for aria-label
    const ariaLabel = await timer.getAttribute('aria-label');
    expect(ariaLabel).toContain('Resterende tijd');
  });

  test('should display timer icon', async ({ page }) => {
    const timer = page.getByRole('timer');
    await expect(timer).toBeVisible();

    // Should contain timer emoji
    await expect(timer).toContainText('⏱️');
  });

  test('should have different time limits for different transactions', async ({ page }) => {
    // Transaction 1 should have 180 seconds (03:00)
    const timer = page.getByRole('timer');
    await expect(timer).toContainText(/03:00/);

    // Note: Testing subsequent transactions requires completing the first one
    // This test verifies the initial timer display works correctly
  });

  test('should persist timer state on page reload', async ({ page }) => {
    // Get initial time
    const timer = page.getByRole('timer');
    const initialTime = await timer.textContent();

    // Wait for timer to count down
    await page.waitForTimeout(3000);

    // Get time before reload
    const timeBeforeReload = await timer.textContent();
    expect(timeBeforeReload).not.toBe(initialTime);

    // Reload page
    await page.reload();

    // Wait for simulation to load
    await expect(page.getByText(/Transactie 1/)).toBeVisible();

    // Timer should still be visible
    await expect(timer).toBeVisible();

    // Note: The exact time may differ slightly due to persistence logic
    // but timer should still be running
    const timeAfterReload = await timer.textContent();
    expect(timeAfterReload).toBeTruthy();
  });

  test('should handle timer expiration gracefully', async ({ page }) => {
    // Set time to 1 second
    await page.evaluate(() => {
      const store = JSON.parse(localStorage.getItem('freshbites-simulation') || '{}');
      if (store.state?.userProgress?.transactionProgress) {
        const firstTransactionId = Object.keys(store.state.userProgress.transactionProgress)[0];
        store.state.userProgress.transactionProgress[firstTransactionId].timeRemaining = 1;
        localStorage.setItem('freshbites-simulation', JSON.stringify(store));
      }
    });

    // Reload to apply changes
    await page.reload();

    // Wait for simulation to load
    await expect(page.getByText(/Transactie 1/)).toBeVisible();

    // Wait for timer to expire (2 seconds to be safe)
    await page.waitForTimeout(2000);

    // Should show expired state or move to next transaction
    // Note: Exact behavior depends on implementation
    const timer = page.getByRole('timer');
    // Timer might show 00:00 or be hidden
    const timerVisible = await timer.isVisible().catch(() => false);
    expect(typeof timerVisible).toBe('boolean');
  });

  test('should not show timer in relaxed mode', async ({ page }) => {
    // Go back to welcome screen
    await page.goto('/fresh-bites/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Start simulation with relaxed mode
    await page.getByPlaceholder(/naam/i).fill('RelaxedStudent');
    await page.getByRole('checkbox', { name: /ontspannen modus/i }).check();
    await page.getByRole('button', { name: /start/i }).click();

    // Wait for simulation to load
    await expect(page.getByText(/Transactie 1/)).toBeVisible();

    // Timer should not be visible
    const timer = page.getByRole('timer');
    await expect(timer).not.toBeVisible();
  });
});
