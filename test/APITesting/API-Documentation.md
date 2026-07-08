# Planora_AI API Documentation

This document outlines the available REST API endpoints for Planora_AI. You can use these specifications to configure your Postman requests manually.

**Base URL**: `http://localhost:5000/api` *(Default local setup)*

**Authentication**: Most endpoints require a Bearer token in the `Authorization` header.
- Header format: `Authorization: Bearer <your_jwt_token>`

**CSRF Protection**: 
By default, the backend enforces Anti-CSRF protection (`X-CSRF-Token` header) for mutating requests (`POST`, `PATCH`, `DELETE`). 
> **Important Bypass**: If you authenticate your API requests using the `Authorization: Bearer <token>` header (as opposed to relying solely on browser cookies), the backend automatically **bypasses** the CSRF check. For testing in Postman, always ensure you are sending the Bearer token in the Authorization tab to avoid CSRF errors.

---

## 1. Authentication Endpoints (`/auth`)

### 1.1 Register User
- **Method**: `POST`
- **Endpoint**: `/auth/register`
- **Auth Required**: No
- **Payload**:
  ```json
  {
    "name": "John Doe",      // String, 2-50 chars
    "email": "user@example.com", // String, valid email
    "password": "securepassword123" // String, 6-100 chars
  }
  ```

### 1.2 Login User
- **Method**: `POST`
- **Endpoint**: `/auth/login`
- **Auth Required**: No
- **Payload**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123" 
  }
  ```
- **Response**: Returns the JWT token to be used in subsequent requests.

### 1.3 Get Current User
- **Method**: `GET`
- **Endpoint**: `/auth/me`
- **Auth Required**: Yes

### 1.4 Update Profile
- **Method**: `PATCH`
- **Endpoint**: `/auth/profile`
- **Auth Required**: Yes
- **Payload** (Requires at least one field):
  ```json
  {
    "name": "New Name",     // Optional
    "email": "new@example.com" // Optional
  }
  ```

### 1.5 Update Password
- **Method**: `PATCH`
- **Endpoint**: `/auth/password`
- **Auth Required**: Yes
- **Payload**:
  ```json
  {
    "currentPassword": "oldpassword123", 
    "newPassword": "newsecurepassword123" // String, min 6 chars
  }
  ```

### 1.6 Logout
- **Method**: `POST`
- **Endpoint**: `/auth/logout`
- **Auth Required**: Yes (or session based)

### 1.7 Refresh Token
- **Method**: `POST`
- **Endpoint**: `/auth/refresh`
- **Auth Required**: Yes (using refresh token logic/cookie)

### 1.8 Delete Account
- **Method**: `DELETE`
- **Endpoint**: `/auth/delete`
- **Auth Required**: Yes

---

## 2. Task Endpoints (`/tasks`)

### 2.1 Get All Tasks
- **Method**: `GET`
- **Endpoint**: `/tasks`
- **Auth Required**: Yes
- **Query Parameters**:
  - `status`: 'todo', 'in-progress', 'completed'
  - `priority`: 'low', 'medium', 'high', 'critical'
  - `category`: 'work', 'personal', 'study', 'health'
  - `overdue`: 'true' or 'false'
  - `sort`: 'dueDate', '-dueDate', 'priority', etc.
  - `page`: default 1
  - `limit`: default 20

### 2.2 Create Task
- **Method**: `POST`
- **Endpoint**: `/tasks`
- **Auth Required**: Yes
- **Payload**:
  ```json
  {
    "title": "Finish Report",    // Required, 1-100 chars
    "description": "Annual report details", // Required
    "status": "todo",            // Optional
    "priority": "high",          // Optional
    "category": "work",          // Optional
    "dueDate": "2024-12-31",     // Optional (ISO string)
    "isRecurring": false         // Optional
  }
  ```

### 2.3 Get Task by ID
- **Method**: `GET`
- **Endpoint**: `/tasks/:id`
- **Auth Required**: Yes

### 2.4 Update Task
- **Method**: `PATCH`
- **Endpoint**: `/tasks/:id`
- **Auth Required**: Yes
- **Payload**: Partial schema of Create Task.

### 2.5 Delete Task
- **Method**: `DELETE`
- **Endpoint**: `/tasks/:id`
- **Auth Required**: Yes

### 2.6 Add Work Log
- **Method**: `POST`
- **Endpoint**: `/tasks/:taskId/logs`
- **Auth Required**: Yes
- **Payload**:
  ```json
  {
    "content": "Worked on the intro for 2 hours." // 1-500 chars
  }
  ```

### 2.7 Create Subtask
- **Method**: `POST`
- **Endpoint**: `/tasks/:taskId/subtasks`
- **Auth Required**: Yes
- **Payload**:
  ```json
  {
    "title": "Subtask Name",  // Required, 1-100 chars
    "dueDate": "2024-12-31"   // Optional
  }
  ```

### 2.8 Update Subtask Status
- **Method**: `PATCH`
- **Endpoint**: `/tasks/:taskId/subtasks/:subtaskId/toggle`
- **Auth Required**: Yes

---

## 3. Focus Space Endpoints (`/focus`)

### 3.1 Start Session
- **Method**: `POST`
- **Endpoint**: `/focus/start`
- **Auth Required**: Yes
- **Payload**:
  ```json
  {
    "taskId": "65bfa...", // Required (24-char MongoDB hex string)
    "duration": 25        // Required (positive number in minutes)
  }
  ```

### 3.2 End Session
- **Method**: `POST`
- **Endpoint**: `/focus/end`
- **Auth Required**: Yes
- **Payload**:
  ```json
  {
    "status": "completed" // or "cancelled"
  }
  ```

### 3.3 Get Current Session
- **Method**: `GET`
- **Endpoint**: `/focus/current`
- **Auth Required**: Yes

### 3.4 Get Session History
- **Method**: `GET`
- **Endpoint**: `/focus/history`
- **Auth Required**: Yes

---

## 4. AI Copilot Endpoints (`/ai`)

### 4.1 Copilot Task Generation
- **Method**: `POST`
- **Endpoint**: `/ai/copilot/task-preview`
- **Auth Required**: Yes
- **Payload**:
  ```json
  {
    "prompt": "Break down writing a blog post"
  }
  ```

### 4.2 Save Copilot Task
- **Method**: `POST`
- **Endpoint**: `/ai/copilot/task-create`
- **Auth Required**: Yes
- *(Payload contains the structured task array returned by task-preview)*

---

## 5. Analytics & Activity

### 5.1 Dashboard Overview
- **Method**: `GET`
- **Endpoint**: `/analytics/overview`
- **Auth Required**: Yes

### 5.2 User Activities
- **Method**: `GET`
- **Endpoint**: `/activities`
- **Auth Required**: Yes
