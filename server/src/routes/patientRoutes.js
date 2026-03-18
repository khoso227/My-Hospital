const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// GET with search/filter/pagination
router.get('/', async (req, res) => {
  try {
    const { search, status, type, from, to, page = 1, limit = 50 } = req.query;
    const q = {};
    if (status) q.status = status;
    if (type) q.type = type;
    if (from || to) {
      q.createdAt = {};
      if (from) q.createdAt.$gte = new Date(from);
      if (to) q.createdAt.$lte = new Date(to);
    }
    if (search) {
      const regex = new RegExp(search, 'i');
      q.$or = [
        { name: regex },
        { cell: regex },
        { disease: regex },
        { trackingId: regex }
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      Patient.find(q).populate('assignedDoctor').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Patient.countDocuments(q)
    ]);
    res.json({ success: true, data, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create new patient (OPD)
// @route   POST /api/patients/add
// @access  Public
router.post('/add', async (req, res) => {
  try {
    let { trackingId } = req.body;
    if (!trackingId) {
      trackingId = `PT-${Date.now().toString().slice(-6)}`;
    }
    const exists = await Patient.findOne({ trackingId });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Tracking ID already exists' });
    }
    const patient = await Patient.create({ ...req.body, trackingId });
    res.status(201).json({ success: true, data: patient });
  } catch (error) {
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
    const { status, certificateData, dischargeSummary } = req.body;
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      { status, certificateData, dischargeSummary },
      { new: true }
    ).populate('assignedDoctor');
    if (!updatedPatient) return res.status(404).json({ success: false, message: 'Patient not found' });
    res.json({ success: true, data: updatedPatient });
  } catch (error) {
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
