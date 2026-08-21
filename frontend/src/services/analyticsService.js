import api from './api';

export const analyticsService = {
  getSummary: async (params = {}) => {
    const response = await api.get('/analytics/summary', { params });
    return response.data;
  },

  getMonthlyAnalytics: async (params = {}) => {
    const response = await api.get('/analytics/monthly', { params });
    return response.data;
  },

  getCategoryAnalytics: async (params = {}) => {
    const response = await api.get('/analytics/category', { params });
    return response.data;
  },

  getInsights: async () => {
    const response = await api.get('/analytics/insights');
    return response.data;
  },
};
