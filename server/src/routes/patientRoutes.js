const express = require('express');
const router = express.Router();
// Security middlewares (protect, admin) hata diye gaye hain
const Patient = require('../models/Patient');
const User = require('../models/User');

// @desc    Get all patients
// @route   GET /api/patients
// @access  Public
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate('assignedDoctor') // Frontend doctor name dikhane ke liye zaroori hai
      .sort({ createdAt: -1 });
    
    // Frontend ko data object ke andar chahiye
    res.json({ success: true, data: patients });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create new patient (OPD)
// @route   POST /api/patients/add
// @access  Public
router.post('/add', async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json({ success: true, data: patient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('assignedDoctor');

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.json({ success: true, data: patient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update patient status and certificate (Lifecycle)
// @route   PUT /api/patients/status/:id
// @access  Public
router.put('/status/:id', async (req, res) => {
  try {
    const { status, certificateData } = req.body;
    
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      { status, certificateData },
      { new: true }
    ).populate('assignedDoctor');

    if (!updatedPatient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.json({ success: true, data: updatedPatient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    await patient.deleteOne();
    res.json({ success: true, message: 'Patient removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;