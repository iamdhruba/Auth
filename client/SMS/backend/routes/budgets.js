const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');

// Add budget
router.post('/', async (req, res) => {
  try {
    const budget = new Budget(req.body);
    await budget.save();
    res.status(201).json(budget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get budgets with filters
router.get('/', async (req, res) => {
  try {
    const { department, month, year } = req.query;
    let filter = {};
    
    if (department) filter.department = department;
    if (month) filter.month = parseInt(month);
    if (year) filter.year = parseInt(year);
    
    const budgets = await Budget.find(filter).sort({ createdAt: -1 });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update budget actual amount
router.put('/:id', async (req, res) => {
  try {
    const budget = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(budget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get budget variance report
router.get('/variance', async (req, res) => {
  try {
    const { month, year } = req.query;
    let filter = {};
    
    if (month) filter.month = parseInt(month);
    if (year) filter.year = parseInt(year);
    
    const budgets = await Budget.find(filter);
    const variance = budgets.map(budget => ({
      ...budget.toObject(),
      variance: budget.actualAmount - budget.plannedAmount,
      variancePercentage: ((budget.actualAmount - budget.plannedAmount) / budget.plannedAmount * 100).toFixed(2)
    }));
    
    res.json(variance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;