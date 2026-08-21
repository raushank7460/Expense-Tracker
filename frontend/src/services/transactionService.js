import api from './api';

export const transactionService = {
  getTransactions: async (params = {}) => {
    const response = await api.get('/transactions', { params });
    return response.data;
  },

  exportTransactions: async () => {
    const response = await api.get('/transactions/export');
    return response.data;
  },
};
