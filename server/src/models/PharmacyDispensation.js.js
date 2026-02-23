// server/models/PharmacyDispensation.js
const mongoose = require('mongoose');

const pharmacyDispensationSchema = new mongoose.Schema({
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'PharmacyInventory', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  quantity: { type: Number, required: true, min: 1 },
  dispensedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Pharmacy Incharge
  billing: { type: mongoose.Schema.Types.ObjectId, ref: 'Billing' }, // Link to bill
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('PharmacyDispensation', pharmacyDispensationSchema);