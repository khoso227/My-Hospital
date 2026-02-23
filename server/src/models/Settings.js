const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    hospitalName: { type: String, default: 'HOSPITAL PRO' },
    address: { type: String, default: 'City Medical Center' },
    contact: String,
    logoUrl: String,
});

module.exports = mongoose.model('Settings', SettingsSchema);