# Functional Test Cases - Planora_AI

I have prepared functional test cases for Planora_AI, including Authentication, Task Management, Focus Space, AI Copilot, Dashboard, Settings, and Navigation. The 'Actual Result' and 'Status' columns are left blank for updates during manual testing.

## Module: Authentication (AUTH)

| Test ID | Priority | Preconditions | Steps | Expected Result | Actual Result | Status |
|---------|----------|---------------|-------|-----------------|---------------|--------|
| TC-AUTH-01 | High | Server running | 1. Navigate to `/register`. 2. Enter valid Name, Email, Password. 3. Submit. | Account created, redirected to Dashboard. | | |
| TC-AUTH-02 | High | Server running | 1. Navigate to `/register`. 2. Enter existing Email. 3. Submit. | Error message "Email already exists" shown. | | |
| TC-AUTH-03 | Medium | Server running | 1. Navigate to `/register`. 2. Leave Email empty. 3. Submit. | HTML5 form validation prevents submission. | | |
| TC-AUTH-04 | High | Account exists | 1. Navigate to `/login`. 2. Enter valid Email and Password. 3. Submit. | Logged in, JWT saved, redirected to Dashboard. | | |
| TC-AUTH-05 | High | Account exists | 1. Navigate to `/login`. 2. Enter valid Email and INVALID password. | Error message "Invalid credentials". | | |
| TC-AUTH-06 | High | Logged In | 1. Click Profile icon. 2. Click Logout. | JWT cleared, redirected to `/login`. | | |
| TC-AUTH-07 | Medium | Logged In | 1. Wait for JWT to expire (or simulate). 2. Attempt an API call. | App attempts refresh. If refresh fails, forced logout. | | |
| TC-AUTH-08 | High | Logged Out | 1. Manually navigate to `/dashboard`. | Redirected back to `/login` via Route Guard. | | |

## Module: Task Management (TASK)

| Test ID | Priority | Preconditions | Steps | Expected Result | Actual Result | Status |
|---------|----------|---------------|-------|-----------------|---------------|--------|
| TC-TASK-01 | High | Logged In | 1. Click "New Task". 2. Enter Title. 3. Save. | Task is created and appears in list. | | |
| TC-TASK-02 | Medium | Logged In | 1. Click "New Task". 2. Leave Title blank. 3. Save. | Error indicating Title is required. | | |
| TC-TASK-03 | High | Task exists | 1. Click on existing Task. 2. Edit Title and Description. 3. Save. | Task updates successfully in UI and DB. | | |
| TC-TASK-04 | High | Task exists | 1. Click Delete icon on a task. 2. Confirm deletion. | Task is removed from the UI and DB. | | |
| TC-TASK-05 | Medium | Task exists | 1. Click Task. 2. Add a subtask. | Subtask appears under the parent task. | | |
| TC-TASK-06 | Medium | Subtask exists | 1. Check the checkbox next to a subtask. | Subtask is marked as completed (strikethrough). | | |
| TC-TASK-07 | Low | Subtask exists | 1. Click Delete on subtask. | Subtask is removed without deleting parent task. | | |
| TC-TASK-08 | High | Task exists | 1. Click Task checkbox on main list. | Task is marked completed and moved/styled accordingly. | | |
| TC-TASK-09 | Medium | Task exists | 1. Uncheck a completed Task. | Task is marked incomplete and restored to active. | | |
| TC-TASK-10 | Medium | Task exists | 1. Add a work log entry to the task. | Work log is appended with correct timestamp. | | |
| TC-TASK-11 | Low | Work log exists | 1. Delete a work log entry. | Work log is removed successfully. | | |
| TC-TASK-12 | High | Multiple Tasks | 1. Navigate to "My Tasks". | All tasks for the user are displayed. | | |

## Module: Focus Space (FOC)

| Test ID | Priority | Preconditions | Steps | Expected Result | Actual Result | Status |
|---------|----------|---------------|-------|-----------------|---------------|--------|
| TC-FOC-01 | High | Logged In | 1. Go to Focus Space. 2. Click Start Session. | Timer begins counting down from 25:00. | | |
| TC-FOC-02 | Medium | Session Active | 1. Click Pause. | Timer stops, time remaining is preserved. | | |
| TC-FOC-03 | Medium | Session Paused | 1. Click Resume. | Timer continues from the exact paused time. | | |
| TC-FOC-04 | High | Session Active | 1. Click End Session early. | Session ends, logs elapsed time to history. | | |
| TC-FOC-05 | Medium | Session Active | 1. Wait for timer to reach 00:00. | Alarm/notification plays, session auto-completes. | | |
| TC-FOC-06 | Low | Session Active | 1. Navigate to Dashboard. 2. Return to Focus. | Timer is still running accurately. | | |
| TC-FOC-07 | Medium | Logged In | 1. Open Focus History. | List of past completed/ended sessions is visible. | | |
| TC-FOC-08 | Low | No Sessions | 1. Open Focus History. | "No sessions found" empty state is displayed. | | |

## Module: AI Copilot (AI)

| Test ID | Priority | Preconditions | Steps | Expected Result | Actual Result | Status |
|---------|----------|---------------|-------|-----------------|---------------|--------|
| TC-AI-01 | High | Logged In | 1. Click Copilot Button. | Copilot Drawer slides in from the right. | | |
| TC-AI-02 | High | Copilot Open | 1. Type "Help me plan a trip". 2. Send. | AI responds with a structured task list. | | |
| TC-AI-03 | Medium | Copilot Open | 1. Send an empty prompt. | Send button disabled or empty submission ignored. | | |
| TC-AI-04 | High | AI Responded | 1. Click "Add to Tasks" on AI suggestion. | Suggested items are added to User's Task list. | | |
| TC-AI-05 | Medium | Copilot Open | 1. Click "Close" or outside the drawer. | Drawer closes smoothly. | | |
| TC-AI-06 | Low | Copilot Open | 1. Send extremely long prompt (>1000 chars). | AI handles gracefully or UI shows length error. | | |
| TC-AI-07 | High | Copilot Open | 1. Disconnect internet. 2. Send prompt. | Error message "Network error" is shown in chat. | | |

## Module: Dashboard & Analytics (DASH)

| Test ID | Priority | Preconditions | Steps | Expected Result | Actual Result | Status |
|---------|----------|---------------|-------|-----------------|---------------|--------|
| TC-DASH-01 | High | Logged In | 1. View Dashboard Home. | Overview cards (Total Tasks, Completed) load. | | |
| TC-DASH-02 | Medium | Logged In | 1. Complete a task. 2. View Dashboard. | "Completed Tasks" metric increments by 1. | | |
| TC-DASH-03 | Low | Logged In | 1. View Activity feed. | Recent task creations and completions are listed. | | |
| TC-DASH-04 | Medium | Ctrl+K pressed| 1. Press Ctrl+K. | Command Palette opens. | | |
| TC-DASH-05 | Medium | Cmd Pal. Open | 1. Type a task name. | Live search filters tasks matching the name. | | |

## Module: Profile & Settings (PROF)

| Test ID | Priority | Preconditions | Steps | Expected Result | Actual Result | Status |
|---------|----------|---------------|-------|-----------------|---------------|--------|
| TC-PROF-01 | High | Logged In | 1. Go to Settings. 2. Update Name. 3. Save. | Name updates in DB, sidebar, and top nav. | | |
| TC-PROF-02 | High | Logged In | 1. Go to Settings. 2. Update Password. | Password changes successfully, success toast shown. | | |
| TC-PROF-03 | High | Logged In | 1. Enter wrong current password during update. | Error message "Incorrect current password" shown. | | |
| TC-PROF-04 | Critical | Logged In | 1. Go to Profile. 2. Click Delete Account. 3. Confirm. | Account deleted, redirected to Login. | | |
| TC-PROF-05 | High | Account Deleted| 1. Attempt login with deleted account. | Error "Account not found" or "Invalid credentials". | | |

## Module: Navigation & Layout (NAV)

| Test ID | Priority | Preconditions | Steps | Expected Result | Actual Result | Status |
|---------|----------|---------------|-------|-----------------|---------------|--------|
| TC-NAV-01 | Medium | Desktop View | 1. Click sidebar links. | URL changes, active link styling updates. | | |
| TC-NAV-02 | High | Mobile View | 1. Click Hamburger menu. | Mobile sidebar drawer opens with animation. | | |
| TC-NAV-03 | Medium | Mobile View | 1. Click a link in mobile sidebar. | Navigates to page, mobile drawer automatically closes. | | |
| TC-NAV-04 | Low | Any View | 1. Navigate to a non-existent URL (e.g. `/abc`). | Custom 404 Not Found page is displayed. | | |
