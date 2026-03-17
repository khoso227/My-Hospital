const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  vitals: {
    bp: String,
    weight: String,
    temp: String,
    pulse: String
  },
  medicines: [{
    name: String,
    dosage: String, // e.g. 1-0-1
    duration: String, // e.g. 5 Days
    instruction: String // After Meal
  }],
  clinicalNotes: String,
  nextVisit: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);