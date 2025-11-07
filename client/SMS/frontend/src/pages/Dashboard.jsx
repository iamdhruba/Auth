import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { reportsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaArrowUp, FaArrowDown, FaWallet, FaChartLine } from 'react-icons/fa';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    income: 0,
    expenses: 0,
    payroll: 0,
    netBalance: 0,
    recentExpenses: [],
    recentIncome: []
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchDashboardData();
  }, [selectedMonth, selectedYear]);

  const fetchDashboardData = async () => {
    try {
      const response = await reportsAPI.getDashboard({
        month: selectedMonth,
        year: selectedYear
      });
      setDashboardData(response.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    }
  };

  const pieData = [
    { name: 'Income', value: dashboardData.income, color: '#10b981' },
    { name: 'Expenses', value: dashboardData.expenses, color: '#ef4444' },
    { name: 'Payroll', value: dashboardData.payroll, color: '#f59e0b' }
  ];

  const barData = [
    { name: 'Income', amount: dashboardData.income },
    { name: 'Expenses', amount: dashboardData.expenses },
    { name: 'Payroll', amount: dashboardData.payroll },
    { name: 'Net Balance', amount: dashboardData.netBalance }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your school's financial performance</p>
        </div>
        <div className="flex gap-3">
          <select 
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <select 
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <option key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Financial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">₹{dashboardData.income.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-red-600">₹{dashboardData.expenses.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <FaArrowDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Payroll</p>
              <p className="text-2xl font-bold text-yellow-600">₹{dashboardData.payroll.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FaWallet className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Balance</p>
              <p className={`text-2xl font-bold ${dashboardData.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{dashboardData.netBalance.toLocaleString()}
              </p>
            </div>
            <div className={`p-3 ${dashboardData.netBalance >= 0 ? 'bg-green-100' : 'bg-red-100'} rounded-lg`}>
              <FaChartLine className={`h-6 w-6 ${dashboardData.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="xl:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Overview</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Bar dataKey="amount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {/* Recent Income */}
            <div>
              <h4 className="text-sm font-medium text-green-600 mb-2">Recent Income</h4>
              <div className="space-y-2">
                {dashboardData.recentIncome?.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.transactionName || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-600 capitalize">{transaction.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">+₹{transaction.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                {(!dashboardData.recentIncome || dashboardData.recentIncome.length === 0) && (
                  <p className="text-xs text-gray-500">No recent income</p>
                )}
              </div>
            </div>

            {/* Recent Expenses */}
            <div>
              <h4 className="text-sm font-medium text-red-600 mb-2">Recent Expenses</h4>
              <div className="space-y-2">
                {dashboardData.recentExpenses?.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.transactionName || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-600 capitalize">{transaction.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-red-600">-₹{transaction.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                {(!dashboardData.recentExpenses || dashboardData.recentExpenses.length === 0) && (
                  <p className="text-xs text-gray-500">No recent expenses</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;