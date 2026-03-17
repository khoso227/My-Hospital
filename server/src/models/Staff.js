const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    profession: {
        type: String,
        required: [true, "Profession is required"],
        enum: ['Nurse', 'Receptionist', 'Technician', 'Security', 'Pharmacist', 'Accountant', 'Other']
    },
    cnic: {
        type: String,
        required: [true, "CNIC is required"],
        unique: true // Ek CNIC se do baar entry nahi hogi
    },
    mobile: {
        type: String,
        required: [true, "Mobile number is required"]
    },
    altMobile: {
        type: String
    },
    address: {
        type: String
    },
    extraColumn1: {
        type: String
    },
    extraColumn2: {
        type: String
    }
}, { 
    timestamps: true // Automatically adds createdAt and updatedAt
});

// Model ko export kar rahe hain
module.exports = mongoose.model('Staff', staffSchema);