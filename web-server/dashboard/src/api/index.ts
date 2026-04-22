import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Get latest data
  async getLatestData() {
    const response = await api.get('/data');
    return response.data;
  },

  // Get historical data
  async getHistoryData(hours: number = 24) {
    const response = await api.get(`/history?hours=${hours}`);
    return response.data;
  },

  // Get raw data
  async getRawData(source?: string, limit: number = 100) {
    const params: any = { limit };
    if (source) params.source = source;
    const response = await api.get('/raw-data', { params });
    return response.data;
  },
};

export default api;
