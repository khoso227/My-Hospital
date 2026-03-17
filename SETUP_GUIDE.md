# 🚀 Complete Setup Guide - Hospital Management System

## ⚡ Quick Setup (5 Minutes)

### 1️⃣ MongoDB Setup

**Option A: MongoDB Atlas (Recommended - Free Cloud)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a free cluster (M0 - Free tier)
4. Create database user:
   - Go to **Database Access** → **Add New Database User**
   - Username: `khososarang816_db_user` (or your choice)
   - Password: Create strong password (SAVE IT!)
   - Database User Privileges: **Read and write to any database**
5. Whitelist IP:
   - Go to **Network Access** → **Add IP Address**
   - Click **Allow Access from Anywhere** (`0.0.0.0/0`) for testing
6. Get Connection String:
   - Click **Connect** on your cluster
   - Choose **Connect your application**
   - Copy connection string (looks like):
     ```
     mongodb+srv://khososarang816_db_user:<password>@cluster0.fkglegi.mongodb.net/?appName=Cluster0
     ```
   - **Replace `<password>` with your actual password**
   - **Add database name:** `hospital_management` before `?`
   - Final string:
     ```
     mongodb+srv://khososarang816_db_user:YOUR_PASSWORD@cluster0.fkglegi.mongodb.net/hospital_management?retryWrites=true&w=majority
     ```

**Option B: Local MongoDB**

1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. Connection string: `mongodb://127.0.0.1:27017/hospital_management`

---

### 2️⃣ Backend Setup

**Open Terminal/PowerShell:**

```powershell
# Navigate to project
cd E:\hospital_management\server

# Install dependencies
npm install

# Create .env file (copy this content)
```

**Create `server/.env` file:**

```env
MONGO_URI=mongodb+srv://khososarang816_db_user:YOUR_PASSWORD@cluster0.fkglegi.mongodb.net/hospital_management?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_12345
PORT=5000
CLIENT_ORIGIN=https://my-hospital-odec.vercel.app
NODE_ENV=development
```

**⚠️ IMPORTANT:** Replace `YOUR_PASSWORD` with your actual MongoDB Atlas password!

**Start Backend:**

```powershell
npm run dev
```

**✅ Success Output:**
```
✅ MongoDB Connected Successfully
🚀 Hospital Management System Server Started
📡 Port: 5000
🌐 URL: https://my-hospital-odec.vercel.app
```

**Test:** Open browser → `https://my-hospital-odec.vercel.app/api/health`
- Should show: `{"status":"healthy","database":"connected"}`

---

### 3️⃣ Frontend Setup

**Open NEW Terminal/PowerShell:**

```powershell
# Navigate to client folder
cd E:\hospital_management\client

# Install dependencies
npm install

# Create .env file
```

**Create `client/.env` file:**

```env
VITE_API_BASE_URL=https://my-hospital-odec.vercel.app
```

**Start Frontend:**

```powershell
npm run dev
```

**✅ Success Output:**
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

**Open Browser:** `http://localhost:5173`

---

### 4️⃣ Create First User (Admin)

**Method 1: Using Frontend (Easiest)**

1. Go to `http://localhost:5173`
2. Click **"Register here"** link
3. Fill form:
   - Name: `Admin User`
   - Email: `admin@hospital.com`
   - Password: `password123`
   - Role: Select **Admin**
4. Click **Register**
5. You'll be redirected to login page

**Method 2: Using Postman/Thunder Client**

- **URL:** `POST https://my-hospital-odec.vercel.app/api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
```json
{
  "name": "Admin User",
  "email": "admin@hospital.com",
  "password": "password123",
  "role": "admin"
}
```

---

### 5️⃣ Login & Test

1. Go to `http://localhost:5173`
2. Enter credentials:
   - Email: `admin@hospital.com`
   - Password: `password123`
3. Click **Login**
4. ✅ You should see Dashboard!

---

## 🔧 Common Issues & Fixes

### ❌ MongoDB Connection Failed

**Problem:** `"database":"disconnected"` in health check

**Fix:**
1. Check `.env` file has correct `MONGO_URI`
2. For Atlas: Make sure password is correct (no `< >` brackets)
3. For Atlas: Check Network Access allows `0.0.0.0/0`
4. Restart backend server

**Test Connection String Format:**
```
✅ Correct: mongodb+srv://user:pass@cluster.mongodb.net/hospital_management?retryWrites=true&w=majority
❌ Wrong: mongodb+srv://user:<password>@cluster.mongodb.net/?appName=Cluster0
```

### ❌ Frontend Can't Connect

**Problem:** `Network Error` or blank page

**Fix:**
1. Make sure backend is running (`https://my-hospital-odec.vercel.app`)
2. Check `client/.env` has: `VITE_API_BASE_URL=https://my-hospital-odec.vercel.app`
3. Restart frontend after changing `.env`
4. Check browser console (F12) for errors

### ❌ Port Already in Use

**Problem:** `Port 5000 is already in use`

**Fix:**
1. Change `PORT=5001` in `server/.env`
2. Update `client/.env`: `VITE_API_BASE_URL=http://localhost:5001`
3. Restart both servers

### ❌ Module Not Found Errors

**Problem:** `Cannot find module 'react-router-dom'`

**Fix:**
```powershell
cd client
npm install
```

---

## 📋 Checklist

- [ ] MongoDB Atlas account created OR Local MongoDB installed
- [ ] Backend `.env` file created with correct `MONGO_URI`
- [ ] Backend dependencies installed (`npm install`)
- [ ] Backend running on port 5000
- [ ] Health check shows `"database":"connected"`
- [ ] Frontend `.env` file created
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Frontend running on port 5173
- [ ] Admin user created (via register or API)
- [ ] Login successful
- [ ] Dashboard visible

---

## 🎯 Next Steps

Once everything is working:

1. **Create more users:**
   - Doctor: `doctor@hospital.com` / `password123`
   - Patient: `patient@hospital.com` / `password123`

2. **Test Patient Management:**
   - Login as admin
   - Go to Patients page
   - Add new patients

3. **Deploy to Live:**
   - Follow deployment guide in `README.md`
   - Use Render for backend
   - Use Netlify for frontend

---

## 💡 Tips

- **Always check console logs** for errors
- **Keep both terminals open** (backend + frontend)
- **Use `.env` files** - never commit them to Git
- **Test health endpoint** first before testing frontend
- **MongoDB Atlas free tier** is perfect for development

---

**Need Help?** Check `README.md` for detailed documentation.
