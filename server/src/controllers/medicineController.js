const Medicine = require('../models/Medicine');

exports.getMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find().sort({ createdAt: -1 });
        res.json({ success: true, data: medicines });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.addMedicine = async (req, res) => {
    try {
        // req.body mein ab extraFields bhi aayenge
        const newMedicine = new Medicine(req.body);
        await newMedicine.save();
        res.json({ success: true, data: newMedicine });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};