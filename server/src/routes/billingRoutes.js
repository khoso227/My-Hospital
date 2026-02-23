// server/src/routes/billingRoutes.js
const express = require('express');
const { getBillings, addBilling } = require('../controllers/billingController');

const router = express.Router();

router.get('/', getBillings);
router.post('/', addBilling);

module.exports = router;