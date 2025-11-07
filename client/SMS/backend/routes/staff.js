const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');
const { auth, authorize } = require('../middleware/auth');

// Get all staff
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const staff = await Staff.find({ isActive: true });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new staff
router.post('/', auth, authorize('admin'), async (req, res) => {
  try {
    const staff = new Staff(req.body);
    await staff.save();
    res.status(201).json(staff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update staff
router.put('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(staff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete staff
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    await Staff.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;