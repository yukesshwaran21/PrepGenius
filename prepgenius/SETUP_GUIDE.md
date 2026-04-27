# 🚀 PrepGenius Setup Guide - PAGE 1 AUTH COMPLETE

## ✅ What We've Built (AUTH - Page 1)

### Backend ✓
- **Express Server** with CORS enabled
- **Prisma ORM** with PostgreSQL schema
- **Authentication Routes**: `/api/auth/register`, `/api/auth/login`, `/api/auth/profile`
- **JWT Tokens** for secure authentication
- **Bcrypt** password hashing
- **Middleware** for protecting routes

### Frontend ✓
- **React Router** for page navigation
- **Tailwind CSS** for styling
- **Axios** with interceptors for API calls
- **Login Page** - Professional UI with form validation
- **Signup Page** - Registration with confirmation
- **Dashboard** - Protected page with user info
- **PrivateRoute** component for route protection

### Database Schema ✓
- Users table with encrypted passwords
- Resume table structure
- Interview table structure
- Questions & Answers tables

---

## 🔧 SETUP INSTRUCTIONS

### 1️⃣ Install Backend Dependencies
```bash
cd backend
npm install
```

### 2️⃣ Install Frontend Dependencies
```bash
# From root directory
npm install
```

### 3️⃣ Setup PostgreSQL Database

**Option A: Local PostgreSQL (Recommended for Development)**
```bash
# Windows: Download from https://www.postgresql.org/download/windows/
# macOS: brew install postgresql
# Linux: sudo apt-get install postgresql

# Create database
createdb prepgenius

# Update backend/.env with your connection string:
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/prepgenius"
```

**Option B: NeonDB (Cloud PostgreSQL - FREE)**
1. Go to https://neon.tech/
2. Create account and get connection string
3. Copy to `backend/.env`:
   ```
   DATABASE_URL="postgresql://user:password@ep-xxxxx.neon.tech/prepgenius"
   ```

### 4️⃣ Initialize Database (Prisma)
```bash
cd backend
npx prisma migrate dev --name init
# This will:
# - Create all tables
# - Generate Prisma client
```

### 5️⃣ Start Backend Server
```bash
cd backend
npm run dev
# Server will run on http://localhost:5000
```

### 6️⃣ Start Frontend (in new terminal)
```bash
# From root directory
npm start
# Frontend will run on http://localhost:3000
```

---

## ✨ TEST THE AUTH FLOW

### Test Signup
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Enter: Name, Email, Password (min 6 chars)
4. Click "Sign Up"
5. ✅ Should redirect to Dashboard

### Test Login
1. Go to http://localhost:3000/login
2. Enter credentials from signup
3. Click "Login"
4. ✅ Should redirect to Dashboard

### Test Protected Route
1. Try accessing http://localhost:3000/dashboard without login
2. ✅ Should redirect to login

### Test Logout
1. Click "Logout" button on Dashboard
2. ✅ Should redirect to login & clear token

---

## 📦 Project Structure

```
PrepGenius/
├── frontend (React)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   └── Dashboard.js
│   │   ├── components/
│   │   │   └── PrivateRoute.js
│   │   ├── services/
│   │   │   └── api.js (Axios config)
│   │   ├── App.js (Router setup)
│   │   └── index.css (Tailwind)
│   ├── tailwind.config.js
│   ├── .env
│   └── package.json
│
├── backend (Express)
│   ├── src/
│   │   ├── controllers/
│   │   │   └── authController.js
│   │   ├── routes/
│   │   │   └── auth.js
│   │   ├── middleware/
│   │   │   └── auth.js (JWT verification)
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   └── password.js
│   │   └── server.js (Express app)
│   ├── prisma/
│   │   └── schema.prisma
│   ├── .env
│   └── package.json
```

---

## 🔑 Key Files to Know

| File | Purpose |
|------|---------|
| `backend/prisma/schema.prisma` | Database schema definition |
| `backend/src/controllers/authController.js` | Register/Login logic |
| `src/services/api.js` | Axios API calls & interceptors |
| `src/pages/Login.js` | Login UI component |
| `src/pages/Signup.js` | Signup UI component |
| `src/components/PrivateRoute.js` | Route protection logic |

---

## 🐛 Troubleshooting

### "Cannot connect to database"
- Verify PostgreSQL is running: `psql -U postgres`
- Check DATABASE_URL in `.env`
- Try: `npx prisma db push` to sync schema

### "API returns 404"
- Ensure backend is running: http://localhost:5000/api/health
- Check REACT_APP_API_URL in frontend `.env`

### "Login button doesn't work"
- Open DevTools (F12) → Network tab
- Check if request reaches backend
- Look for error in backend terminal

### "Port 5000 already in use"
- Change PORT in backend/.env
- Update REACT_APP_API_URL in frontend

---

## 🎯 NEXT STEPS (When Ready)

### PAGE 2: Resume Analyzer
- Add resume upload API
- Integrate with OpenAI for analysis
- Build resume upload UI
- Display AI feedback

Follow the same structure:
1. Design UI
2. Identify backend needs
3. Build backend API + DB
4. Connect frontend
5. Test fully

---

## 💡 REMEMBER

- **Auth tokens** are stored in `localStorage`
- **JWT expires** in 7 days
- **Passwords** are hashed with bcrypt
- **API calls** automatically include JWT in headers
- **Protected routes** redirect to login if no token

🎉 **Auth Page is COMPLETE!** Ready to move to Page 2?
