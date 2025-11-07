const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const { auth, authorize } = require('../middleware/auth');

// Add new income
router.post('/', auth, authorize('admin', 'accountant'), async (req, res) => {
  try {
    const income = new Income(req.body);
    await income.save();
    res.status(201).json(income);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get income with filters
router.get('/', auth, async (req, res) => {
  try {
    const { category, month, year, source } = req.query;
    let filter = {};
    
    if (category) filter.category = category;
    if (source) filter.source = source;
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      filter.date = { $gte: startDate, $lte: endDate };
    }
    
    const income = await Income.find(filter).sort({ date: -1 });
    res.json(income);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get unique categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Income.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get income summary by category
router.get('/summary', async (req, res) => {
  try {
    const { month, year } = req.query;
    let matchFilter = {};
    
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      matchFilter.date = { $gte: startDate, $lte: endDate };
    }
    
    const summary = await Income.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);
    
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update income
router.put('/:id', auth, authorize('admin', 'accountant'), async (req, res) => {
  try {
    const income = await Income.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(income);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete income
router.delete('/:id', auth, authorize('admin', 'accountant'), async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: 'Income deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;