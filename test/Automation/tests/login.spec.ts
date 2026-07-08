import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('Authentication Flows', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Successful login redirects to Dashboard', async ({ page }) => {
    await loginPage.login('testqa1@planora.com', 'SecurePass123!');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('Invalid login shows error message', async ({ page }) => {
    await loginPage.login('testqa1@planora.com', 'WrongPass!');
    await expect(loginPage.errorMessage()).toBeVisible();
  });

  test('Logout returns to login screen', async ({ page }) => {
    // Reusable login flow for setup
    await loginPage.login('testqa1@planora.com', 'SecurePass123!');
    await expect(page).toHaveURL(/.*dashboard/);
    
    const dashboard = new DashboardPage(page);
    await dashboard.logout();
    await expect(page).toHaveURL(/.*login/);
  });
});
