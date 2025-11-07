import { useState, useEffect } from 'react';
import { expensesAPI, incomeAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaArrowUp, FaArrowDown, FaBalanceScale, FaChartLine } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const FinancialManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expenses: 0, balance: 0 });
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyBreakdown, setMonthlyBreakdown] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('overview'); // overview, category, monthly
  const [showModal, setShowModal] = useState(false);
  const [transactionType, setTransactionType] = useState('income');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    type: 'all'
  });
  const [formData, setFormData] = useState({
    type: 'income',
    category: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMode: 'cash',
    reference: ''
  });
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categoryType, setCategoryType] = useState('income');

  const [incomeCategories, setIncomeCategories] = useState(['fees', 'donations', 'grants', 'fundraising', 'other']);
  const [expenseCategories, setExpenseCategories] = useState(['maintenance', 'transport', 'utilities', 'supplies', 'equipment', 'other']);
  const colors = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#f97316'];

  useEffect(() => {
    fetchAllTransactions();
  }, [filters]);

  const fetchAllTransactions = async () => {
    try {
      const [incomeRes, expenseRes] = await Promise.all([
        incomeAPI.getAll(filters),
        expensesAPI.getAll(filters)
      ]);

      const incomeData = incomeRes.data.map(item => ({ ...item, type: 'income' }));
      const expenseData = expenseRes.data.map(item => ({ ...item, type: 'expense' }));
      
      const allTransactions = [...incomeData, ...expenseData]
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      setTransactions(allTransactions);
      calculateSummary(incomeData, expenseData);
      generateChartData(incomeData, expenseData);
    } catch (error) {
      toast.error('Failed to fetch transactions');
    }
  };

  const calculateSummary = (income, expenses) => {
    const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const balance = totalIncome - totalExpenses;

    setSummary({ income: totalIncome, expenses: totalExpenses, balance });

    // Category breakdown
    const incomeByCategory = income.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {});

    const expenseByCategory = expenses.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {});

    const categoryBreakdown = [
      ...Object.entries(incomeByCategory).map(([category, amount]) => ({
        name: category,
        value: amount,
        type: 'income',
        color: '#10b981'
      })),
      ...Object.entries(expenseByCategory).map(([category, amount]) => ({
        name: category,
        value: amount,
        type: 'expense',
        color: '#ef4444'
      }))
    ];

    setCategoryData(categoryBreakdown);

    // Monthly breakdown by category
    const monthlyData = {};
    [...income, ...expenses].forEach(item => {
      const month = new Date(item.date).toLocaleString('default', { month: 'short' });
      const key = `${month}-${item.category}`;
      
      if (!monthlyData[month]) {
        monthlyData[month] = { month };
      }
      
      if (!monthlyData[month][item.category]) {
        monthlyData[month][item.category] = { income: 0, expense: 0 };
      }
      
      if (item.type === 'income') {
        monthlyData[month][item.category].income += item.amount;
      } else {
        monthlyData[month][item.category].expense += item.amount;
      }
    });

    setMonthlyBreakdown(Object.values(monthlyData));
  };

  const generateChartData = (income, expenses) => {
    const monthlyData = {};
    
    [...income, ...expenses].forEach(item => {
      const month = new Date(item.date).toLocaleString('default', { month: 'short' });
      if (!monthlyData[month]) {
        monthlyData[month] = { month, income: 0, expenses: 0 };
      }
      if (item.type === 'income') {
        monthlyData[month].income += item.amount;
      } else {
        monthlyData[month].expenses += item.amount;
      }
    });

    setChartData(Object.values(monthlyData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData };
      delete data.type;

      if (formData.type === 'income') {
        await incomeAPI.create({ ...data, source: data.category, receivedBy: data.reference });
      } else {
        await expensesAPI.create({ ...data, department: 'general', approvedBy: data.reference });
      }

      toast.success(`${formData.type === 'income' ? 'Income' : 'Expense'} added successfully`);
      setShowModal(false);
      resetForm();
      fetchAllTransactions();
    } catch (error) {
      toast.error('Failed to save transaction');
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'income',
      category: '',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      paymentMode: 'cash',
      reference: ''
    });
  };

  const addCategory = () => {
    if (newCategory.trim()) {
      if (categoryType === 'income') {
        if (!incomeCategories.includes(newCategory.toLowerCase())) {
          setIncomeCategories([...incomeCategories, newCategory.toLowerCase()]);
          toast.success('Income category added successfully');
        } else {
          toast.error('Category already exists');
        }
      } else {
        if (!expenseCategories.includes(newCategory.toLowerCase())) {
          setExpenseCategories([...expenseCategories, newCategory.toLowerCase()]);
          toast.success('Expense category added successfully');
        } else {
          toast.error('Category already exists');
        }
      }
      setNewCategory('');
      setShowCategoryModal(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filters.type === 'all' || transaction.type === filters.type;
    const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
          <p className="text-gray-600 mt-1">Integrated income and expense tracking</p>
        </div>
        <div className="flex gap-3">
          <button 
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => setShowCategoryModal(true)}
          >
            <FaPlus className="text-sm" />
            Add Category
          </button>
          <button 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => {
              setTransactionType('income');
              setFormData({ ...formData, type: 'income' });
              setShowModal(true);
            }}
          >
            <FaArrowUp className="text-sm" />
            Add Income
          </button>
          <button 
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => {
              setTransactionType('expense');
              setFormData({ ...formData, type: 'expense' });
              setShowModal(true);
            }}
          >
            <FaArrowDown className="text-sm" />
            Add Expense
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">₹{summary.income.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FaArrowUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">₹{summary.expenses.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <FaArrowDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Balance</p>
              <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{summary.balance.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaBalanceScale className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{filteredTransactions.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FaChartLine className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.type === 'income' ? '#10b981' : '#ef4444'} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Analysis View */}
      {viewMode === 'category' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {categoryData.map((category, index) => (
            <div key={category.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 capitalize">{category.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  category.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {category.type}
                </span>
              </div>
              <div className="text-3xl font-bold mb-2" style={{ color: category.color }}>
                ₹{category.value.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                {((category.value / summary[category.type]) * 100).toFixed(1)}% of total {category.type}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Monthly Breakdown View */}
      {viewMode === 'monthly' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Category Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                  {[...incomeCategories, ...expenseCategories].map(cat => (
                    <th key={cat} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase capitalize">
                      {cat}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {monthlyBreakdown.map((monthData, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{monthData.month}</td>
                    {[...incomeCategories, ...expenseCategories].map(cat => {
                      const data = monthData[cat];
                      return (
                        <td key={cat} className="px-4 py-3 text-sm">
                          {data ? (
                            <div>
                              {data.income > 0 && (
                                <div className="text-green-600">+₹{data.income.toLocaleString()}</div>
                              )}
                              {data.expense > 0 && (
                                <div className="text-red-600">-₹{data.expense.toLocaleString()}</div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Mode Selector */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'overview' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setViewMode('overview')}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'category' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setViewMode('category')}
          >
            Category Analysis
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setViewMode('monthly')}
          >
            Monthly Breakdown
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="all">All Transactions</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
            </select>
            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {[...incomeCategories, ...expenseCategories].map(cat => (
                <option key={cat} value={cat} className="capitalize">{cat}</option>
              ))}
            </select>
            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.month}
              onChange={(e) => setFilters({ ...filters, month: parseInt(e.target.value) })}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) })}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <option key={i} value={new Date().getFullYear() - i}>
                  {new Date().getFullYear() - i}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">All Transactions</h3>
          <p className="text-sm text-gray-600 mt-1">Showing {filteredTransactions.length} transactions</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={`${transaction.type}-${transaction._id}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type === 'income' ? (
                        <><FaArrowUp className="mr-1" /> Income</>
                      ) : (
                        <><FaArrowDown className="mr-1" /> Expense</>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                    <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                      {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                      {transaction.paymentMode}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No transactions found</div>
              <div className="text-gray-500 text-sm">Try adjusting your search or filters</div>
            </div>
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                Add {formData.type === 'income' ? 'Income' : 'Expense'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category:</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {(formData.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                    <option key={cat} value={cat} className="capitalize">{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount:</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date:</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode:</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.paymentMode}
                  onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                >
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                  <option value="online">Online</option>
                  <option value="card">Card</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.type === 'income' ? 'Received By:' : 'Approved By:'}
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={`flex-1 px-4 py-2 text-white rounded-lg ${
                    formData.type === 'income' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Add {formData.type === 'income' ? 'Income' : 'Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Add New Category</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Type:</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={categoryType}
                  onChange={(e) => setCategoryType(e.target.value)}
                >
                  <option value="income">Income Category</option>
                  <option value="expense">Expense Category</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name:</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter category name"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  onClick={() => {
                    setShowCategoryModal(false);
                    setNewCategory('');
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  onClick={addCategory}
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialManagement;