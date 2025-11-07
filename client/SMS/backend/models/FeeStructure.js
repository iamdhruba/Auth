const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema({
  class: { type: String, required: true },
  feeType: { type: String, required: true }, // tuition, transport, library, etc.
  amount: { type: Number, required: true },
  frequency: { type: String, enum: ['monthly', 'quarterly', 'annually'], default: 'monthly' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('FeeStructure', feeStructureSchema);