import { useState, useEffect } from 'react';
import { feesAPI, studentsAPI, reportsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaPlus, FaDownload } from 'react-icons/fa';

const Fees = () => {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    feeType: 'tuition',
    paymentMode: 'cash',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  useEffect(() => {
    fetchPayments();
    fetchStudents();
  }, [filters]);

  const fetchPayments = async () => {
    try {
      const response = await feesAPI.getPayments(filters);
      setPayments(response.data);
    } catch (error) {
      toast.error('Failed to fetch payments');
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await studentsAPI.getAll();
      setStudents(response.data);
    } catch (error) {
      toast.error('Failed to fetch students');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await feesAPI.recordPayment(formData);
      toast.success('Payment recorded successfully');
      setShowModal(false);
      setFormData({
        studentId: '',
        amount: '',
        feeType: 'tuition',
        paymentMode: 'cash',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      });
      fetchPayments();
    } catch (error) {
      toast.error('Failed to record payment');
    }
  };

  const exportToExcel = async () => {
    try {
      const response = await reportsAPI.exportExcel({
        type: 'fees',
        month: filters.month,
        year: filters.year
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `fee_payments_${filters.month}_${filters.year}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Report exported successfully');
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Fee Management</h1>
        <div className="flex gap-2">
          <button 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={exportToExcel}
          >
            <FaDownload /> Export Excel
          </button>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => setShowModal(true)}
          >
            <FaPlus /> Record Payment
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
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
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Receipt No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Mode</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{payment.receiptNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{payment.studentId?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{payment.studentId?.class}</td>
                <td className="px-6 py-4 whitespace-nowrap">{payment.feeType}</td>
                <td className="px-6 py-4 whitespace-nowrap">₹{payment.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">{payment.paymentMode}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(payment.paymentDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Record Fee Payment</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Student:</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  required
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.name} - {student.rollNumber} ({student.class})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Fee Type:</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.feeType}
                  onChange={(e) => setFormData({ ...formData, feeType: e.target.value })}
                >
                  <option value="tuition">Tuition Fee</option>
                  <option value="transport">Transport Fee</option>
                  <option value="library">Library Fee</option>
                  <option value="sports">Sports Fee</option>
                  <option value="exam">Exam Fee</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount:</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode:</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.paymentMode}
                  onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="online">Online</option>
                </select>
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
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fees;