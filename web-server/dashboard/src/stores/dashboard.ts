import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiService } from '../api';

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const data = ref({
    pv: { daily: 0, total: 0, dailyUnit: 'kWh', totalUnit: 'MWh', label: 'Generated energy of PV' },
    load: { daily: 0, total: 0, dailyUnit: 'kWh', totalUnit: 'kWh', label: 'Consumption of load' },
    battery: { charge: 0, discharge: 0, unit: 'kWh', label: 'Battery charge/discharge' },
    grid: { 
      import: { daily: 0, total: 0 }, 
      export: { daily: 0, total: 0 }, 
      dailyUnit: 'kWh', 
      totalUnit: 'MWh', 
      label: 'Import from grid / Export to grid' 
    },
    gen: { daily: 0, total: 0, dailyUnit: 'kWh', totalUnit: 'MWh', label: 'GEN Energy' },
    timestamp: new Date().toISOString(),
    device: { loggerSN: '', deviceSN: '' }
  });
  
  let pollingInterval: number | null = null;

  // Date range selection for chart (default to today)
  const today = new Date().toISOString().split('T')[0];
  const startDate = ref<string>(today);
  const endDate = ref<string>(today);
  
  // History data for chart (max 50 points)
  const historyData = ref<Array<{
    timestamp: string;
    pvDaily: number;
    loadDaily: number;
    batteryCharge: number;
    batteryDischarge: number;
    batterySoc: number;
    gridImportDaily: number;
    gridExportDaily: number;
    genDaily: number;
  }>>([]);

  // Computed
  const formattedTimestamp = computed(() => {
    if (!data.value.timestamp) return 'Loading...';
    return new Date(data.value.timestamp).toLocaleString('vi-VN');
  });

  // Methods
  const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return '0';
    return num.toLocaleString('vi-VN', { maximumFractionDigits: 2 });
  };

  const fetchLatestData = async () => {
    try {
      const latest = await apiService.getLatestData();
      data.value = latest;
    } catch (error) {
      console.error('Error fetching latest data:', error);
    }
  };

  const fetchHistoryData = async () => {
    try {
      const chart = await apiService.getChartData(startDate.value, endDate.value);

      // Transform chart data to chart format
      historyData.value = chart.map((item: any) => ({
        timestamp: item.timestamp,
        pvDaily: item.pv?.daily || 0,
        loadDaily: item.load?.daily || 0,
        batteryCharge: item.battery?.charge || 0,
        batteryDischarge: item.battery?.discharge || 0,
        batterySoc: item.battery?.soc || 0,
        gridImportDaily: item.grid?.import?.daily || 0,
        gridExportDaily: item.grid?.export?.daily || 0,
        genDaily: item.gen?.daily || 0,
      }));
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  const startPolling = () => {
    // Initial fetch - load chart data and latest data
    fetchHistoryData();
    fetchLatestData();

    // Poll every 10 seconds for latest data and chart data
    pollingInterval = window.setInterval(() => {
      fetchLatestData();
      fetchHistoryData();
    }, 10000);
  };

  const changeRange = (start: string, end: string) => {
    startDate.value = start;
    endDate.value = end;
    fetchHistoryData();
  };

  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  };

  // Initialize
  const init = () => {
    startPolling();
  };

  return {
    data,
    formattedTimestamp,
    formatNumber,
    historyData,
    startDate,
    endDate,
    fetchLatestData,
    fetchHistoryData,
    changeRange,
    startPolling,
    stopPolling,
    init,
  };
});
