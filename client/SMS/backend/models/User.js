const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'accountant', 'teacher', 'student', 'parent'], 
    default: 'student' 
  },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  permissions: [{
    module: String,
    actions: [String]
  }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);