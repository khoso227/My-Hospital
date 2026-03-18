const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // create/update/delete/status/bed
  entity: { type: String, required: true }, // patient/bed/etc
  entityId: { type: String },
  user: { type: String }, // username/email/token role (no auth implemented yet)
  detail: { type: Object },
}, { timestamps: true });

module.exports = mongoose.model('Log', LogSchema);
