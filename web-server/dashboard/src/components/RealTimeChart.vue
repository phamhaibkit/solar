<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

import { useDashboardStore } from '../stores/dashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const dashboard = useDashboardStore();
const { changeRange, startDate, endDate } = dashboard;

const tempStartDate = ref<string>(startDate);
const tempEndDate = ref<string>(endDate);
const isLoading = ref<boolean>(true);

// Watch historyData to set loading state
watch(() => dashboard.historyData, () => {
  // Set loading to false after first fetch attempt
  isLoading.value = false;
}, { immediate: true });

// Fallback timeout to ensure loading doesn't get stuck
setTimeout(() => {
  isLoading.value = false;
}, 5000); // 5 seconds max wait

const quickRanges = [
  { label: 'Day', value: 'day' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
  { label: 'Total', value: 'total' },
];

const applyDateRange = () => {
  if (tempStartDate.value && tempEndDate.value) {
    isLoading.value = true;
    changeRange(tempStartDate.value, tempEndDate.value);
  }
};

const selectQuickRange = (range: string) => {
  isLoading.value = true;
  const now = new Date();
  const end = new Date();
  const start = new Date();

  switch (range) {
    case 'day':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(now.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'year':
      start.setMonth(0);
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11);
      end.setDate(31);
      end.setHours(23, 59, 59, 999);
      break;
    case 'total':
      // Get all data - set start to a very old date
      start.setFullYear(2020);
      start.setMonth(0);
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;
  }

  tempStartDate.value = start.toISOString().split('T')[0];
  tempEndDate.value = end.toISOString().split('T')[0];
  changeRange(tempStartDate.value, tempEndDate.value);
};

interface HistoryPoint {
  timestamp: string;
  pvDaily: number;
  loadDaily: number;
  batteryCharge: number;
  batteryDischarge: number;
  batterySoc: number;
  gridImportDaily: number;
  gridExportDaily: number;
  genDaily: number;
}

const chartData = computed(() => {
  const historyData: HistoryPoint[] = dashboard.historyData;
  
  const labels = historyData.map((d: HistoryPoint) => {
    const date = new Date(d.timestamp);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  });

  return {
    labels,
    datasets: [
      {
        label: 'PV Daily (kWh)',
        data: historyData.map((d: HistoryPoint) => d.pvDaily),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Load Daily (kWh)',
        data: historyData.map((d: HistoryPoint) => d.loadDaily),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Battery Charge (kWh)',
        data: historyData.map((d: HistoryPoint) => d.batteryCharge),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Battery Discharge (kWh)',
        data: historyData.map((d: HistoryPoint) => d.batteryDischarge),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Grid Import (kWh)',
        data: historyData.map((d: HistoryPoint) => d.gridImportDaily),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Grid Export (kWh)',
        data: historyData.map((d: HistoryPoint) => d.gridExportDaily),
        borderColor: '#ec4899',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'GEN Daily (kWh)',
        data: historyData.map((d: HistoryPoint) => d.genDaily),
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Battery SOC (%)',
        data: historyData.map((d: HistoryPoint) => d.batterySoc),
        borderColor: '#fbbf24',
        backgroundColor: 'rgba(251, 191, 36, 0.2)',
        fill: false,
        tension: 0.4,
        yAxisID: 'y1',
        borderDash: [5, 5],
        borderWidth: 3,
      },
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 300,
  },
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: 'white',
        font: {
          size: 12,
        },
        usePointStyle: true,
        padding: 15,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: 'white',
      bodyColor: 'white',
      padding: 12,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.7)',
        font: {
          size: 11,
        },
        maxTicksLimit: 10,
      },
    },
    y: {
      type: 'linear' as const,
      display: true,
      position: 'left' as const,
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.7)',
        font: {
          size: 11,
        },
        stepSize: 30,
      },
      beginAtZero: true,
      max: 150,
      title: {
        display: true,
        text: 'Power (kWh)',
        color: 'rgba(255, 255, 255, 0.8)',
        font: {
          size: 12,
        },
      },
    },
    y1: {
      type: 'linear' as const,
      display: true,
      position: 'right' as const,
      grid: {
        drawOnChartArea: false,
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.7)',
        font: {
          size: 11,
        },
        stepSize: 20,
      },
      min: 0,
      max: 100,
      title: {
        display: true,
        text: 'SOC (%)',
        color: 'rgba(255, 255, 255, 0.8)',
        font: {
          size: 12,
        },
      },
    },
  },
};
</script>

<template>
  <div class="chart-container">
    <div class="chart-header">
      <h2 class="chart-title">Real-time Energy Data</h2>
      <div class="date-controls">
        <div class="quick-ranges">
          <button 
            v-for="range in quickRanges" 
            :key="range.value"
            @click="selectQuickRange(range.value)"
            class="quick-btn"
          >
            {{ range.label }}
          </button>
        </div>
        <div class="date-pickers">
          <input 
            type="date" 
            v-model="tempStartDate" 
            class="date-input"
          />
          <span class="date-separator">-</span>
          <input 
            type="date" 
            v-model="tempEndDate" 
            class="date-input"
          />
          <button @click="applyDateRange" class="apply-btn">Apply</button>
        </div>
      </div>
    </div>
    <div class="chart-wrapper">
      <div v-if="isLoading" class="loading">
        <div class="spinner"></div>
        <span>Loading data...</span>
      </div>
      <Line
        v-else-if="dashboard.historyData.length > 0"
        :data="chartData"
        :options="chartOptions"
      />
      <div v-else class="no-data">
        No data available
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 15px;
}

.chart-title {
  color: white;
  font-size: 20px;
  margin: 0;
  font-weight: 600;
}

.date-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
}

.quick-ranges {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.quick-btn {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}

.quick-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.date-pickers {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-input {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
}

.date-input::-webkit-calendar-picker-indicator {
  filter: invert(1);
}

.date-separator {
  color: white;
  font-size: 14px;
}

.apply-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.3);
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}

.apply-btn:hover {
  background: rgba(255, 255, 255, 0.4);
}

.chart-wrapper {
  position: relative;
  height: 350px;
  width: 100%;
}

.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 350px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 350px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  gap: 15px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
