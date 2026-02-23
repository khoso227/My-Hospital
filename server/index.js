require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// ========== 1. MIDDLEWARE ==========
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], 
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== 2. DATABASE CONNECTION (Local MongoDB) ==========
// Localhost par database connection
const mongoURI = 'mongodb://127.0.0.1:27017/hospital_management';

mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB Connected Locally: hospital_management'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('💡 Tip: Make sure MongoDB Compass / Service is running on your PC.');
  });

// ========== 3. API ROUTES ==========

// Auth Routes (Login, Register, Recovery)
app.use('/api/auth', require('./src/routes/authRoutes'));

// Dashboard Stats Route (Analytics & Charts)
app.use('/api/dashboard', require('./src/routes/dashboardRoutes'));

// White-Label Settings Route (Hospital Rename Logic 🏥)
app.use('/api/settings', require('./src/routes/settingsRoutes'));

// Patients & Doctors Management
app.use('/api/patients', require('./src/routes/patientRoutes'));
app.use('/api/doctors', require('./src/routes/doctorRoutes'));

// Pharmacy & Inventory
app.use('/api/pharmacy', require('./src/routes/pharmacyRoutes'));
app.use('/api/medicines', require('./src/routes/medicineRoutes'));

// Labs & Billing
app.use('/api/labs', require('./src/routes/labRoutes'));
app.use('/api/billing', require('./src/routes/billingRoutes'));

// ========== 4. BASIC & HEALTH ROUTES ==========
app.get('/', (req, res) => {
  res.json({ success: true, message: '🏥 Hospital Management System API is Live' });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' 
  });
});

// ========== 5. ERROR HANDLING ==========
// 404 Route Not Found
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ========== 6. START SERVER ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});