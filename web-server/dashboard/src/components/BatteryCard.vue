<template>
  <div class="card">
    <div class="card-header">
      <span class="card-icon">🔋</span>
      <span class="card-title">Battery (kWh)</span>
    </div>
    <div class="battery-section">
      <div class="battery-item">
        <div class="value">{{ formatNumber(dashboard.data.battery?.charge) }}</div>
        <div class="unit">Charge</div>
      </div>
      <div class="battery-item">
        <div class="value">{{ formatNumber(dashboard.data.battery?.discharge) }}</div>
        <div class="unit">Discharge</div>
      </div>
    </div>
    <div class="card-label">Battery charge/discharge</div>
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

.battery-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.battery-item {
  background: #f0f0f0;
  padding: 8px;
  border-radius: 6px;
  text-align: center;
}

.battery-item .value {
  font-size: 22px;
  font-weight: 700;
  color: #667eea;
}

.battery-item .unit {
  font-size: 10px;
  color: #666;
}

.card-label {
  font-size: 10px;
  color: #999;
  margin-top: 8px;
  font-style: italic;
}
</style>
