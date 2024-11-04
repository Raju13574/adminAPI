import axios from 'axios';
import config from './config';

const API_BASE_URL = 'http://localhost:5000/api'; // Ensure this matches your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor  
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request config:', config); // Add this line
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getAdminProfile = () => api.get('/admins/profile');
export const updateAdminProfile = (data) => api.put('/admins/profile', data);
export const changeAdminPassword = (data) => api.put('/admin/change-password', data);
export const getAllUsers = () => api.get('/admins/users');
export const createUser = (data) => api.post('/admin/users', data);
export const getUserById = (id) => api.get(`/admin/users/${id}`);
export const updateUserById = (id, data) => api.put(`/admin/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const getUserTransactions = (id) => api.get(`/admin/users/${id}/transactions`);
export const updateUserBalance = (id, data) => api.put(`/admin/users/${id}/balance`, data);
export const getAllTransactions = () => api.get('/admin/transactions');
export const promoteUserToAdmin = (id) => api.post(`/admin/users/${id}/promote`);
export const updateUserPassword = (id, data) => api.put(`/admin/users/${id}/password`, data);
export const getAPIUsageStats = (params) => api.get('/admin/stats/api-usage', { params });
export const getUserStatistics = () => api.get('/admin/stats/users');
export const getSubscriptionMetrics = () => api.get('/admin/stats/subscriptions');
export const getTopUsers = (params) => api.get('/admin/stats/top-users', { params });
export const getDashboardStats = () => api.get('/admin/stats/dashboard');
