# Test Plan for Planora_AI

## 1. Objective
The objective of this Test Plan is to define the testing strategy, scope, environment, and methodologies to validate the Planora_AI application. The goal is to ensure a high-quality, bug-free user experience prior to production release.

## 2. Scope
### 2.1 In-Scope Features
The following implemented features will be rigorously tested:
- **Authentication**: Registration, Login, Logout, Session Refresh.
- **Task Management**: Create, Read, Update, Delete tasks, subtasks, and work logs.
- **Focus Space**: Pomodoro timer sessions, session history, and session management.
- **AI Copilot**: GenAI suggestions, task breakdown, and project planning.
- **Dashboard & Analytics**: Task tracking and productivity overviews.
- **User Profile**: Profile updates, password changes, account deletion.

### 2.2 Out-of-Scope Features
- **Workspace CRUD**: The application currently uses "Workspace" as a UI label, but lacks backend models/CRUD.
- **Role-Based Access Control (RBAC)**: No roles (Admin, Manager, etc.) are implemented in the current system logic.
- **Backend Notification Engine**: Notifications exist only as local UI toasts.
- Load and Performance Testing.
- Third-party API uptime (e.g., Google GenAI) beyond graceful error handling.

## 3. Testing Types
- **Functional Testing**: Verifying all core features against requirements.
- **API Testing**: Validating RESTful endpoints, status codes, auth, and payloads.
- **UI/UX Testing**: Cross-browser and responsive design checks.
- **Regression Testing**: Ensuring new features do not break existing functionality.
- **End-to-End (E2E) Automation**: Utilizing Playwright for critical user workflows.
- **Database Validation**: Ensuring data integrity in MongoDB (via SQL-equivalent validations).

## 4. Environment Requirements
- **Frontend**: Next.js development server (Localhost)
- **Backend**: Node.js/Express server connected to MongoDB
- **Test Data**: Dedicated test accounts (e.g., `testuser@planora.ai`).

## 5. Supported Browsers & Devices
- **Desktop**: Google Chrome (Latest), Mozilla Firefox (Latest), Microsoft Edge (Latest).
- **Mobile/Tablet**: Chrome for Android, Safari for iOS (Simulated via Playwright).
- **Resolutions**: 320px, 375px, 768px, 1024px, 1440px, 1920px.

## 6. Entry and Exit Criteria
### Entry Criteria
- Code is deployed to the test environment.
- Backend APIs are accessible.
- Environment variables (DB URI, JWT Secrets, AI Keys) are configured.

### Exit Criteria
- 100% of Smoke and Regression test cases executed.
- No Critical or High-severity defects are Open.
- All automation scripts pass consistently.
- Test Summary Report is generated and signed off.

## 7. Risk Analysis
| Risk | Impact | Mitigation |
|------|--------|------------|
| GenAI API rate limits/timeouts | High | Mock AI responses in E2E tests where necessary, test error handling. |
| JWT Expiry disrupting workflows | Medium | Ensure session refresh logic is thoroughly tested manually and automatically. |
| Inconsistent Pomodoro Timer states | High | Test Focus Space persistence across page reloads and multiple tabs. |

## 8. Deliverables
- Master Test Plan
- Manual Test Cases (Functional, Regression, Smoke, Integration, Exploratory, UAT)
- Automated Test Scripts (Playwright)
- API Test Suite (Postman)
- Bug Reports
- Final Test Execution Report
