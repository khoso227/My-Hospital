// server/models/Billing.js
const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  amount: { type: Number, required: true },
  items: [{ name: String, price: Number }], // e.g., medicines, tests
  status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  paymentMethod: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Billing', billingSchema);