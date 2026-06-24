# 📋 Fullstack Task Manager

A modern, production-grade, and secure fullstack Task Manager application. This repository is structured as a monorepo containing both the frontend client and the backend server.

---

## ⚡ Tech Stack

| Component | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS, Framer Motion, Axios, React Hook Form, Zod |
| **Backend** | Node.js, Express.js, MongoDB (Mongoose ODM), JWT, Helmet, CORS |

---

## 📁 Repository Structure

```text
Task-Manager/
├── backend/            # Express.js REST API
│   ├── src/            # Layered MVC code (controllers, routes, services, models)
│   └── .env.example    # Backend environment variables template
├── frontend/           # Next.js Frontend Web Application
│   ├── app/            # App Router pages and layouts
│   ├── components/     # UI design system and reusable components
│   └── .env.example    # Frontend environment variables template
└── README.md           # Project documentation (this file)
```

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
- **Node.js** (v20+ recommended)
- **MongoDB** (Local instance or MongoDB Atlas account)

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables. Copy `.env.example` to `.env` and fill in the values:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=your_jwt_secret_here
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```
4. Start the development server (uses auto-reload):
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables. Copy `.env.example` to `.env.local` and set your backend URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```
4. Start the frontend application:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Production Deployment Configs

When deploying this project to live environments (e.g., **Vercel** for the frontend and **Render** for the backend):

### 1. Render (Backend Web Service)
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `NODE_ENV`: `production`
  - `CLIENT_URL`: `https://your-frontend-app.vercel.app` (your Vercel live URL, no trailing slash)
  - `MONGODB_URI`: `mongodb+srv://...` (your Atlas production connection string)
  - `JWT_SECRET`: A long secure secret key

### 2. Vercel (Frontend Next.js App)
- **Framework Preset**: Next.js
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL`: `https://your-backend-app.onrender.com/api` (your backend Render API URL, no trailing slash)
  - *Note*: Ensure you trigger a new Vercel deployment/build after adding this variable to bake it into the client-side bundle.

---

## 📡 API Documentation

All backend routes (except health checks) are prefixed with `/api`.

### Response Formats

* **Success Response (`200 OK` / `201 Created`)**
  ```json
  {
    "success": true,
    "message": "Operation description",
    "data": {}
  }
  ```

* **Error Response (`4xx` / `5xx`)**
  ```json
  {
    "success": false,
    "message": "Error description",
    "errors": [] // Optional detailed array (e.g. Zod validation errors)
  }
  ```

---

### Authentication Endpoints

#### **Register User**
- **Route**: `POST /api/auth/register`
- **Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  ```
- **Response**: `201 Created` (Sets HTTP-only JWT `token` cookie & returns `{ success, message, data: { user, token } }`)

#### **Login User**
- **Route**: `POST /api/auth/login`
- **Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  ```
- **Response**: `200 OK` (Sets HTTP-only JWT `token` cookie & returns `{ success, message, data: { user, token } }`)

#### **Logout User**
- **Route**: `POST /api/auth/logout`
- **Response**: `200 OK` (Clears JWT `token` cookie)

#### **Get Profile (Me)**
- **Route**: `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <JWT>` or JWT `token` cookie
- **Response**: `200 OK` (Returns authenticated user profile)

---

### Task Endpoints

*All task endpoints require authentication.*

#### **Create Task**
- **Route**: `POST /api/tasks`
- **Body**:
  ```json
  {
    "title": "Build UI Components",
    "description": "Create reusable buttons, forms, and cards",
    "status": "todo" // Optional. Defaults to "todo"
  }
  ```
- **Response**: `201 Created`

#### **Get All Tasks**
- **Route**: `GET /api/tasks`
- **Response**: `200 OK` (Returns only tasks belonging to the logged-in user)

#### **Get Single Task**
- **Route**: `GET /api/tasks/:id`
- **Response**: `200 OK` (Returns task details. Returns `403` if belonging to another user)

#### **Update Task**
- **Route**: `PATCH /api/tasks/:id`
- **Body** (All fields optional):
  ```json
  {
    "title": "Updated Title",
    "description": "Updated Description",
    "status": "in-progress" // "todo" | "in-progress" | "done"
  }
  ```
- **Response**: `200 OK`

#### **Delete Task**
- **Route**: `DELETE /api/tasks/:id`
- **Response**: `200 OK`
