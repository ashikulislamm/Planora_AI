import { test, expect } from '../fixtures/auth.fixture';

test.describe('Profile and Settings', () => {
  test.beforeEach(async ({ loggedInPage, page }) => {
    // Navigate directly
    await page.goto('/dashboard/settings');
  });

  test('Update profile name', async ({ page }) => {
    const newName = `QA User ${Math.floor(Math.random() * 100)}`;
    
    const nameInput = page.getByLabel(/name/i);
    await nameInput.fill('');
    await nameInput.fill(newName);
    
    await page.getByRole('button', { name: /update profile|save/i }).click();

    // Toast notification verification
    await expect(page.getByRole('alert')).toContainText(/success|updated/i);
    
    // Verify name updated in UI
    await expect(page.getByText(newName).first()).toBeVisible();
  });
});
