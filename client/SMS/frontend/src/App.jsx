import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';

function App() {
  const location = useLocation();
  const isPublicRoute = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        {!isPublicRoute && <Navbar />}
        <main className={!isPublicRoute ? "ml-64 p-6" : ""}>
          <AppRoutes />
        </main>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </AuthProvider>
  );
}

export default App;