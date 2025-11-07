const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const FeePayment = require('../models/FeePayment');
const Expense = require('../models/Expense');
const Income = require('../models/Income');
const Payroll = require('../models/Payroll');
const { auth, authorize } = require('../middleware/auth');

// Dashboard summary
router.get('/dashboard', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    
    // Total income (fees)
    const totalIncome = await FeePayment.aggregate([
      { $match: { month: currentMonth, year: currentYear } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Total expenses
    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0);
    const totalExpenses = await Expense.aggregate([
      { $match: { date: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Total payroll
    const totalPayroll = await Payroll.aggregate([
      { $match: { month: currentMonth, year: currentYear } },
      { $group: { _id: null, total: { $sum: '$netSalary' } } }
    ]);
    
    // Recent transactions
    const recentExpenses = await Expense.find({ date: { $gte: startDate, $lte: endDate } })
      .sort({ date: -1 })
      .limit(3)
      .select('transactionName description amount date category');
    
    const recentIncome = await Income.find({ date: { $gte: startDate, $lte: endDate } })
      .sort({ date: -1 })
      .limit(3)
      .select('transactionName description amount date category');
    
    const income = totalIncome[0]?.total || 0;
    const expenses = totalExpenses[0]?.total || 0;
    const payroll = totalPayroll[0]?.total || 0;
    const netBalance = income - expenses - payroll;
    
    res.json({ 
      income, 
      expenses, 
      payroll, 
      netBalance,
      recentExpenses,
      recentIncome
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Export to Excel
router.get('/export/excel', async (req, res) => {
  try {
    const { type, month, year } = req.query;
    const workbook = new ExcelJS.Workbook();
    
    if (type === 'fees') {
      const worksheet = workbook.addWorksheet('Fee Payments');
      const payments = await FeePayment.find({ 
        month: parseInt(month), 
        year: parseInt(year) 
      }).populate('studentId', 'name rollNumber class');
      
      worksheet.columns = [
        { header: 'Receipt No', key: 'receiptNumber', width: 15 },
        { header: 'Student Name', key: 'studentName', width: 20 },
        { header: 'Roll Number', key: 'rollNumber', width: 15 },
        { header: 'Class', key: 'class', width: 10 },
        { header: 'Fee Type', key: 'feeType', width: 15 },
        { header: 'Amount', key: 'amount', width: 12 },
        { header: 'Payment Mode', key: 'paymentMode', width: 15 },
        { header: 'Date', key: 'paymentDate', width: 15 }
      ];
      
      payments.forEach(payment => {
        worksheet.addRow({
          receiptNumber: payment.receiptNumber,
          studentName: payment.studentId.name,
          rollNumber: payment.studentId.rollNumber,
          class: payment.studentId.class,
          feeType: payment.feeType,
          amount: payment.amount,
          paymentMode: payment.paymentMode,
          paymentDate: payment.paymentDate.toDateString()
        });
      });
    }
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${type}_report_${month}_${year}.xlsx`);
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;