import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import Dashboard from "../components/Dashboard";
import ForgotPassword from "../components/ForgotPassword";
import Chat from "../components/Chat";
import Cookies from "js-cookie";

const AppRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = Cookies.get('token') || localStorage.getItem('token');
    if (token && (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup')) {
      navigate('/dashboard');
    }
  }, [navigate, location]);

  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
};

export default AppRoutes;