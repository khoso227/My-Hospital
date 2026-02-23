const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cell: { type: String, required: true },
    degree: { type: String },
    timings: { type: String },
    specialist: { type: String },
    extraFields: { type: Map, of: String } // Yeh naye columns handle karega
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);