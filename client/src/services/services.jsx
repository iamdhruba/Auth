const API_BASE_URL = import.meta.env.PROD 
  ? "https://auth-t07c.onrender.com/api"
  : "http://localhost:4000/api";

export const authAPI = {
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
      return { data };
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  login: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      return { data };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      return await response.json();
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },

  sendOTP: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }
      return data;
    } catch (error) {
      console.error("Send OTP error:", error);
      throw error;
    }
  },

  verifyOTPAndResetPassword: async (email, otp, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }
      return data;
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  },
};
