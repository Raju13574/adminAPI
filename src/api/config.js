import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Ensure this matches your backend URL
});

// Add a request interceptor to include the token in the headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Define API methods
const apiMethods = {
  getUniqueCredentials: async () => {
    const token = localStorage.getItem('authToken');
    const response = await axios.get('/api/user/credentials', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response;
  },
  getWalletBalance: () => API.get('/wallet/balance'),
  getWalletTransactions: () => API.get('/wallet/transactions'),
  getWalletCreditSpent: () => API.get('/wallet/credit-spent'),
  addFunds: (amount) => API.post('/wallet/addbalance', { amountInRupees: amount }),
  getSubscriptionStatus: () => API.get('/subscription/status'),
  getAvailablePlans: () => API.get('/subscription/plans'),
  getUsageData: () => API.get('/usage/data'),
  getUserTransactions: () => API.get('/users/transactions'),
  upgradePlan: (planId) => API.post(`/subscription/plans/${planId}/upgrade`),
  cancelSubscription: () => API.post('/subscription/cancel'),
  getUserProfile: () => API.get('/users/profile'),
  getClientCredentials: () => API.get('/users/client-credentials'),
  getOverallUsage: () => API.get('/usage'),
  executeCode: async (language, code, input) => {
    try {
      const response = await API.post('/execute', { language, code, input });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        if (typeof error.response.data === 'string') {
          throw new Error(error.response.data);
        } else if (error.response.data.error) {
          throw new Error(error.response.data.error);
        }
      }
      throw new Error('An unexpected error occurred during code execution');
    }
  },
  getCreditSpent: () => API.get('/wallet/credit-spent'),
  purchaseCredits: (credits) => API.post('/wallet/purchase-credits', { credits }),
  getPurchasedCredits: () => API.get('/wallet/purchased-credits'),
  getAnalyticsData: (interval) => 
    API.get(`/analytics/data?interval=${interval}`),
  getLanguageUsage: (language) => 
    API.get(`/usage/language/${language}`)
};

// Combine the axios instance with the API methods
const combinedAPI = {
  ...API,
  ...apiMethods
};

export default combinedAPI;
