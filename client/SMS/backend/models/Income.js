const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  category: { type: String, required: true },
  transactionName: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  source: { type: String, required: true }, // fees, donations, grants, etc.
  paymentMode: { type: String, enum: ['cash', 'cheque', 'online', 'card'], required: true },
  receiptNumber: { type: String },
  receivedBy: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Income', incomeSchema);