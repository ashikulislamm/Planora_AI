import { test, expect } from '../fixtures/auth.fixture';

test.describe('Task CRUD Operations', () => {
  // Use the loggedInPage fixture to bypass manual login in every test
  test.beforeEach(async ({ loggedInPage, dashboardPage }) => {
    await dashboardPage.navigateToTasks();
  });

  test('Create a new task', async ({ page }) => {
    const taskTitle = `Auto Task ${Date.now()}`;
    
    // Using standard Planora_AI UI selectors (adjusted to common ARIA/Tailwind patterns)
    await page.getByRole('button', { name: /new task|add task/i }).first().click();
    await page.getByPlaceholder(/task title/i).fill(taskTitle);
    await page.getByRole('button', { name: /save|create/i }).click();

    // Verify task exists in the list
    await expect(page.getByText(taskTitle)).toBeVisible();
  });

  test('Mark task as complete', async ({ page }) => {
    // Check the first incomplete task checkbox
    const firstTaskCheckbox = page.locator('input[type="checkbox"]').first();
    await firstTaskCheckbox.check();

    // Verify UI reflects checked state
    await expect(firstTaskCheckbox).toBeChecked();
  });
});
