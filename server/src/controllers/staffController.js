const Staff = require('../models/Staff');

// 1. Get All Staff
const getStaff = async (req, res) => {
    try {
        const staffList = await Staff.find().sort({ createdAt: -1 });
        res.status(200).json(staffList);
    } catch (err) {
        res.status(500).json({ message: "Fetch error: " + err.message });
    }
};

// 2. Add New Staff
const addStaff = async (req, res) => {
    try {
        const newStaff = new Staff(req.body);
        await newStaff.save();
        res.status(201).json(newStaff);
    } catch (err) {
        res.status(400).json({ message: "Save error: " + err.message });
    }
};

// 3. Delete Staff
const deleteStaff = async (req, res) => {
    try {
        await Staff.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ message: "Delete error: " + err.message });
    }
};

module.exports = {
    getStaff,
    addStaff,
    deleteStaff
};