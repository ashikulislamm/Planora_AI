import { Page, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Selectors
  navTasks = () => this.page.getByRole('link', { name: /my tasks|tasks/i });
  navFocus = () => this.page.getByRole('link', { name: /focus/i });
  navProfile = () => this.page.getByRole('link', { name: /profile/i });
  navSettings = () => this.page.getByRole('link', { name: /settings/i });
  
  copilotBtn = () => this.page.locator('button:has-text("AI"), button[aria-label*="Copilot"]');
  commandPaletteInput = () => this.page.getByPlaceholder(/search dashboard/i);
  logoutBtn = () => this.page.getByRole('button', { name: /logout/i });

  async navigateToTasks() {
    await this.navTasks().click();
    await this.page.waitForURL(/tasks/);
  }

  async navigateToFocus() {
    await this.navFocus().click();
    await this.page.waitForURL(/focus/);
  }

  async logout() {
    await this.logoutBtn().click();
    await this.page.waitForURL(/login/);
  }
}
