<template>
  <div class="card">
    <div class="card-header">
      <span class="card-icon">⚡</span>
      <span class="card-title">Grid</span>
    </div>
    <div class="grid-section">
      <div class="grid-item">
        <div class="label">Import</div>
        <div class="value">{{ formatNumber(data.grid?.import?.daily) }}<span class="unit">kWh</span></div>
        <div class="subvalue">Total: {{ formatNumber(data.grid?.import?.total) }}<span class="unit">MWh</span></div>
      </div>
      <div class="grid-item">
        <div class="label">Export</div>
        <div class="value">{{ formatNumber(data.grid?.export?.daily) }}<span class="unit">kWh</span></div>
        <div class="subvalue">Total: {{ formatNumber(data.grid?.export?.total) }}<span class="unit">MWh</span></div>
      </div>
    </div>
    <div class="card-label">Import from grid / Export to grid</div>
  </div>
</template>

<script setup lang="ts">
import { useDashboardStore } from '../stores/dashboard';

const dashboard = useDashboardStore();
const { data, formatNumber } = dashboard;
</script>

<style scoped>
.card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.card-icon {
  font-size: 24px;
  margin-right: 10px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.grid-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.grid-item {
  background: #f0f0f0;
  padding: 15px;
  border-radius: 8px;
}

.grid-item .label {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.grid-item .value {
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
}

.grid-item .unit {
  font-size: 14px;
  color: #999;
}

.grid-item .subvalue {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.card-label {
  font-size: 12px;
  color: #999;
  margin-top: 10px;
  font-style: italic;
}
</style>
