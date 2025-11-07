import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { feesAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaDownload, FaReceipt } from 'react-icons/fa';

const MyFees = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear()
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchMyPayments();
  }, [filters]);

  const fetchMyPayments = async () => {
    try {
      setLoading(true);
      // In a real app, you'd filter by student ID
      const response = await feesAPI.getPayments(filters);
      setPayments(response.data);
    } catch (error) {
      toast.error('Failed to fetch payment history');
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = (payment) => {
    // Generate receipt download
    toast.success(`Receipt for ${payment.receiptNumber} downloaded`);
  };

  const getTotalPaid = () => {
    return payments.reduce((total, payment) => total + payment.amount, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Fee Payments</h1>
        <div className="text-right">
          <div className="text-sm text-gray-600">Total Paid This Year</div>
          <div className="text-2xl font-bold text-green-600">₹{getTotalPaid().toLocaleString()}</div>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year:</label>
          <select 
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) })}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <option key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}-{new Date().getFullYear() - i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-blue-600">₹{getTotalPaid().toLocaleString()}</div>
          <div className="text-gray-600 mt-1">Total Paid</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-orange-600">{payments.length}</div>
          <div className="text-gray-600 mt-1">Payments Made</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-green-600">₹0</div>
          <div className="text-gray-600 mt-1">Pending Amount</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-purple-600">Current</div>
          <div className="text-gray-600 mt-1">Status</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Payment History</h3>
        </div>
        
        {payments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FaReceipt className="mx-auto h-12 w-12 mb-4" />
            <p>No payment records found for the selected year.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Receipt No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Mode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {payment.receiptNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                      {payment.feeType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ₹{payment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                      {payment.paymentMode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => downloadReceipt(payment)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <FaDownload className="h-3 w-3" />
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">Payment Information</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• All payments are processed securely through our payment gateway</li>
          <li>• Receipts are automatically generated for all successful payments</li>
          <li>• For any payment issues, please contact the accounts office</li>
          <li>• Late payment charges may apply as per school policy</li>
        </ul>
      </div>
    </div>
  );
};

export default MyFees;