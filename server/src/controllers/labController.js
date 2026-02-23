const Lab = require('../models/Lab');

exports.getLabs = async (req, res) => {
    try {
        const labs = await Lab.find().populate('patient').sort({ date: -1 });
        res.json({ success: true, data: labs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.addLab = async (req, res) => {
    try {
        // req.body mein testName, fee aur extraColumns sab aayenge
        const newLab = new Lab(req.body);
        await newLab.save();
        const populated = await newLab.populate('patient');
        res.json({ success: true, data: populated });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};