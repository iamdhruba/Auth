import { useState, useEffect } from 'react';
import { expensesAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaDownload, FaEye } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    category: '',
    department: ''
  });
  const [formData, setFormData] = useState({
    category: '',
    transactionName: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    department: 'administration',
    paymentMode: 'cash',
    billNumber: '',
    approvedBy: ''
  });

  const departments = ['administration', 'academic', 'sports', 'library', 'transport', 'maintenance'];
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#f97316'];

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, [filters]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [expenses]);

  const fetchExpenses = async () => {
    try {
      const response = await expensesAPI.getAll(filters);
      setExpenses(response.data);
    } catch (error) {
      toast.error('Failed to fetch expenses');
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await expensesAPI.getSummary({
        month: filters.month,
        year: filters.year
      });
      setSummary(response.data);
    } catch (error) {
      toast.error('Failed to fetch summary');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await expensesAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories');
      setCategories([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        await expensesAPI.update(editingExpense._id, formData);
        toast.success('Expense updated successfully');
      } else {
        await expensesAPI.create(formData);
        toast.success('Expense added successfully');
      }
      setShowModal(false);
      setEditingExpense(null);
      resetForm();
      fetchExpenses();
      fetchSummary();
      fetchCategories();
    } catch (error) {
      toast.error('Failed to save expense');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      category: expense.category,
      transactionName: expense.transactionName || '',
      description: expense.description,
      amount: expense.amount,
      date: new Date(expense.date).toISOString().split('T')[0],
      department: expense.department,
      paymentMode: expense.paymentMode,
      billNumber: expense.billNumber || '',
      approvedBy: expense.approvedBy
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expensesAPI.delete(id);
        toast.success('Expense deleted successfully');
        fetchExpenses();
        fetchSummary();
        fetchCategories();
      } catch (error) {
        toast.error('Failed to delete expense');
      }
    }
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.toLowerCase())) {
      setCategories([...categories, newCategory.toLowerCase()]);
      setNewCategory('');
      setShowCategoryModal(false);
      toast.success('Category added successfully');
    } else {
      toast.error('Category already exists or invalid');
    }
  };

  const resetForm = () => {
    setFormData({
      category: '',
      transactionName: '',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      department: 'administration',
      paymentMode: 'cash',
      billNumber: '',
      approvedBy: ''
    });
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expense.transactionName && expense.transactionName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expense Management</h1>
          <p className="text-gray-600 mt-1">Track and manage all school expenses efficiently</p>
        </div>
        <div className="flex gap-3">
          <button 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            onClick={() => setShowCategoryModal(true)}
          >
            <FaPlus className="text-sm" />
            Add Category
          </button>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            onClick={() => setShowModal(true)}
          >
            <FaPlus className="text-sm" />
            Add Expense
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalAmount.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <FaDownload className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">{filteredExpenses.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaEye className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FaFilter className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Amount</p>
              <p className="text-2xl font-bold text-gray-900">₹{filteredExpenses.length ? Math.round(totalAmount / filteredExpenses.length).toLocaleString() : 0}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FaEdit className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search expenses..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
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
            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat} className="capitalize">{cat}</option>
              ))}
            </select>
            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Expenses Table */}
        <div className="xl:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Expense Records</h3>
                <p className="text-sm text-gray-600 mt-1">Showing {filteredExpenses.length} expenses</p>
              </div>
              {filters.category && (
                <div className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full">
                  Category: {filters.category}
                </div>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExpenses.map((expense) => (
                  <tr key={expense._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">
                      {expense.transactionName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {expense.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                      {expense.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ₹{expense.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                        {expense.paymentMode}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          onClick={() => handleEdit(expense)}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900 transition-colors"
                          onClick={() => handleDelete(expense._id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              </tbody>
            </table>
            {filteredExpenses.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">No expenses found</div>
                <div className="text-gray-500 text-sm">Try adjusting your search or filters</div>
              </div>
            )}
          </div>
        </div>

        {/* Summary Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Category Summary</h3>
            {filters.category && (
              <button
                onClick={() => setFilters({ ...filters, category: '' })}
                className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition-colors"
              >
                Clear Filter
              </button>
            )}
          </div>
          {summary.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={summary}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="total"
                    label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`}
                    onClick={(data) => {
                      if (data && data._id) {
                        setFilters({ ...filters, category: data._id });
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {summary.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {summary.map((item, index) => (
                  <div 
                    key={item._id} 
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                    onClick={() => setFilters({ ...filters, category: item._id })}
                  >
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: colors[index % colors.length] }}
                      ></div>
                      <span className="text-sm text-gray-600 capitalize">{item._id}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">₹{item.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-sm">No data available</div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
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
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="capitalize">{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Name:</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.transactionName}
                  onChange={(e) => setFormData({ ...formData, transactionName: e.target.value })}
                  placeholder="Enter transaction name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter expense description"
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
                  placeholder="0.00"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Department:</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept} className="capitalize">{dept}</option>
                  ))}
                </select>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Bill Number:</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.billNumber}
                  onChange={(e) => setFormData({ ...formData, billNumber: e.target.value })}
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Approved By:</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.approvedBy}
                  onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value })}
                  placeholder="Enter approver name"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setShowModal(false);
                    setEditingExpense(null);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingExpense ? 'Update' : 'Add'} Expense
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
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name:</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter category name"
                />
              </div>
              <div className="flex gap-3">
                <button 
                  type="button" 
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setShowCategoryModal(false);
                    setNewCategory('');
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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

export default Expenses;