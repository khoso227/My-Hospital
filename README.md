# 🏥 Hospital Management System

Complete Hospital Management SaaS application with React frontend and Node.js/Express backend.

## 📋 Features

- ✅ User Authentication (Login/Register) with JWT
- ✅ Role-based Access Control (Admin, Doctor, Patient)
- ✅ Patient Management (CRUD operations)
- ✅ Modern React UI with Vite
- ✅ RESTful API with Express
- ✅ MongoDB Database Integration

## 🚀 Quick Start (Localhost)

### Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - Choose one:
  - **Local MongoDB** - [Download](https://www.mongodb.com/try/download/community)
  - **MongoDB Atlas** (Cloud) - [Sign Up Free](https://www.mongodb.com/cloud/atlas)

### Step 1: Clone/Download Project

```bash
cd E:\hospital_management
```

### Step 2: Backend Setup

1. **Navigate to server folder:**

```bash
cd server
```

1. **Install dependencies:**

```bash
npm install
```

1. **Create `.env` file:**
   - Copy `.env.example` to `.env` (if exists) OR create new `.env` file
   - Add your MongoDB connection string:

**For Local MongoDB:**

```env
MONGO_URI=mongodb://127.0.0.1:27017/hospital_management
JWT_SECRET=super_secret_jwt_key_change_this
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

**For MongoDB Atlas:**

```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hospital_management?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_change_this
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

**⚠️ Important for Atlas:**

- Replace `username` and `password` with your actual Atlas credentials
- Replace `cluster0.xxxxx` with your actual cluster URL
- Make sure your Atlas IP whitelist includes `0.0.0.0/0` (or your IP) in Network Access

1. **Start backend server:**

```bash
npm run dev
```

You should see:

```text
✅ MongoDB Connected Successfully
🚀 Hospital Management System Server Started
📡 Port: 5000
🌐 URL: https://my-hospital-odec.vercel.app
```

**Test Backend:**

- Open browser: `https://my-hospital-odec.vercel.app/api/health`
- Should show: `{"status":"healthy","database":"connected"}`

### Step 3: Frontend Setup

1. **Open new terminal and navigate to client folder:**

```bash
cd E:\hospital_management\client
```

1. **Install dependencies:**

```bash
npm install
```

1. **Create `.env` file:**
   - Create `.env` file in `client` folder
   - Add:

```env
VITE_API_BASE_URL=https://my-hospital-odec.vercel.app
```

1. **Start frontend:**

```bash
npm run dev
```

You should see:

```text
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### Step 4: Create Demo Users

### Option 1: Using Frontend (Easiest)

1. Open [http://localhost:5173](http://localhost:5173)
2. Click "Register here"
3. Create accounts:
   - **Admin:** name="Admin", email="<admin@hospital.com>", password="password123", role="admin"
   - **Doctor:** name="Dr. Smith", email="<doctor@hospital.com>", password="password123", role="doctor"

### Option 2: Using Postman/Thunder Client

- **POST** <https://my-hospital-odec.vercel.app/api/auth/register>
- Body (JSON):

```json
{
  "name": "Admin User",
  "email": "admin@hospital.com",
  "password": "password123",
  "role": "admin"
}
```

### Step 5: Login & Test

1. Go to `http://localhost:5173`
2. Login with:
   - Email: `admin@hospital.com`
   - Password: `password123`
3. You should be redirected to Dashboard!

## 📁 Project Structure

```text
hospital_management/
├── server/                 # Backend (Node.js/Express)
│   ├── src/
│   │   ├── config/        # Database config
│   │   ├── controllers/   # Route controllers
│   │   ├── middlewares/   # Auth & error middlewares
│   │   ├── models/        # MongoDB models
│   │   └── routes/        # API routes
│   ├── index.js           # Server entry point
│   └── package.json
│
├── client/                # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── utils/        # API utilities
│   │   └── App.jsx       # Main app component
│   └── package.json
│
└── README.md
```

## 🔧 Troubleshooting

### MongoDB Connection Failed

**Error:** `"database":"disconnected"`

**Solutions:**

1. **Check MongoDB is running:**
   - Local: Make sure MongoDB service is started
   - Atlas: Check Network Access allows your IP

2. **Verify `.env` file:**
   - Make sure `MONGO_URI` is correct
   - No extra spaces or quotes
   - For Atlas: Password should NOT have `< >` brackets

3. **Check connection string format:**
   - Local: `mongodb://127.0.0.1:27017/hospital_management`
   - Atlas: `mongodb+srv://user:pass@cluster.mongodb.net/hospital_management?retryWrites=true&w=majority`

4. **Restart backend server** after changing `.env`

### Frontend Can't Connect to Backend

**Error:** `Network Error` or `CORS Error`

**Solutions:**

1. Make sure backend is running on port 5000
2. Check `client/.env` has: `VITE_API_BASE_URL=https://my-hospital-odec.vercel.app`
3. Restart frontend after changing `.env`

## 🚀 Deployment (Make it Live)

### Backend Deployment (Heroku)

1. **Create Heroku Account:**
   - Go to [heroku.com](https://heroku.com) and sign up

2. **Install Heroku CLI:**

   ```bash
   npm install -g heroku
   heroku login
   ```

3. **Deploy Backend:**

   ```bash
   cd server
   heroku create your-app-name-backend
   heroku config:set MONGO_URI=your_mongodb_atlas_uri
   heroku config:set JWT_SECRET=your_secure_jwt_secret
   heroku config:set NODE_ENV=production
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

4. **Get Backend URL:**
   - After deployment: `heroku apps:info`
   - Note the URL (e.g., `https://your-app-name-backend.herokuapp.com`)

### Frontend Deployment (Vercel)

1. **Create Vercel Account:**
   - Go to [vercel.com](https://vercel.com) and sign up

2. **Install Vercel CLI:**

   ```bash
   npm install -g vercel
   vercel login
   ```

3. **Deploy Frontend:**

   ```bash
   cd client
   vercel --prod
   ```

4. **Set Environment Variables in Vercel:**
   - Go to Vercel dashboard > Your project > Settings > Environment Variables
   - Add: `VITE_API_BASE_URL=https://your-app-name-backend.herokuapp.com`

5. **Redeploy Frontend:**

   ```bash
   vercel --prod
   ```

### Alternative: Deploy Both on Railway

1. **Create Railway Account:** [railway.app](https://railway.app)

2. **Deploy Full Stack:**
   - Connect GitHub repo
   - Railway auto-detects and deploys both frontend and backend
   - Set environment variables in Railway dashboard

## 📊 Production Checklist

- [ ] Change JWT_SECRET to a strong, random key
- [ ] Use MongoDB Atlas (not local MongoDB)
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS (automatic on Heroku/Vercel)
- [ ] Test all features in production
- [ ] Monitor logs for errors
- [ ] Check browser console for exact error

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:**

- Change `PORT` in `server/.env` to different port (e.g., `5001`)
- Update `client/.env` `VITE_API_BASE_URL` accordingly

## 🌐 Deploy to Live Domain

### Backend Deployment (Render/Railway)

1. **Push code to GitHub**
2. **Sign up on [Render.com](https://render.com)**
3. **Create New Web Service:**
   - Connect GitHub repo
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables:

     ```env
     MONGO_URI=your_atlas_connection_string
     JWT_SECRET=strong_random_secret
     CLIENT_ORIGIN=https://your-frontend-url.netlify.app
     NODE_ENV=production
     ```

4. **Deploy** - You'll get backend URL like: `https://hospital-backend.onrender.com`

### Frontend Deployment (Netlify/Vercel)

1. **Update `client/.env`:**

   ```env
   VITE_API_BASE_URL=https://hospital-backend.onrender.com
   ```

2. **Build frontend:**

   ```bash
   cd client
   npm run build
   ```

3. **Deploy to Netlify:**
   - Go to [Netlify](https://netlify.com)
   - Drag & drop `client/dist` folder OR connect GitHub
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment Variable: `VITE_API_BASE_URL=https://your-backend-url`

4. **Update Backend CORS:**
   - In Render dashboard, update `CLIENT_ORIGIN` to your Netlify URL
   - Redeploy backend

### Custom Domain Setup

1. **Buy domain** (Namecheap/GoDaddy)
2. **In Netlify/Vercel:**
   - Add custom domain
   - Follow DNS instructions (nameservers or CNAME)
3. **Update backend `CLIENT_ORIGIN`** to your custom domain
4. **Wait for DNS propagation** (5-30 minutes)

## 📝 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth` - Get all users (admin only)

### Patients

- `GET /api/patients` - Get all patients (admin only)
- `POST /api/patients` - Create patient (authenticated)
- `GET /api/patients/:id` - Get patient by ID
- `PUT /api/patients/:id` - Update patient

### Health Check

- `GET /api/health` - Server health status

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, React Router, Axios, React Toastify
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt
- **Database:** MongoDB / MongoDB Atlas

## 📄 License

This project is open source and available for educational purposes.

## 💡 Support

If you face any issues:

1. Check MongoDB connection
2. Verify `.env` files are correct
3. Check console logs for errors
4. Make sure all dependencies are installed

---

Made with ❤️ for Hospital Management
