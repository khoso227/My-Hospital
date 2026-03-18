const mongoose = require('mongoose');

const BedSchema = new mongoose.Schema({
  bedNumber: { type: String, required: true, unique: true },
  ward: { type: String, default: 'General' },
  status: { type: String, enum: ['Available', 'Occupied', 'Cleaning', 'Hold'], default: 'Available' },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  history: [{
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    status: String,
    at: { type: Date, default: Date.now },
    note: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Bed', BedSchema);
