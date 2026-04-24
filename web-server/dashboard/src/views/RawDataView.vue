<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiService } from '../api';

interface RawDataRow {
  id: number;
  function_code: string | null;
  source: string;
  timestamp: string;
  data_length: number;
  data: string;
}

const rawData = ref<RawDataRow[]>([]);
const selectedSource = ref<string>('');
const selectedFunctionCode = ref<string>('');
const limit = ref(20);
const loading = ref(false);

const fetchRawData = async () => {
  loading.value = true;
  try {
    rawData.value = await apiService.getRawData(
      selectedSource.value || undefined,
      limit.value,
      selectedFunctionCode.value || undefined
    );
  } catch (error) {
    console.error('Error fetching raw data:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchRawData();
});

const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('vi-VN');
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};
</script>

<template>
  <div class="raw-data-container">
    <div class="header">
      <h1>Raw Data</h1>
      <div class="controls">
        <select v-model="selectedSource" @change="fetchRawData" class="source-select">
          <option value="">All Sources</option>
          <option value="COLLECTOR">COLLECTOR</option>
          <option value="WEB_SERVER">WEB_SERVER</option>
        </select>
        <select v-model="selectedFunctionCode" @change="fetchRawData" class="function-code-select">
          <option value="">All Function Codes</option>
          <option v-for="i in 48" :key="i" :value="'0x' + i.toString(16).padStart(2, '0').toUpperCase()">
            0x{{ i.toString(16).padStart(2, '0').toUpperCase() }}
          </option>
        </select>
        <input
          v-model.number="limit"
          type="number"
          min="10"
          max="500"
          @change="fetchRawData"
          class="limit-input"
          placeholder="Limit"
        />
        <button @click="fetchRawData" class="refresh-btn">Refresh</button>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading...</div>

    <div v-else class="data-table">
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>ID</th>
            <th>Function Code</th>
            <th>Source</th>
            <th>Timestamp</th>
            <th>Data Length</th>
            <th>Data (Hex)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in rawData" :key="row.id">
            <td>{{ index + 1 }}</td>
            <td>{{ row.id }}</td>
            <td>{{ row.function_code || '-' }}</td>
            <td>{{ row.source }}</td>
            <td>{{ formatTimestamp(row.timestamp) }}</td>
            <td>{{ row.data_length }}</td>
            <td class="hex-cell">
              <code>{{ row.data }}</code>
              <button @click="copyToClipboard(row.data)" class="copy-btn">Copy</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="rawData.length === 0" class="no-data">
        No data found
      </div>
    </div>
  </div>
</template>

<style scoped>
.raw-data-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.header h1 {
  color: white;
  font-size: 28px;
  margin: 0;
}

.controls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.source-select, .function-code-select, .limit-input {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
}

.limit-input {
  width: 80px;
}

.refresh-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.loading {
  color: white;
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.data-table {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  color: white;
}

thead th {
  text-align: left;
  padding: 12px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  font-weight: 600;
  font-size: 14px;
}

tbody td {
  padding: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 13px;
}

tbody tr:hover {
  background: rgba(255, 255, 255, 0.05);
}

.hex-cell {
  position: relative;
  max-width: 400px;
  word-break: break-all;
}

.hex-cell code {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  display: block;
  margin-bottom: 5px;
}

.copy-btn {
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 11px;
  transition: background 0.2s;
}

.copy-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.no-data {
  text-align: center;
  color: white;
  padding: 40px;
  font-size: 16px;
}
</style>
