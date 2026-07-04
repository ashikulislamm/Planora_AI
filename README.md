<div align="center">
  <h1>Planora</h1>
  <p><b>Your Intelligent Task & Focus Workspace</b></p>
  <p>Streamline your workflow, eliminate distractions, and achieve more with AI-driven task management.</p>
</div>

---

## 🌟 Why Planora?

In a world full of distractions, **Planora** is your personal command center. It bridges the gap between traditional task management and deep work sessions by combining powerful organizational tools with an integrated Focus Space and an AI Copilot that helps you stay on track.

Whether you're a developer, designer, or creator, Planora is engineered to give you clarity and boost your productivity.

## ✨ Core Features

- **🤖 Planora Copilot (AI)**: An integrated AI assistant powered by Google GenAI that helps you break down tasks, generate ideas, and optimize your workflow.
- **🎯 Deep Focus Space**: A dedicated distraction-free environment to execute your tasks with built-in timers and progress tracking.
- **⚡ Command Palette (`Ctrl+K`)**: Navigate anywhere, create tasks, and access settings instantly without taking your hands off the keyboard.
- **📊 Activity Analytics**: Visualize your productivity with beautiful charts tracking your task completion rates and activity streaks.
- **🔐 Enterprise-Grade Security**: Secure JWT-based authentication, password hashing, and secure session management.
- **📱 Beautiful Responsive UI**: Crafted with modern, mobile-first design principles featuring a sleek sidebar, smooth animations, and a polished drawer navigation.

---

## 🛠️ Built with Modern Technologies

Planora is a production-ready monorepo combining a high-performance frontend client with a robust backend service.

| Component | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion, React Query, React Hook Form, Recharts, Zod, Axios |
| **Backend** | Node.js, Express.js v5, MongoDB (Mongoose), JWT, Google GenAI, Helmet, CORS, Winston, Morgan |

---

## 🚀 Get Started

Experience Planora locally in just a few minutes.

### Prerequisites
- **Node.js** (v20+ recommended)
- **MongoDB** (Local instance or MongoDB Atlas account)

### 1. Backend Setup
```bash
cd backend
npm install
```
Configure your environment in `backend/.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/planora
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
Start the server:
```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```
Configure your environment in `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```
Start the client application:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser and start achieving your goals!

---

## 🌐 Production Deployment Configs

Planora is ready for scale. When deploying to live environments (e.g., **Vercel** for the frontend and **Render** for the backend):

### 1. Render (Backend Web Service)
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `NODE_ENV`: `production`
  - `CLIENT_URL`: `https://your-planora-app.vercel.app` (no trailing slash)
  - `MONGODB_URI`: `mongodb+srv://...` (Atlas production string)
  - `JWT_SECRET`: A long secure secret key

### 2. Vercel (Frontend Next.js App)
- **Framework Preset**: Next.js
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL`: `https://your-planora-backend.onrender.com/api` (no trailing slash)

---

## 📡 API Documentation

Planora provides a structured, secure REST API. All routes are prefixed with `/api`.

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
    "errors": [] // Detailed validation errors
  }
  ```

*See the `backend/src/routes` directory for the full suite of Authentication, Task, Analytics, and AI Copilot endpoints.*
