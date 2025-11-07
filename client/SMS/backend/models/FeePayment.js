const mongoose = require('mongoose');

const feePaymentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  amount: { type: Number, required: true },
  feeType: { type: String, required: true },
  paymentMode: { type: String, enum: ['cash', 'card', 'online'], required: true },
  paymentDate: { type: Date, default: Date.now },
  month: { type: Number, required: true }, // 1-12
  year: { type: Number, required: true },
  receiptNumber: { type: String, required: true, unique: true },
  remarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('FeePayment', feePaymentSchema);