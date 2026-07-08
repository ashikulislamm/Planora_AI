# Exploratory Testing Charter

Exploratory testing is unscripted testing designed to uncover edge cases, race conditions, and UX issues that structured scripts might miss.

## 1. Random Interaction Testing
- Rapidly click "Create Task" multiple times before the modal closes.
- Mash the keyboard in the AI Copilot prompt area and submit.
- Rapidly toggle task completion checkboxes.
- Start and stop the Focus timer in quick succession.

## 2. Browser & Environment Manipulation
- **Multiple Tabs**: Open Planora_AI in two tabs. Create a task in Tab 1, check if Tab 2 updates (requires refresh or sockets).
- **Refresh**: Hard refresh (Ctrl+F5) on various pages (Dashboard, Settings, Focus). Verify state retention.
- **Offline Mode**: Turn off network connection via DevTools while Focus timer is running. Turn network back on and try to end session.
- **Back Button**: Use the browser back/forward buttons repeatedly through nested task views.

## 3. Data Integrity & Boundary Testing
- **Long Inputs**: Enter a 5000-character string into the Task Description.
- **Special Characters**: Enter emojis, HTML tags (`<script>alert(1)</script>`), and SQL injection strings into Task Titles and Profile names.
- **Empty States**: Delete all tasks. Verify the UI handles the 0-task empty state gracefully without console errors.

## 4. UI/UX Stress
- Zoom the browser to 200%. Verify that modals and command palettes remain usable.
- Resize the browser window continuously from Desktop to Mobile width while a modal is open.
