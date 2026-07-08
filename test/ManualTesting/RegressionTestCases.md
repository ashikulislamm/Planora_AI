# Regression Test Cases

Regression testing ensures that new changes have not broken existing, stable functionality.

## Core Regression Scenarios

### Authentication
- [ ] **REG-AUTH-01**: Verify login with case-insensitive emails.
- [ ] **REG-AUTH-02**: Verify that expired JWT tokens automatically log the user out if refresh fails.
- [ ] **REG-AUTH-03**: Verify that changing password invalidates other active sessions.

### Task Management
- [ ] **REG-TASK-01**: Create a task with maximum character limits in title and description.
- [ ] **REG-TASK-02**: Verify that completing a parent task does/doesn't affect subtasks as per business rules.
- [ ] **REG-TASK-03**: Verify task pagination or lazy loading if the user has 100+ tasks.
- [ ] **REG-TASK-04**: Verify deleting a task removes all associated subtasks and work logs.

### Focus Space
- [ ] **REG-FOC-01**: Verify timer state persists if the user navigates to the dashboard and back to the Focus page.
- [ ] **REG-FOC-02**: Verify timer pauses correctly without losing elapsed time.
- [ ] **REG-FOC-03**: Verify session history accurately logs total focused minutes after completing a session.

### AI Copilot
- [ ] **REG-AI-01**: Verify AI task generation correctly maps to task schema when saving to user's list.
- [ ] **REG-AI-02**: Verify Copilot handles network disconnect gracefully during prompt submission.

### UI & Navigation
- [ ] **REG-UI-01**: Verify sidebar navigation remains highlighted correctly based on current route.
- [ ] **REG-UI-02**: Verify responsive sidebar toggles correctly on mobile views.
