const mongoose = require('mongoose');

const LabSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    testName: { type: String, required: true },
    fee: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
    // Naya column ka data yahan save hoga
    extraColumns: { type: Array, default: [] }, 
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lab', LabSchema);