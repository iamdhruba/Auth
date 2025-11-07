const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  department: { type: String, required: true },
  category: { type: String, required: true },
  plannedAmount: { type: Number, required: true },
  actualAmount: { type: Number, default: 0 },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Budget', budgetSchema);