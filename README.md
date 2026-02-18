# KLE-BK Connect – Event Management Portal

A full-stack event management portal for colleges, facilitating event creation, student registration, and certificate generation.

## 🚀 Deployment Guide

### Prerequisites
- GitHub Account
- [Render](https://render.com) Account (for Backend)
- [Vercel](https://vercel.com) Account (for Frontend)
- [Railway](https://railway.app) Account (for MySQL Database)

### 1. Database Setup (Railway)
1. Create a new project on Railway and select **MySQL**.
2. Once deployed, go to the **Variables** tab to get your connection details:
   - `MYSQLHOST`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`
   - `MYSQLPORT`
3. Connect to the database using a tool like MySQL Workbench or DBeaver and run the `backend/database.sql` script to initialize tables.

### 2. Backend Deployment (Render)
1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. **Environment Variables**:
   Add the following variables in the Render dashboard:
   - `PORT`: `5000`
   - `DB_HOST`: (From Railway)
   - `DB_USER`: (From Railway)
   - `DB_PASSWORD`: (From Railway)
   - `DB_NAME`: (From Railway)
   - `JWT_SECRET`: (Generate a strong secret)
   - `FRONTEND_URL`: (Your Vercel URL, e.g., `https://your-app.vercel.app`)

### 3. Frontend Deployment (Vercel)
1. Create a new project on Vercel.
2. Connect your GitHub repository.
3. Settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables**:
   Add the following variable in the Vercel dashboard:
   - `VITE_API_URL`: (Your Render Backend URL + `/api`, e.g., `https://your-api.onrender.com/api`)

### 4. Final Steps
1. Redeploy both services if entered env vars after build.
2. Verify that the frontend can communicate with the backend.
3. Test user registration, login, and event dashboard.

## 📂 Project Structure
- `frontend/`: React + Vite application
- `backend/`: Node.js + Express API
- `backend/config/db.js`: Database connection configuration
- `backend/server.js`: Server entry point

## 🛠 Tech Stack
- **Frontend**: React, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js
- **Database**: MySQL
