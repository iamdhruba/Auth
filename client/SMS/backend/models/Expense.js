const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  category: { type: String, required: true }, // maintenance, transport, utilities, etc.
  transactionName: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  department: { type: String, required: true },
  paymentMode: { type: String, enum: ['cash', 'cheque', 'online'], required: true },
  billNumber: { type: String },
  approvedBy: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);