import { Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Selectors based on likely accessible names or input types
  emailInput = () => this.page.getByPlaceholder(/email/i).or(this.page.getByRole('textbox', { name: /email/i }));
  passwordInput = () => this.page.getByPlaceholder(/password/i).or(this.page.getByLabel(/password/i));
  submitBtn = () => this.page.getByRole('button', { name: /sign in|log in/i });
  errorMessage = () => this.page.getByRole('alert');

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, pass: string) {
    await this.emailInput().fill(email);
    await this.passwordInput().fill(pass);
    await this.submitBtn().click();
  }
}
