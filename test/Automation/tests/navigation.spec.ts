import { test, expect } from '../fixtures/auth.fixture';

test.describe('Navigation and Layout', () => {
  test.beforeEach(async ({ loggedInPage }) => {});

  test('Global Command Palette opens via UI trigger', async ({ page, dashboardPage }) => {
    await dashboardPage.commandPaletteInput().click();
    
    const commandDialog = page.getByRole('dialog', { name: /search/i }).or(page.locator('.command-palette'));
    await expect(commandDialog).toBeVisible();
  });

  test('Unauthorized access attempts redirect to login', async ({ page }) => {
    // Use an isolated context to ensure no session cookies exist
    const ctx = await page.context().browser()!.newContext();
    const isolatedPage = await ctx.newPage();
    
    await isolatedPage.goto('/dashboard');
    
    // Route guard should bounce back to login
    await expect(isolatedPage).toHaveURL(/.*login/);
    await ctx.close();
  });
});
