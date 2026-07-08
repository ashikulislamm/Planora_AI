import { test as base, expect, type Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

type AuthFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  loggedInPage: Page; // Used to trigger setup
};

// Extend base test with a reusable loggedInPage fixture
export const test = base.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  loggedInPage: async ({ page, loginPage }, use) => {
    await loginPage.goto();
    // Assuming this user exists in DB from test setup
    await loginPage.login('testqa1@planora.com', 'SecurePass123!');
    await page.waitForURL(/.*dashboard/);
    await use(page);
  },
});

export { expect };
