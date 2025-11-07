const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { auth, authorize } = require('../middleware/auth');

// Get all students
router.get('/', auth, authorize('admin', 'accountant', 'teacher'), async (req, res) => {
  try {
    const students = await Student.find({ isActive: true });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new student
router.post('/', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update student
router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;