<template>
  <div class="card">
    <div class="card-header">
      <span class="card-icon">⚡</span>
      <span class="card-title">Grid (kWh)</span>
    </div>
    <div class="grid-section">
      <div class="grid-item">
        <div class="label">Import</div>
        <div class="value">{{ formatNumber(dashboard.data.grid?.import?.daily) }}</div>
      </div>
      <div class="grid-item">
        <div class="label">Export</div>
        <div class="value">{{ formatNumber(dashboard.data.grid?.export?.daily) }}</div>
      </div>
    </div>
    <div class="card-label">Import from grid / Export to grid</div>
  </div>
</template>

<script setup lang="ts">
import { useDashboardStore } from '../stores/dashboard';

const dashboard = useDashboardStore();
const { formatNumber } = dashboard;
</script>

<style scoped>
.card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.card-icon {
  font-size: 18px;
  margin-right: 8px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.grid-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.grid-item {
  background: #f0f0f0;
  padding: 8px;
  border-radius: 6px;
}

.grid-item .label {
  font-size: 10px;
  color: #666;
  margin-bottom: 3px;
}

.grid-item .value {
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
}

.grid-item .unit {
  font-size: 10px;
  color: #999;
}

.grid-item .subvalue {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.card-label {
  font-size: 10px;
  color: #999;
  margin-top: 8px;
  font-style: italic;
}
</style>
