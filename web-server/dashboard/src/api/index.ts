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

  // Get chart data (100 rows from current day or date range)
  async getChartData(startDate?: string, endDate?: string) {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await api.get('/chart', { params });
    return response.data;
  },

  // Get historical data
  async getHistoryData(hours: number = 24) {
    const response = await api.get(`/history?hours=${hours}`);
    return response.data;
  },

  // Get raw data
  async getRawData(source?: string, limit: number = 100, functionCode?: string) {
    const params: any = { limit };
    if (source) params.source = source;
    if (functionCode) params.functionCode = functionCode;
    const response = await api.get('/raw-data', { params });
    return response.data;
  },
};

export default api;
