const Doctor = require('../models/Doctor');

// @desc    Get All Doctors (Bina kisi security ke)
// @route   GET /api/doctors
exports.getDoctors = async (req, res) => {
    try {
        // Sabhi doctors ko nikaalna aur naye doctors ko upar dikhana (sort)
        const doctors = await Doctor.find().sort({ createdAt: -1 });
        
        res.status(200).json({ 
            success: true, 
            data: doctors 
        });
    } catch (err) {
        console.error("Fetch Doctors Error:", err.message);
        res.status(500).json({ 
            success: false, 
            message: "Doctors load nahi ho sake: " + err.message 
        });
    }
};

// @desc    Add New Doctor
// @route   POST /api/doctors/add
exports.addDoctor = async (req, res) => {
    try {
        console.log("Adding New Doctor:", req.body); // Terminal mein data check karne ke liye

        const { name, cell, specialist, timings, extraDetails } = req.body;

        // Naya doctor create karna
        const newDoctor = new Doctor({
            name,
            cell,
            specialist,
            timings,
            extraDetails
        });

        await newDoctor.save();

        res.status(201).json({ 
            success: true, 
            data: newDoctor 
        });
    } catch (err) {
        console.error("Save Doctor Error:", err.message);
        res.status(400).json({ 
            success: false, 
            message: "Doctor save nahi ho saka: " + err.message 
        });
    }
};

// @desc    Delete Doctor
// @route   DELETE /api/doctors/:id
exports.deleteDoctor = async (req, res) => {
    try {
        const doctorId = req.params.id;
        
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ 
                success: false, 
                message: "Doctor nahi mila" 
            });
        }

        await Doctor.findByIdAndDelete(doctorId);

        res.status(200).json({ 
            success: true, 
            message: "Doctor successfully delete kar diya gaya" 
        });
    } catch (err) {
        console.error("Delete Error:", err.message);
        res.status(500).json({ 
            success: false, 
            message: "Delete fail ho gaya: " + err.message 
        });
    }
};