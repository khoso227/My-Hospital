const express = require('express');
const Log = require('../models/Log');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 50, action, entity } = req.query;
    const q = {};
    if (action) q.action = action;
    if (entity) q.entity = entity;
    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      Log.find(q).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Log.countDocuments(q)
    ]);
    res.json({ success: true, data, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
