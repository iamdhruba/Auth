import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Students API
export const studentsAPI = {
  getAll: () => api.get('/students'),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

// Fees API
export const feesAPI = {
  recordPayment: (data) => api.post('/fees/payment', data),
  getPayments: (params) => api.get('/fees/payments', { params }),
  getStructures: () => api.get('/fees/structures'),
  createStructure: (data) => api.post('/fees/structure', data),
};

// Expenses API
export const expensesAPI = {
  create: (data) => api.post('/expenses', data),
  getAll: (params) => api.get('/expenses', { params }),
  getSummary: (params) => api.get('/expenses/summary', { params }),
  getCategories: () => api.get('/expenses/categories'),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
};

// Income API
export const incomeAPI = {
  create: (data) => api.post('/income', data),
  getAll: (params) => api.get('/income', { params }),
  getSummary: (params) => api.get('/income/summary', { params }),
  getCategories: () => api.get('/income/categories'),
  update: (id, data) => api.put(`/income/${id}`, data),
  delete: (id) => api.delete(`/income/${id}`),
};

// Staff API
export const staffAPI = {
  getAll: () => api.get('/staff'),
  create: (data) => api.post('/staff', data),
  update: (id, data) => api.put(`/staff/${id}`, data),
  delete: (id) => api.delete(`/staff/${id}`),
};

// Payroll API
export const payrollAPI = {
  create: (data) => api.post('/payroll', data),
  getAll: (params) => api.get('/payroll', { params }),
  getSummary: (params) => api.get('/payroll/summary', { params }),
};

// Budgets API
export const budgetsAPI = {
  create: (data) => api.post('/budgets', data),
  getAll: (params) => api.get('/budgets', { params }),
  update: (id, data) => api.put(`/budgets/${id}`, data),
  getVariance: (params) => api.get('/budgets/variance', { params }),
};

// Reports API
export const reportsAPI = {
  getDashboard: (params) => api.get('/reports/dashboard', { params }),
  exportExcel: (params) => api.get('/reports/export/excel', { 
    params, 
    responseType: 'blob' 
  }),
};

export default api;