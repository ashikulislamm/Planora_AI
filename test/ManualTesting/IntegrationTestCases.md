# Integration Test Cases

Integration tests focus on validating workflows across multiple modules and layers of the application.

## Workflow 1: Account Lifecycle
1. **Precondition**: None.
2. **Steps**:
   - Register a new account.
   - Assert automatic login and redirection to Dashboard.
   - Navigate to Settings and update the user's name.
   - Log out.
   - Log back in with the new credentials.
3. **Expected**: Entire flow completes without session errors; updated name persists on the dashboard.

## Workflow 2: Task to Focus Execution
1. **Precondition**: Logged in.
2. **Steps**:
   - Create a new task "Prepare Presentation".
   - Navigate to Focus Space.
   - Select the newly created task (if linked) or just start a session.
   - Wait 1 minute.
   - End the session.
   - Navigate back to the Task list.
3. **Expected**: The task exists. The Focus history shows the completed 1-minute session.

## Workflow 3: AI to Task Conversion
1. **Precondition**: Logged in.
2. **Steps**:
   - Open Copilot.
   - Ask "Help me plan a marketing campaign".
   - Use the AI response to generate a task or project structure.
   - Close Copilot.
   - Navigate to My Tasks.
3. **Expected**: The tasks suggested by the AI are now fully populated in the user's real task list.

## Workflow 4: Multi-device Session (Security)
1. **Precondition**: Logged in.
2. **Steps**:
   - Log in on Browser A.
   - Log in on Browser B with the same account.
   - Change the password on Browser A.
   - Attempt to create a task on Browser B.
3. **Expected**: Browser B receives an authentication error (401) and forces the user to log out.
