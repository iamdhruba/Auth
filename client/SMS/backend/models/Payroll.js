const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  month: { type: Number, required: true }, // 1-12
  year: { type: Number, required: true },
  baseSalary: { type: Number, required: true },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  netSalary: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentMode: { type: String, enum: ['cash', 'bank', 'cheque'], required: true },
  remarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Payroll', payrollSchema);