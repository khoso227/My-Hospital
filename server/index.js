require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

// ========== 1. MIDDLEWARE ==========
app.use(cors({
    // Yahan localhost ke saath apna Vercel frontend link bhi dalien
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://my-hospital-sooty.vercel.app'], 
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== 2. DATABASE CONNECTION ==========
const mongoURI = process.env.MONGO_URI;

if (mongoURI) {
    mongoose.connect(mongoURI)
      .then(() => console.log('✅ MongoDB Connected Successfully'))
      .catch(err => console.error('❌ MongoDB Connection Error:', err.message));
}

// ========== 3. SOCKET.IO SETUP (Note: Won't work on Vercel) ==========
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('⚡ User Connected:', socket.id);
  socket.on('new_patient', (data) => {
    io.emit('notify_doctor', data);
  });
});

// ========== 4. API ROUTES ==========
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/dashboard', require('./src/routes/dashboardRoutes'));
app.use('/api/settings', require('./src/routes/settingsRoutes'));
app.use('/api/staff', require('./src/routes/staffRoutes'));
app.use('/api/patients', require('./src/routes/patientRoutes'));
app.use('/api/doctors', require('./src/routes/doctorRoutes'));
app.use('/api/pharmacy', require('./src/routes/pharmacyRoutes'));
app.use('/api/medicines', require('./src/routes/medicineRoutes'));
app.use('/api/labs', require('./src/routes/labRoutes'));
app.use('/api/billing', require('./src/routes/billingRoutes'));

// ========== 5. BASIC ROUTES ==========
app.get('/', (req, res) => {
  res.json({ success: true, message: '🏥 Hospital API is Live' });
});

// ========== 6. ERROR HANDLING ==========
const errorHandler = require('./src/middlewares/errorMiddleware');
app.use(errorHandler);

// ========== 7. EXPORT FOR VERCEL ==========
// Vercel serverless functions ke liye listen ko wrap karna parta hai
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

module.exports = app; // Ye line sabse zaroori hai Vercel ke liye
