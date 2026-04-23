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
  
  const status = ref<'Loading...' | 'Online' | 'Offline' | 'Error'>('Loading...');
  let pollingInterval: number | null = null;
  
  // Date range selection for chart
  const startDate = ref<string>('');
  const endDate = ref<string>('');
  
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

  const statusClass = computed(() => {
    if (status.value === 'Online') return 'status-online';
    if (status.value === 'Offline') return 'status-offline';
    return 'status-offline';
  });

  const isOffline = computed(() => {
    if (!data.value.timestamp) return true;
    const dataTime = new Date(data.value.timestamp);
    const now = new Date();
    const diffMinutes = (now.getTime() - dataTime.getTime()) / (1000 * 60);
    return diffMinutes > 10;
  });

  const displayData = computed(() => {
    if (isOffline.value) {
      return {
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
        timestamp: data.value.timestamp,
        device: data.value.device
      };
    }
    return data.value;
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

      // Check if data is older than 10 minutes
      if (latest && latest.timestamp) {
        const dataTime = new Date(latest.timestamp);
        const now = new Date();
        const diffMinutes = (now.getTime() - dataTime.getTime()) / (1000 * 60);
        status.value = diffMinutes > 10 ? 'Offline' : 'Online';
      } else {
        status.value = 'Offline';
      }
      
      // Add to history for chart (only if it's newer than last point)
      if (latest && latest.timestamp) {
        const lastTimestamp = historyData.value.length > 0 
          ? historyData.value[historyData.value.length - 1].timestamp 
          : null;
        
        if (!lastTimestamp || new Date(latest.timestamp) > new Date(lastTimestamp)) {
          const historyPoint = {
            timestamp: latest.timestamp,
            pvDaily: latest.pv?.daily || 0,
            loadDaily: latest.load?.daily || 0,
            batteryCharge: latest.battery?.charge || 0,
            batteryDischarge: latest.battery?.discharge || 0,
            batterySoc: latest.battery?.soc || 0,
            gridImportDaily: latest.grid?.import?.daily || 0,
            gridExportDaily: latest.grid?.export?.daily || 0,
            genDaily: latest.gen?.daily || 0,
          };
          
          historyData.value.push(historyPoint);
          
          // Keep only last 50 points
          if (historyData.value.length > 50) {
            historyData.value.shift();
          }
        }
      }
    } catch (error) {
      console.error('Error fetching latest data:', error);
      status.value = 'Error';
    }
  };

  const fetchHistoryData = async () => {
    try {
      let hours = 1; // default 1 hour
      
      if (startDate.value && endDate.value) {
        const start = new Date(startDate.value);
        const end = new Date(endDate.value);
        const diffMs = end.getTime() - start.getTime();
        hours = Math.max(1, diffMs / (1000 * 60 * 60));
      }
      
      const history = await apiService.getHistoryData(hours);
      
      // Transform history data to chart format
      historyData.value = history.map((item: any) => ({
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
      
      // Keep only last 50 points
      if (historyData.value.length > 50) {
        historyData.value = historyData.value.slice(-50);
      }
    } catch (error) {
      console.error('Error fetching history data:', error);
    }
  };

  const startPolling = () => {
    // Initial fetch - load history data first
    fetchHistoryData();
    fetchLatestData();
    
    // Poll every 10 seconds for latest data
    pollingInterval = window.setInterval(() => {
      fetchLatestData();
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
    displayData,
    isOffline,
    status,
    formattedTimestamp,
    statusClass,
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
