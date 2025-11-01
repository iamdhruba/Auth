const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const authAPI = {
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      return { data };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  login: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      return { data };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'GET',
        credentials: 'include'
      });
      return await response.json();
    } catch (error) {
      throw new Error('Logout failed');
    }
  },

  sendOTP: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }
      return data;
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    }
  },

  verifyOTPAndResetPassword: async (email, otp, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/verify-otp-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }
      return data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }
};