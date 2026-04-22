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
  
  const status = ref<'Loading...' | 'Online' | 'Error'>('Loading...');
  let pollingInterval: number | null = null;

  // Computed
  const formattedTimestamp = computed(() => {
    if (!data.value.timestamp) return 'Loading...';
    return new Date(data.value.timestamp).toLocaleString('vi-VN');
  });

  const statusClass = computed(() => {
    return status.value === 'Online' ? 'status-online' : 'status-offline';
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
      status.value = 'Online';
    } catch (error) {
      console.error('Error fetching latest data:', error);
      status.value = 'Error';
    }
  };

  const startPolling = () => {
    // Initial fetch
    fetchLatestData();
    
    // Poll every 10 seconds
    pollingInterval = window.setInterval(() => {
      fetchLatestData();
    }, 10000);
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
    status,
    formattedTimestamp,
    statusClass,
    formatNumber,
    fetchLatestData,
    startPolling,
    stopPolling,
    init,
  };
});
