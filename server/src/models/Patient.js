const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cell: { type: String, required: true },
    disease: String,
    address: String,
    type: { type: String, enum: ['OPD', 'Admit'], default: 'OPD' },
    admissionDays: { type: Number, default: 0 },
    status: { 
        type: String, 
        enum: ['Active', 'Discharged', 'Death', 'Referred'], 
        default: 'Active' 
    },
    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    
    // Letters & Certificates Data
    letterData: {
        summary: String,
        reason: String,
        hospitalName: String, // For Refer
        causeOfDeath: String, // For Death
        date: { type: Date, default: Date.now }
    },
    
    // Dynamic Extra Columns
    extraFields: [{ label: String, value: String }],
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', PatientSchema);