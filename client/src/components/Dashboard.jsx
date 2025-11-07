//simple dashboard using tailwind and react-router-dom

import React from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/services.jsx";
import Cookies from "js-cookie";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      Cookies.remove('token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/chat")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm">
                Chat
              </button>
              <button
                onClick={handleLogout}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
