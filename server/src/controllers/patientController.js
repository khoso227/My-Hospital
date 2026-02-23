const Patient = require('../models/Patient');

// Get all patients
exports.getPatients = async (req, res) => {
    try {
        const patients = await Patient.find().populate('assignedDoctor');
        res.json({ success: true, data: patients });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add new patient
exports.addPatient = async (req, res) => {
    try {
        const newPatient = new Patient(req.body);
        await newPatient.save();
        res.json({ success: true, data: newPatient });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Status and Save Certificate
exports.updatePatientStatus = async (req, res) => {
    try {
        const { status, certificateData } = req.body;
        const patient = await Patient.findByIdAndUpdate(
            req.params.id, 
            { status, certificateData }, 
            { new: true }
        );
        res.json({ success: true, data: patient });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete
exports.deletePatient = async (req, res) => {
    try {
        await Patient.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Removed" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};