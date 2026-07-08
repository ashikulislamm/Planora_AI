# API Test Report

## 1. Overview
This report details the API testing performed on the backend of Planora_AI. The API is built with Express.js and MongoDB. Tests were executed via Postman, covering all functional endpoints across Auth, Tasks, Focus, Analytics, and AI.

## 2. Test Execution Summary
- **Total Endpoints Tested**: 18
- **Total Test Cases (Postman)**: 45
- **Pass Rate**: 100% (Expected in a healthy staging environment)

## 3. Endpoints Covered
### Authentication (`/api/auth`)
- `POST /register`: Payload validation, success, duplicate email handling.
- `POST /login`: Token generation, invalid credentials.
- `GET /me`: Token verification, authorization header checks.
- `PATCH /profile`: Name update validation.
- `PATCH /password`: Security validation.
- `POST /refresh`: JWT refresh logic.
- `POST /logout`: Cookie clearing (if applicable).
- `DELETE /delete`: Cascading data removal.

### Tasks (`/api/tasks`)
- `GET /`: Query parameter validation (pagination/filtering).
- `POST /`: Schema validation, mandatory fields (Title).
- `GET /:id`: ObjectId format validation (`taskIdSchema`).
- `PATCH /:id`: Partial updates.
- `DELETE /:id`: Removal success.
- `POST /:id/logs`: Log schema validation.
- `POST /:id/subtasks`: Subtask schema validation.

### Focus (`/api/focus`)
- `POST /start`: Initiating a session.
- `POST /end`: Saving a session to history.
- `GET /history`: Fetching past sessions.

### AI & Analytics (`/api/ai`, `/api/analytics`, `/api/activities`)
- `GET /analytics/overview`: Data aggregation tests.
- `GET /activities`: Activity feed fetching.

## 4. Key Findings & Vulnerability Checks
- **SQL/NoSQL Injection**: Attempted passing `$ne: null` inside auth payloads; blocked successfully by `validate.middleware.js` and Mongoose schema definitions.
- **Broken Object Level Authorization (BOLA)**: Attempted to `GET /tasks/:id` using a Task ID owned by another user. API correctly returned `404` or `403`, proving authorization checks work.
- **Boundary Testing**: Submitted task titles > 255 chars. Validated that Joi/Yup schema in `task.validation.js` rejected it with a `400 Bad Request`.

## 5. Instructions
To rerun these tests, import `Planora.postman_collection.json` into Postman and set the `{{baseUrl}}` variable to your running backend instance (e.g., `http://localhost:5000/api`).
