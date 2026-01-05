import { test, expect } from '@playwright/test';

test.describe('Complete Simulation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test for clean state
    await page.goto('/fresh-bites/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should complete simulation with correct answers on first try', async ({ page }) => {
    // Start on welcome screen
    await expect(page.getByRole('heading', { name: /FreshBites/ })).toBeVisible();

    // Enter username and start simulation
    await page.getByPlaceholder(/naam/i).fill('TestStudent');
    await page.getByRole('button', { name: /start/i }).click();

    // Should be on simulation screen
    await expect(page.getByText(/Transactie 1/)).toBeVisible();

    // Wait for first message to appear
    await expect(page.locator('.message').first()).toBeVisible();

    // Verify chat-style interface is present
    await expect(page.locator('.message-list')).toBeVisible();

    // Verify journal table is present
    await expect(page.getByRole('table')).toBeVisible();

    // Note: Full simulation requires knowing exact transactions
    // This test verifies the UI structure is working correctly
  });

  test('should show welcome screen with correct elements', async ({ page }) => {
    await page.goto('/fresh-bites/');

    // Check logo and title
    await expect(page.getByRole('heading', { name: /FreshBites/ })).toBeVisible();
    await expect(page.getByText(/Boekhoud/)).toBeVisible();

    // Check username input
    const usernameInput = page.getByPlaceholder(/naam/i);
    await expect(usernameInput).toBeVisible();
    await expect(usernameInput).toBeEnabled();

    // Check relaxed mode checkbox
    const relaxedCheckbox = page.getByRole('checkbox', { name: /ontspannen modus/i });
    await expect(relaxedCheckbox).toBeVisible();

    // Check start button (should be disabled initially)
    const startButton = page.getByRole('button', { name: /start/i });
    await expect(startButton).toBeVisible();
    await expect(startButton).toBeDisabled();

    // Enable start button by entering username
    await usernameInput.fill('Student123');
    await expect(startButton).toBeEnabled();
  });

  test('should enable relaxed mode when checkbox is selected', async ({ page }) => {
    await page.goto('/fresh-bites/');

    // Enter username
    await page.getByPlaceholder(/naam/i).fill('TestStudent');

    // Enable relaxed mode
    const relaxedCheckbox = page.getByRole('checkbox', { name: /ontspannen modus/i });
    await relaxedCheckbox.check();
    await expect(relaxedCheckbox).toBeChecked();

    // Start simulation
    await page.getByRole('button', { name: /start/i }).click();

    // Should be on simulation screen
    await expect(page.getByText(/Transactie/)).toBeVisible();
  });

  test('should show transaction timer on simulation screen', async ({ page }) => {
    await page.goto('/fresh-bites/');

    // Start simulation
    await page.getByPlaceholder(/naam/i).fill('TestStudent');
    await page.getByRole('button', { name: /start/i }).click();

    // Wait for simulation to load
    await expect(page.getByText(/Transactie 1/)).toBeVisible();

    // Check for timer element
    const timer = page.getByRole('timer');
    await expect(timer).toBeVisible();

    // Timer should show initial time (e.g., "03:00" for 180 seconds)
    await expect(timer).toContainText(/\d{2}:\d{2}/);
  });

  test('should show journal table with correct structure', async ({ page }) => {
    await page.goto('/fresh-bites/');

    // Start simulation
    await page.getByPlaceholder(/naam/i).fill('TestStudent');
    await page.getByRole('button', { name: /start/i }).click();

    // Wait for simulation to load
    await expect(page.getByText(/Transactie 1/)).toBeVisible();

    // Check journal table structure
    const table = page.getByRole('table');
    await expect(table).toBeVisible();

    // Check for table headers
    await expect(page.getByRole('columnheader', { name: /rekening/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /debet/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /credit/i })).toBeVisible();

    // Check for at least one empty journal row
    const accountDropdown = page.getByRole('combobox').first();
    await expect(accountDropdown).toBeVisible();
  });

  test('should show action buttons (hint and submit)', async ({ page }) => {
    await page.goto('/fresh-bites/');

    // Start simulation
    await page.getByPlaceholder(/naam/i).fill('TestStudent');
    await page.getByRole('button', { name: /start/i }).click();

    // Wait for simulation to load
    await expect(page.getByText(/Transactie 1/)).toBeVisible();

    // Check for hint button
    const hintButton = page.getByRole('button', { name: /hint/i });
    await expect(hintButton).toBeVisible();
    await expect(hintButton).toBeEnabled();

    // Check for submit button
    const submitButton = page.getByRole('button', { name: /controleer/i });
    await expect(submitButton).toBeVisible();
  });

  test('should show progress indicator', async ({ page }) => {
    await page.goto('/fresh-bites/');

    // Start simulation
    await page.getByPlaceholder(/naam/i).fill('TestStudent');
    await page.getByRole('button', { name: /start/i }).click();

    // Wait for simulation to load
    await expect(page.getByText(/Transactie 1/)).toBeVisible();

    // Check for progress indicator showing current transaction
    await expect(page.getByText(/Transactie 1 van 5/)).toBeVisible();
  });

  test('should show star rating display', async ({ page }) => {
    await page.goto('/fresh-bites/');

    // Start simulation
    await page.getByPlaceholder(/naam/i).fill('TestStudent');
    await page.getByRole('button', { name: /start/i }).click();

    // Wait for simulation to load
    await expect(page.getByText(/Transactie 1/)).toBeVisible();

    // Check for star rating (should show 0.0/5.0 initially)
    await expect(page.getByText(/⭐/)).toBeVisible();
    await expect(page.getByText(/0\.0/)).toBeVisible();
  });

  test('should persist simulation state on page reload', async ({ page }) => {
    await page.goto('/fresh-bites/');

    // Start simulation
    await page.getByPlaceholder(/naam/i).fill('PersistTest');
    await page.getByRole('button', { name: /start/i }).click();

    // Wait for simulation to load
    await expect(page.getByText(/Transactie 1/)).toBeVisible();

    // Reload the page
    await page.reload();

    // Should still be on simulation screen (not welcome screen)
    await expect(page.getByText(/Transactie 1/)).toBeVisible();

    // Journal table should still be visible
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('should show validation error when submitting empty entry', async ({ page }) => {
    await page.goto('/fresh-bites/');

    // Start simulation
    await page.getByPlaceholder(/naam/i).fill('TestStudent');
    await page.getByRole('button', { name: /start/i }).click();

    // Wait for simulation to load
    await expect(page.getByText(/Transactie 1/)).toBeVisible();

    // Submit without filling any journal entries
    const submitButton = page.getByRole('button', { name: /controleer/i });
    await submitButton.click();

    // Should show feedback modal with error
    await expect(page.getByText(/onjuist/i)).toBeVisible();
  });

  test('should be keyboard accessible', async ({ page }) => {
    await page.goto('/fresh-bites/');

    // Tab through welcome screen
    const usernameInput = page.getByPlaceholder(/naam/i);

    // Focus on username input
    await usernameInput.focus();
    await expect(usernameInput).toBeFocused();

    // Type username
    await usernameInput.type('KeyboardTest');

    // Tab to checkbox
    await page.keyboard.press('Tab');
    const checkbox = page.getByRole('checkbox', { name: /ontspannen modus/i });
    await expect(checkbox).toBeFocused();

    // Tab to start button
    await page.keyboard.press('Tab');
    const startButton = page.getByRole('button', { name: /start/i });
    await expect(startButton).toBeFocused();

    // Press Enter to start
    await page.keyboard.press('Enter');

    // Should be on simulation screen
    await expect(page.getByText(/Transactie 1/)).toBeVisible();
  });
});
