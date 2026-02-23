// server/src/controllers/billingController.js
const Billing = require('../models/Billing');

exports.getBillings = async (req, res) => {
  try {
    const billings = await Billing.find().populate('patient');
    res.json({ success: true, data: billings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addBilling = async (req, res) => {
  try {
    const newBilling = new Billing(req.body);
    await newBilling.save();
    res.status(201).json({ success: true, data: newBilling });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};