# Smoke Test Checklist - Planora_AI

This smoke test checklist is prepared to verify the basic build health of the Planora_AI application. These represent critical happy paths; if any test case in this checklist fails, the build will be rejected from further testing.

## Checklist

| ID | Module | Scenario | Expected Result | Status |
|----|--------|----------|-----------------|--------|
| SMK-01 | Auth | User can log in with valid credentials | Redirected to Dashboard | `[ ]` |
| SMK-02 | Auth | User can register a new account | Account created, redirected to Dashboard | `[ ]` |
| SMK-03 | Auth | User can log out | Redirected to Login page | `[ ]` |
| SMK-04 | Tasks | User can create a new task | Task appears in the task list immediately | `[ ]` |
| SMK-05 | Tasks | User can view their task list | Tasks load without infinite spinners | `[ ]` |
| SMK-06 | Focus | User can start a Focus (Pomodoro) session | Timer begins counting down | `[ ]` |
| SMK-07 | AI | User can open Copilot drawer | Drawer opens and UI loads | `[ ]` |
| SMK-08 | Profile| User can access settings page | Settings page renders correctly | `[ ]` |
| SMK-09 | System| Global search (Ctrl+K) opens command palette | Palette opens | `[ ]` |
