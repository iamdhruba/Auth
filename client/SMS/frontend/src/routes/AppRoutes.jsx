import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import LandingPage from '../landing/LandingPage';
import Login from '../auth/Login';
import Register from '../auth/Register';
import Dashboard from '../pages/Dashboard';
import Students from '../pages/Students';
import Fees from '../pages/Fees';
import FinancialManagement from '../pages/FinancialManagement';
import Staff from '../pages/Staff';
import Payroll from '../pages/Payroll';
import Reports from '../pages/Reports';
import MyFees from '../pages/MyFees';
import MyReports from '../pages/MyReports';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      {/* Admin & Accountant Routes */}
      <Route path="/students" element={
        <ProtectedRoute roles={['admin', 'accountant', 'teacher']}>
          <Students />
        </ProtectedRoute>
      } />
      
      <Route path="/fees" element={
        <ProtectedRoute roles={['admin', 'accountant']}>
          <Fees />
        </ProtectedRoute>
      } />
      
      <Route path="/financial" element={
        <ProtectedRoute roles={['admin', 'accountant']}>
          <FinancialManagement />
        </ProtectedRoute>
      } />
      
      <Route path="/staff" element={
        <ProtectedRoute roles={['admin']}>
          <Staff />
        </ProtectedRoute>
      } />
      
      <Route path="/payroll" element={
        <ProtectedRoute roles={['admin', 'accountant']}>
          <Payroll />
        </ProtectedRoute>
      } />
      
      <Route path="/reports" element={
        <ProtectedRoute roles={['admin', 'accountant', 'teacher']}>
          <Reports />
        </ProtectedRoute>
      } />
      
      {/* Student & Parent Routes */}
      <Route path="/my-fees" element={
        <ProtectedRoute roles={['student', 'parent']}>
          <MyFees />
        </ProtectedRoute>
      } />
      
      <Route path="/my-reports" element={
        <ProtectedRoute roles={['student', 'parent']}>
          <MyReports />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;