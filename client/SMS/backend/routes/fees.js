const express = require('express');
const router = express.Router();
const FeePayment = require('../models/FeePayment');
const FeeStructure = require('../models/FeeStructure');
const { auth, authorize } = require('../middleware/auth');

// Record fee payment
router.post('/payment', auth, authorize('admin', 'accountant'), async (req, res) => {
  try {
    const receiptNumber = `RCP${Date.now()}`;
    const payment = new FeePayment({ ...req.body, receiptNumber });
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get fee payments with filters
router.get('/payments', async (req, res) => {
  try {
    const { month, year, class: studentClass } = req.query;
    let filter = {};
    
    if (month) filter.month = parseInt(month);
    if (year) filter.year = parseInt(year);
    
    const payments = await FeePayment.find(filter)
      .populate('studentId', 'name rollNumber class')
      .sort({ paymentDate: -1 });
    
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get fee structures
router.get('/structures', async (req, res) => {
  try {
    const structures = await FeeStructure.find({ isActive: true });
    res.json(structures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add fee structure
router.post('/structure', async (req, res) => {
  try {
    const structure = new FeeStructure(req.body);
    await structure.save();
    res.status(201).json(structure);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;