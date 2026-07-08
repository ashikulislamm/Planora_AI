# Planora_AI - QA Testing Repository

Welcome to the comprehensive QA testing repository for **Planora_AI**. This repository serves as a professional portfolio demonstrating end-to-end testing strategies, including manual testing, API testing, cross-browser validation, and automated E2E testing using Playwright.

## Testing Strategy
The QA strategy for Planora_AI is based on a risk-driven approach, verifying all implemented functionality across the frontend and backend. The primary areas of focus include:
- **Authentication**: JWT-based secure login, registration, and session management.
- **Task Management (CRUD)**: End-to-end lifecycle of tasks, subtasks, and work logs.
- **Focus Space**: Pomodoro timer functionality and session tracking.
- **AI Copilot**: Integration of GenAI for task planning and insights.
- **Profile & Settings**: User preference management and data security.

*Note: Features such as 'Workspace CRUD' and 'Role-Based Access Control' are excluded from test suites as they are not currently implemented in the backend logic.*

## Repository Structure

```
test/
├── APITesting/         # Postman collections and API test reports
├── Automation/         # Playwright E2E automation framework
├── BugReports/         # Documented bugs and UX improvement suggestions
├── CrossBrowser/       # Browser compatibility testing documentation
├── Evidence/           # Execution screenshots, videos, and reports
├── ManualTesting/      # Functional, Smoke, Regression, and UAT checklists
├── ResponsiveTesting/  # Mobile, tablet, and desktop layout validations
├── SQLValidation/      # Database queries for data integrity checks
└── TestPlan/           # Comprehensive QA testing plan
```

## How to Execute Playwright Automation

1. Navigate to the automation directory:
   ```bash
   cd test/Automation
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the automated test suite:
   ```bash
   npx playwright test
   ```
4. Run tests with UI mode:
   ```bash
   npx playwright test --ui
   ```

## How to Generate Playwright Report
To view the HTML report after execution:
```bash
npx playwright show-report
```
The report will also be saved automatically in `test/Evidence/reports/`.

## How to Import Postman Collection
1. Open [Postman](https://www.postman.com/).
2. Click **Import** in the top left corner.
3. Select the file `test/APITesting/Planora.postman_collection.json`.
4. Ensure your local backend is running (typically `http://localhost:5000`) before executing API tests.

## Evidence Management
All test evidence (screenshots for failed tests, execution videos, HTML reports) is automatically stored in the `test/Evidence/` directory during Playwright execution. For manual testing, screenshots should be manually placed in `test/Evidence/screenshots/`.
