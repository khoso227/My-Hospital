const express = require('express');
const Bed = require('../models/Bed');
const Patient = require('../models/Patient');

const router = express.Router();

// Seed beds if empty helper
const ensureBeds = async (total = 20) => {
  const count = await Bed.countDocuments();
  if (count === 0) {
    const docs = Array.from({ length: total }, (_, i) => ({
      bedNumber: `B-${i + 1}`,
      ward: 'General',
      status: 'Available'
    }));
    await Bed.insertMany(docs);
  }
};

// GET beds with optional ward filter
router.get('/', async (req, res) => {
  try {
    await ensureBeds();
    const { ward } = req.query;
    const q = ward ? { ward } : {};
    const beds = await Bed.find(q).sort({ bedNumber: 1 }).populate('patient', 'name trackingId status');
    res.json({ success: true, data: beds });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update bed status / assign patient
router.put('/:id/status', async (req, res) => {
  try {
    const { status, patientId, note } = req.body;
    const bed = await Bed.findById(req.params.id);
    if (!bed) return res.status(404).json({ success: false, message: 'Bed not found' });

    bed.status = status || bed.status;
    bed.patient = patientId || null;
    bed.history.push({ patient: patientId || null, status: bed.status, note });
    await bed.save();

    if (patientId && status === 'Occupied') {
      await Patient.findByIdAndUpdate(patientId, { bedNumber: bed.bedNumber, ward: bed.ward });
    }
    if (!patientId && status === 'Available') {
      await Patient.updateMany({ bedNumber: bed.bedNumber }, { $unset: { bedNumber: "", ward: "" } });
    }

    res.json({ success: true, data: bed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
