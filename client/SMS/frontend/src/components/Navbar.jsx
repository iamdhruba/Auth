import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaUsers, FaMoneyBillWave, FaReceipt, FaUserTie, FaChartBar, FaFileAlt, FaSignOutAlt, FaUser, FaArrowUp, FaBalanceScale } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const getNavItems = () => {
    const baseItems = [
      { path: '/dashboard', icon: FaHome, label: 'Dashboard', roles: ['admin', 'accountant', 'teacher', 'student', 'parent'] }
    ];

    const adminItems = [
      { path: '/students', icon: FaUsers, label: 'Students', roles: ['admin', 'accountant', 'teacher'] },
      { path: '/fees', icon: FaMoneyBillWave, label: 'Fees', roles: ['admin', 'accountant'] },
      { path: '/financial', icon: FaBalanceScale, label: 'Financial', roles: ['admin', 'accountant'] },
      { path: '/staff', icon: FaUserTie, label: 'Staff', roles: ['admin'] },
      { path: '/payroll', icon: FaChartBar, label: 'Payroll', roles: ['admin', 'accountant'] },
      { path: '/reports', icon: FaFileAlt, label: 'Reports', roles: ['admin', 'accountant', 'teacher'] }
    ];

    const studentItems = [
      { path: '/my-fees', icon: FaMoneyBillWave, label: 'My Fees', roles: ['student', 'parent'] },
      { path: '/my-reports', icon: FaFileAlt, label: 'My Reports', roles: ['student', 'parent'] }
    ];

    return [...baseItems, ...adminItems, ...studentItems].filter(item => 
      item.roles.includes(user?.role)
    );
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="fixed left-0 top-0 w-64 h-screen bg-slate-800 text-white z-50">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-xl font-bold text-center">School FMS</h2>
        <div className="mt-3 text-center">
          <div className="flex items-center justify-center mb-2">
            <FaUser className="mr-2" />
            <span className="text-sm">{user?.name}</span>
          </div>
          <span className="text-xs bg-blue-600 px-2 py-1 rounded capitalize">
            {user?.role}
          </span>
        </div>
      </div>
      
      <ul className="mt-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-6 py-3 text-gray-300 hover:bg-slate-700 hover:text-white transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : ''
                }`}
              >
                <Icon className="mr-3" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="absolute bottom-0 w-full p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-2 py-2 text-gray-300 hover:bg-slate-700 hover:text-white transition-colors rounded"
        >
          <FaSignOutAlt className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;