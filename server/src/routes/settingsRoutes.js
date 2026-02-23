const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// Get Settings
router.get('/', async (req, res) => {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({ hospitalName: 'HOSPITAL PRO' });
    res.json({ success: true, data: settings });
});

// Update Settings
router.put('/update', async (req, res) => {
    const { hospitalName, address } = req.body;
    const settings = await Settings.findOneAndUpdate({}, { hospitalName, address }, { new: true, upsert: true });
    res.json({ success: true, data: settings });
});

module.exports = router;