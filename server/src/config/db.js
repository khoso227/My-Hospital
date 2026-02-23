require('dotenv').config(); // Sabse pehle ye line honi chahiye
const express = require('express');
const connectDB = require('./src/config/db'); // Jo code aapne abhi dikhaya

const app = express();

// Database connect karen
connectDB(); 