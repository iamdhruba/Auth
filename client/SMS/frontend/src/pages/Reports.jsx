import { useState } from 'react';
import { reportsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaDownload, FaFileExcel } from 'react-icons/fa';

const Reports = () => {
  const [filters, setFilters] = useState({
    type: 'fees',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    category: '',
    department: ''
  });

  const reportTypes = [
    { value: 'fees', label: 'Fee Payments Report' },
    { value: 'expenses', label: 'Expenses Report' },
    { value: 'payroll', label: 'Payroll Report' },
    { value: 'income-expense', label: 'Income vs Expense Report' }
  ];

  const categories = ['maintenance', 'transport', 'utilities', 'supplies', 'equipment', 'other'];
  const departments = ['academic', 'administration', 'sports', 'library', 'transport', 'maintenance'];

  const exportToExcel = async () => {
    try {
      const response = await reportsAPI.exportExcel(filters);
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filters.type}_report_${filters.month}_${filters.year}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Report exported successfully');
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  const generatePreview = () => {
    toast.info('Preview functionality would show sample data here');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reports & Analytics</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Generate Reports</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type:</label>
            <select 
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              {reportTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month:</label>
            <select 
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.month}
              onChange={(e) => setFilters({ ...filters, month: parseInt(e.target.value) })}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year:</label>
            <select 
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          
          {filters.type === 'expenses' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category:</label>
              <select 
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          )}
          
          {(filters.type === 'expenses' || filters.type === 'payroll') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department:</label>
              <select 
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        <div className="flex gap-3">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            onClick={generatePreview}
          >
            Generate Preview
          </button>
          <button 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={exportToExcel}
          >
            <FaDownload /> Export to Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Quick Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => setFilters({ ...filters, type: 'fees' })}
          >
            <div className="flex items-center justify-center mb-3">
              <FaFileExcel size={30} className="text-green-600" />
            </div>
            <h4 className="font-semibold text-center mb-2">Monthly Fee Collection</h4>
            <p className="text-sm text-gray-600 text-center">Generate fee collection report for current month</p>
          </div>
          
          <div 
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => setFilters({ ...filters, type: 'expenses' })}
          >
            <div className="flex items-center justify-center mb-3">
              <FaFileExcel size={30} className="text-red-600" />
            </div>
            <h4 className="font-semibold text-center mb-2">Expense Summary</h4>
            <p className="text-sm text-gray-600 text-center">Category-wise expense breakdown</p>
          </div>
          
          <div 
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => setFilters({ ...filters, type: 'payroll' })}
          >
            <div className="flex items-center justify-center mb-3">
              <FaFileExcel size={30} className="text-yellow-600" />
            </div>
            <h4 className="font-semibold text-center mb-2">Payroll Report</h4>
            <p className="text-sm text-gray-600 text-center">Department-wise salary distribution</p>
          </div>
          
          <div 
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => setFilters({ ...filters, type: 'income-expense' })}
          >
            <div className="flex items-center justify-center mb-3">
              <FaFileExcel size={30} className="text-blue-600" />
            </div>
            <h4 className="font-semibold text-center mb-2">Financial Summary</h4>
            <p className="text-sm text-gray-600 text-center">Income vs Expense comparison</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Report Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Monthly Financial Report</h4>
            <p className="text-sm text-gray-600 mb-3">Comprehensive monthly report including income, expenses, and net balance</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Fee collections by class</li>
              <li>• Expense breakdown by category</li>
              <li>• Staff salary summary</li>
              <li>• Net profit/loss calculation</li>
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Annual Budget Report</h4>
            <p className="text-sm text-gray-600 mb-3">Year-end financial analysis and budget variance</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Budget vs actual comparison</li>
              <li>• Department-wise spending</li>
              <li>• Yearly trends analysis</li>
              <li>• Recommendations for next year</li>
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Student Fee Status</h4>
            <p className="text-sm text-gray-600 mb-3">Individual student payment tracking</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Pending payments by student</li>
              <li>• Payment history</li>
              <li>• Defaulter list</li>
              <li>• Collection efficiency metrics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;