require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// Route files
const authRoutes = require('./src/routes/authRoutes');
const patientRoutes = require('./src/routes/patientRoutes');

// ========== MIDDLEWARE ==========
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== DATABASE CONNECTION ==========
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hospital_management';
    
    // MongoDB connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    await mongoose.connect(mongoURI, options);
    console.log('✅ MongoDB Connected Successfully');
    
    // Connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB Connection Error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB Disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB Reconnected');
    });
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('💡 Make sure MongoDB is running and MONGO_URI is correct in .env file');
    // Don't exit in development, let server start anyway
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

connectDB();

// ========== BASIC ROUTES ==========
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🏥 Hospital Management System API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      patients: '/api/patients',
    },
    database:
      mongoose.connection.readyState === 1
        ? 'Connected'
        : 'Disconnected',
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database:
      mongoose.connection.readyState === 1
        ? 'connected'
        : 'disconnected',
  });
});

// ========== API ROUTES ==========
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);

// ========== ERROR HANDLING ==========
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error:
      process.env.NODE_ENV === 'development'
        ? err.message
        : undefined,
  });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log(`🚀 Hospital Management System Server Started`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(
    `⚡ Environment: ${process.env.NODE_ENV || 'development'}`
  );
  console.log(
    `🗄️  Database: ${
      mongoose.connection.readyState === 1
        ? '✅ Connected'
        : '❌ Disconnected'
    }`
  );
  console.log('='.repeat(60) + '\n');
  console.log('📋 Available Endpoints:');
  console.log(`   👉 http://localhost:${PORT}/ (API Info)`);
  console.log(`   👉 http://localhost:${PORT}/api/health (Health Check)`);
  console.log(`   👉 http://localhost:${PORT}/api/auth/register (Register)`);
  console.log(`   👉 http://localhost:${PORT}/api/auth/login (Login)`);
  console.log(`   👉 http://localhost:${PORT}/api/patients (Patients)`);
  console.log('\n');
});