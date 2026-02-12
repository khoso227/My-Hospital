const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },
    medicalHistory: [
      {
        condition: String,
        diagnosedDate: Date,
        status: String,
      },
    ],
    allergies: [String],
    currentMedications: [
      {
        name: String,
        dosage: String,
        frequency: String,
      },
    ],
    insuranceProvider: {
      type: String,
    },
    insuranceId: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;