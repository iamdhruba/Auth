import { useState, useEffect } from 'react';
import { payrollAPI, staffAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaPlus } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Payroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [staff, setStaff] = useState([]);
  const [summary, setSummary] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    department: ''
  });
  const [formData, setFormData] = useState({
    staffId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    baseSalary: '',
    allowances: 0,
    deductions: 0,
    paymentMode: 'bank',
    remarks: ''
  });

  useEffect(() => {
    fetchPayrolls();
    fetchStaff();
    fetchSummary();
  }, [filters]);

  const fetchPayrolls = async () => {
    try {
      const response = await payrollAPI.getAll(filters);
      setPayrolls(response.data);
    } catch (error) {
      toast.error('Failed to fetch payrolls');
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await staffAPI.getAll();
      setStaff(response.data);
    } catch (error) {
      toast.error('Failed to fetch staff');
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await payrollAPI.getSummary({
        month: filters.month,
        year: filters.year
      });
      setSummary(response.data);
    } catch (error) {
      toast.error('Failed to fetch summary');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await payrollAPI.create(formData);
      toast.success('Payroll record added successfully');
      setShowModal(false);
      setFormData({
        staffId: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        baseSalary: '',
        allowances: 0,
        deductions: 0,
        paymentMode: 'bank',
        remarks: ''
      });
      fetchPayrolls();
      fetchSummary();
    } catch (error) {
      toast.error('Failed to add payroll record');
    }
  };

  const handleStaffChange = (staffId) => {
    const selectedStaff = staff.find(s => s._id === staffId);
    setFormData({
      ...formData,
      staffId,
      baseSalary: selectedStaff ? selectedStaff.baseSalary : ''
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Payroll Management</h1>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <FaPlus /> Add Payroll
        </button>
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Month:</label>
          <select 
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department:</label>
          <select 
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
          >
            <option value="">All Departments</option>
            <option value="academic">Academic</option>
            <option value="administration">Administration</option>
            <option value="sports">Sports</option>
            <option value="library">Library</option>
            <option value="transport">Transport</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Payroll Records</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Base Salary</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allowances</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deductions</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Mode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payrolls.map((payroll) => (
                  <tr key={payroll._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{payroll.staffId?.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{payroll.staffId?.department}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">₹{payroll.baseSalary.toLocaleString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">₹{payroll.allowances.toLocaleString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">₹{payroll.deductions.toLocaleString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">₹{payroll.netSalary.toLocaleString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{payroll.paymentMode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-4">Department-wise Summary</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={summary}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Bar dataKey="totalSalary" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {summary.map((item) => (
              <div key={item._id} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{item._id} ({item.count}):</span>
                <span className="font-medium">₹{item.totalSalary.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add Payroll Record</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Staff Member:</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.staffId}
                  onChange={(e) => handleStaffChange(e.target.value)}
                  required
                >
                  <option value="">Select Staff</option>
                  {staff.map((staffMember) => (
                    <option key={staffMember._id} value={staffMember._id}>
                      {staffMember.name} - {staffMember.employeeId} ({staffMember.department})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Salary:</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.baseSalary}
                  onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Allowances:</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.allowances}
                  onChange={(e) => setFormData({ ...formData, allowances: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Deductions:</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.deductions}
                  onChange={(e) => setFormData({ ...formData, deductions: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Net Salary:</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
                  value={parseFloat(formData.baseSalary || 0) + parseFloat(formData.allowances || 0) - parseFloat(formData.deductions || 0)}
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode:</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.paymentMode}
                  onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                >
                  <option value="bank">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks:</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button 
                  type="button" 
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Payroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payroll;