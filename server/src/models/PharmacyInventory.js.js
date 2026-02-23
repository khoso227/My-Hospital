const mongoose = require('mongoose');

const pharmacyInventorySchema = new mongoose.Schema({
  medicineName: { type: String, required: true, trim: true },
  manufacturer: { type: String, required: true },
  batchNumber: { type: String, unique: true, required: true },
  expiryDate: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(v) {
        return v > Date.now();
      },
      message: 'Expiry date must be in the future'
    }
  },
  stock: { type: Number, default: 0, min: 0 },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, enum: ['Antibiotic', 'Painkiller', 'Vitamin', 'Other'], default: 'Other' },
  description: { type: String },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' }, 
}, { timestamps: true });

pharmacyInventorySchema.index({ medicineName: 'text', batchNumber: 1 });

module.exports = mongoose.model('PharmacyInventory', pharmacyInventorySchema);