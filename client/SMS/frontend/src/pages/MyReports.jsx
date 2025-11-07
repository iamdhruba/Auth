import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaDownload, FaFileAlt, FaChartPie } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const MyReports = () => {
  const { user } = useAuth();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Mock data - in real app, fetch from API
  const feeData = [
    { name: 'Tuition Fee', amount: 50000, color: '#3b82f6' },
    { name: 'Transport Fee', amount: 12000, color: '#10b981' },
    { name: 'Library Fee', amount: 3000, color: '#f59e0b' },
    { name: 'Sports Fee', amount: 5000, color: '#ef4444' }
  ];

  const monthlyData = [
    { month: 'Apr', amount: 8000 },
    { month: 'May', amount: 8000 },
    { month: 'Jun', amount: 8000 },
    { month: 'Jul', amount: 8000 },
    { month: 'Aug', amount: 8000 },
    { month: 'Sep', amount: 8000 }
  ];

  const downloadReport = (reportType) => {
    // Generate and download report
    console.log(`Downloading ${reportType} report`);
  };

  const totalPaid = feeData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Reports</h1>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year:</label>
          <select 
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <option key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}-{new Date().getFullYear() - i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <FaFileAlt className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">₹{totalPaid.toLocaleString()}</div>
              <div className="text-gray-600">Total Fees Paid</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <FaChartPie className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">6</div>
              <div className="text-gray-600">Payments Made</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <FaDownload className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">Current</div>
              <div className="text-gray-600">Payment Status</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Fee Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={feeData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="amount"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {feeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Monthly Payments</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Bar dataKey="amount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Available Reports */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Available Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Fee Payment Summary</h4>
              <FaFileAlt className="text-blue-600" />
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Complete summary of all fee payments made during the academic year
            </p>
            <button
              onClick={() => downloadReport('fee-summary')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
            >
              Download PDF
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Payment Receipts</h4>
              <FaDownload className="text-green-600" />
            </div>
            <p className="text-sm text-gray-600 mb-3">
              All payment receipts compiled into a single document
            </p>
            <button
              onClick={() => downloadReport('receipts')}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
            >
              Download ZIP
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Academic Progress</h4>
              <FaChartPie className="text-purple-600" />
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Academic performance and attendance report
            </p>
            <button
              onClick={() => downloadReport('academic')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">Need Help?</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Reports are generated in real-time based on your payment data</li>
          <li>• PDF reports can be saved and printed for your records</li>
          <li>• For any discrepancies, please contact the accounts office</li>
          <li>• Historical data is available for the past 5 academic years</li>
        </ul>
      </div>
    </div>
  );
};

export default MyReports;