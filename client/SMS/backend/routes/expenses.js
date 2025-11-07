const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { auth, authorize } = require('../middleware/auth');

// Add new expense
router.post('/', auth, authorize('admin', 'accountant'), async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get expenses with filters
router.get('/', async (req, res) => {
  try {
    const { category, month, year, department } = req.query;
    let filter = {};
    
    if (category) filter.category = category;
    if (department) filter.department = department;
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      filter.date = { $gte: startDate, $lte: endDate };
    }
    
    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get unique categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Expense.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get expense summary by category
router.get('/summary', async (req, res) => {
  try {
    const { month, year } = req.query;
    let matchFilter = {};
    
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      matchFilter.date = { $gte: startDate, $lte: endDate };
    }
    
    const summary = await Expense.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);
    
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update expense
router.put('/:id', auth, authorize('admin', 'accountant'), async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete expense
router.delete('/:id', auth, authorize('admin', 'accountant'), async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;