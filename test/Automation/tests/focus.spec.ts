import { test, expect } from '../fixtures/auth.fixture';

test.describe('Focus Space (Pomodoro)', () => {
  test.beforeEach(async ({ loggedInPage, dashboardPage }) => {
    await dashboardPage.navigateToFocus();
  });

  test('Start and pause a focus session', async ({ page }) => {
    // Assert 25:00 default timer exists
    await expect(page.getByText('25:00')).toBeVisible();

    // Click start
    const startBtn = page.getByRole('button', { name: /start/i });
    await startBtn.click();

    // Timer should tick down to 24:59
    await expect(page.getByText('24:59')).toBeVisible({ timeout: 2000 });

    // Click pause
    const pauseBtn = page.getByRole('button', { name: /pause/i });
    await pauseBtn.click();
    
    // Assert Resume is visible
    await expect(page.getByRole('button', { name: /resume/i })).toBeVisible();
  });
});
