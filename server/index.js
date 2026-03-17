require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http'); // Required for Socket.io
const { Server } = require('socket.io'); // Socket.io Integration

const app = express();

// ========== 1. MIDDLEWARE ==========
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], 
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== 2. DATABASE CONNECTION ==========
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hospital_management';

mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1); 
  });

// ========== 3. SOCKET.IO SETUP ==========
const server = http.createServer(app); // Create HTTP server using Express app
const io = new Server(server, {
  cors: {
    origin: "*", // Testing ke liye all allowed, production mein frontend URL dein
    methods: ["GET", "POST"]
  }
});

// Real-time Event Handling
io.on('connection', (socket) => {
  console.log('⚡ User Connected to Socket:', socket.id);

  // Jab reception se naya patient register ho
  socket.on('new_patient', (data) => {
    console.log('📢 New Patient Notification:', data);
    io.emit('notify_doctor', data); // Saare connected doctors/nurses ko alert bhej do
  });

  socket.on('disconnect', () => {
    console.log('❌ User Disconnected from Socket');
  });
});

// ========== 4. API ROUTES ==========

// Auth & Roles
app.use('/api/auth', require('./src/routes/authRoutes'));

// Stats & Settings
app.use('/api/dashboard', require('./src/routes/dashboardRoutes'));
app.use('/api/settings', require('./src/routes/settingsRoutes'));

// Management (Staff, Patients, Doctors)
app.use('/api/staff', require('./src/routes/staffRoutes'));
app.use('/api/patients', require('./src/routes/patientRoutes'));
app.use('/api/doctors', require('./src/routes/doctorRoutes'));

// Medical & Inventory
app.use('/api/pharmacy', require('./src/routes/pharmacyRoutes'));
app.use('/api/medicines', require('./src/routes/medicineRoutes'));

// Diagnostics
app.use('/api/labs', require('./src/routes/labRoutes'));
app.use('/api/billing', require('./src/routes/billingRoutes'));

// ========== 5. BASIC & HEALTH ROUTES ==========
app.get('/', (req, res) => {
  res.json({ success: true, message: '🏥 Hospital Management System API is Live' });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    socket: "active"
  });
});

// ========== 6. ERROR HANDLING ==========
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const errorHandler = require('./src/middlewares/errorMiddleware');
app.use(errorHandler);

// ========== 7. START SERVER (Using server.listen for Socket support) ==========
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('-------------------------------------------');
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Real-time Notifications: Active`);
  console.log('-------------------------------------------');
});