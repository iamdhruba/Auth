const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  baseSalary: { type: Number, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String, required: true },
  joinDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);