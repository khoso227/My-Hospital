const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const Patient = require('../models/Patient');
const User = require('../models/User');

// @desc    Create new patient (linked to logged-in user)
// @route   POST /api/patients
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const patientData = {
      ...req.body,
      user: req.user.id,
    };

    const patient = await Patient.create(patientData);
    const populated = await patient.populate('user', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private (admin only)
router.get('/', protect, admin, async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if user is authorized to view this patient
    if (
      req.user.role !== 'admin' &&
      patient.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check authorization
    if (
      req.user.role !== 'admin' &&
      patient.user.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('user', 'name email');

    res.json(updatedPatient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    await patient.deleteOne();
    res.json({ message: 'Patient removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;