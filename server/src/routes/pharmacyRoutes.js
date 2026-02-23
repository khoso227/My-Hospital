const express = require('express');
const router = express.Router();

const { getPharmacyReports } = require('../controllers/pharmacyController');

// Yeh line sabse important hai
router.get('/reports', getPharmacyReports);

module.exports = router;