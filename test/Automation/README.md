# Planora_AI Automation Framework

This directory contains the Playwright End-to-End (E2E) test suite for the Planora_AI application.

## Architecture
- **Language**: TypeScript
- **Framework**: Playwright Test
- **Design Pattern**: Page Object Model (POM)
- **Data Sharing**: Custom Fixtures (`auth.fixture.ts`) to bypass repetitive UI steps.

## Directory Structure
- `fixtures/`: Contains Playwright extensions, like the `loggedInPage` fixture to auto-login.
- `pages/`: Page Object classes (e.g., `LoginPage.ts`, `DashboardPage.ts`) abstracting DOM selectors.
- `tests/`: Spec files categorized by module (`login.spec.ts`, `task.spec.ts`, etc).
- `helpers/`: Utility functions for API setup/teardown (if needed).

## Setup
1. Ensure Node.js is installed.
2. Run `npm install` in this directory to install Playwright.
3. Run `npx playwright install` to download browser binaries.

## Running Tests
Run all tests headlessly (Chromium default):
```bash
npx playwright test
```

Run tests with UI Mode (great for debugging):
```bash
npx playwright test --ui
```

Run on Mobile (Pixel 5 simulation):
```bash
npm run test:mobile
```

## Trace & Video Evidence
Traces and videos are configured in `playwright.config.ts` to be retained `only-on-failure`. 
If a test fails, you can view the video/trace in `test/Evidence/reports/`.
