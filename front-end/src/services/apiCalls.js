import axios from 'axios';
import { useError } from '../contexts/ErrorContext';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5858';

// Create a preconfigured axios instance to avoid repetition
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// Token management utilities
export const tokenManager = {
  get: () => localStorage.getItem('authToken'),
  set: (token) => localStorage.setItem('authToken', token),
  clear: () => localStorage.removeItem('authToken'),
};

// Attach token automatically from localStorage
api.interceptors.request.use((config) => {
  const token = tokenManager.get();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Normalize error to have message and status
    const status = err.response?.status;
    const message = err.response?.data?.error || err.response?.data?.message || err.message || 'Request failed';
    const normalized = new Error(message);
    normalized.status = status;
    normalized.data = err.response?.data;
    
    // Auto-logout on 401
    if (status === 401) {
      tokenManager.clear();
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    
    return Promise.reject(normalized);
  }
);

/**
 * Bank API Service
 * Typed methods for all endpoints from OpenAPI spec
 */
// Helper to wrap API methods with error context
function withErrorHandler(apiObj, setError) {
  const wrapped = {};
  for (const key of Object.keys(apiObj)) {
    wrapped[key] = async (...args) => {
      try {
        return await apiObj[key](...args);
      } catch (err) {
        if (setError) setError({ code: err.status || 500, message: err.message || 'API error' });
        throw err;
      }
    };
  }
  return wrapped;
}

let BankAPI = {
  // ========== AUTH - Users ==========
  
  /**
   * Login user
   * POST /users/login
   * @returns {Promise<{success: boolean, token: string, message: string}>}
   */
  login: async (username, password) => {
    const res = await api.post('/users/login', { username, password });
    if (res.data.token) tokenManager.set(res.data.token);
    return res.data;
  },

  /**
   * Register new user
   * POST /users/register
   * @returns {Promise<{message: string, accountId: string, userId: string, token: string}>}
   */
  register: async (userData) => {
    const res = await api.post('/users/register', userData);
    if (res.data.token) tokenManager.set(res.data.token);
    return res.data;
  },

  // ========== AUTH - Admin ==========
  
  /**
   * Admin login
   * POST /admin/login
   * @returns {Promise<{success: boolean, token: string, message: string}>}
   */
  adminLogin: async (username, password) => {
    const res = await api.post('/admin/login', { username, password });
    if (res.data.token) tokenManager.set(res.data.token);
    return res.data;
  },

  /**
   * Create admin user (requires admin auth)
   * POST /admin/create
   * @returns {Promise<{success: boolean, message: string}>}
   */
  createAdmin: async (username, password) => {
    const res = await api.post('/admin/create', { username, password });
    return res.data;
  },

  // ========== ACCOUNTS ==========
  
  /**
   * Get accounts for current user
   * GET /accounts
   * @returns {Promise<{_id: string, iban: string, balance: number, currency: string, userId: string, createdAt: string, updatedAt: string}>}
   */
  getAccounts: async () => {
    const res = await api.get('/accounts');
    return res.data;
  },

  /**
   * Create new account
   * POST /accounts/create
   * @returns {Promise<{message: string, accountId: string, iban: string, balance: number, currency: string}>}
   */
  createAccount: async (userId, currency = 'EUR', accountName) => {
    const res = await api.post('/accounts/create', { userId, currency, name: accountName });
    return res.data;
  },

  // ========== TRANSACTIONS ==========
  
  /**
   * Send transaction
   * POST /transactions/make-transaction
   * @returns {Promise<{message: string, transactionId: string, amount: number, currency: string, status: string, xml: string}>}
   */
  sendTransaction: async (transactionData) => {
    const res = await api.post('/transactions/make-transaction', transactionData);
    return res.data;
  },

  // ========== HISTORY ==========
  
  /**
   * Get transaction history
   * GET /history?iban=...&startDate=...&endDate=...
   * @returns {Promise<Array<{transactionId: string, fromIban: string, toIban: string, amount: number, currency: string, description: string, status: string, createdAt: string}>>}
   */
  getHistory: async (iban, startDate, endDate) => {
    const res = await api.get('/history', {
      params: { iban, startDate, endDate },
    });
    return res.data;
  },

  // ========== RECIPIENTS ==========
  
  /**
   * Get saved recipients for current user
   * GET /history/recipients
   * @returns {Promise<Array<{iban: string, name: string}>>}
   */
  getRecipients: async () => {
    const res = await api.get('/users/get-saved-recipients',);
    console.log('API getRecipients response:', res.data);
    return res.data;
  },

  // ========== ADMIN LOGS ==========
  
  /**
   * Get admin audit logs (admin only)
   * GET /admin/logs
   * @returns {Promise<{success: boolean, data: Array}>}
   */
  getAdminLogs: async (filters = {}) => {
    const res = await api.get('/admin/logs', { params: filters });
    return res.data;
  },


};

// Hook to get error-aware BankAPI
export function useBankAPIWithError() {
  const { setError } = useError();
  return withErrorHandler(BankAPI, setError);
}

export { BankAPI, api };