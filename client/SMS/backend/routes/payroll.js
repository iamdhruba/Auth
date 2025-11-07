const express = require('express');
const router = express.Router();
const Payroll = require('../models/Payroll');
const { auth, authorize } = require('../middleware/auth');

// Add payroll record
router.post('/', auth, authorize('admin', 'accountant'), async (req, res) => {
  try {
    const { baseSalary, allowances = 0, deductions = 0 } = req.body;
    const netSalary = baseSalary + allowances - deductions;
    
    const payroll = new Payroll({ ...req.body, netSalary });
    await payroll.save();
    res.status(201).json(payroll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get payroll records with filters
router.get('/', async (req, res) => {
  try {
    const { month, year, department } = req.query;
    let filter = {};
    
    if (month) filter.month = parseInt(month);
    if (year) filter.year = parseInt(year);
    
    const payrolls = await Payroll.find(filter)
      .populate('staffId', 'name employeeId department designation')
      .sort({ paymentDate: -1 });
    
    // Filter by department if specified
    let filteredPayrolls = payrolls;
    if (department) {
      filteredPayrolls = payrolls.filter(p => p.staffId.department === department);
    }
    
    res.json(filteredPayrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get payroll summary by department
router.get('/summary', async (req, res) => {
  try {
    const { month, year } = req.query;
    let filter = {};
    
    if (month) filter.month = parseInt(month);
    if (year) filter.year = parseInt(year);
    
    const summary = await Payroll.aggregate([
      { $match: filter },
      { $lookup: { from: 'staff', localField: 'staffId', foreignField: '_id', as: 'staff' } },
      { $unwind: '$staff' },
      { $group: { _id: '$staff.department', totalSalary: { $sum: '$netSalary' }, count: { $sum: 1 } } },
      { $sort: { totalSalary: -1 } }
    ]);
    
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;