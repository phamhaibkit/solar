<template>
  <div class="card">
    <div class="card-header">
      <span class="card-icon">🔋</span>
      <span class="card-title">Battery</span>
    </div>
    <div class="battery-section">
      <div class="battery-item">
        <div class="value">{{ formatNumber(data.battery?.charge) }}<span class="unit">kWh</span></div>
        <div class="unit">Charge</div>
      </div>
      <div class="battery-item">
        <div class="value">{{ formatNumber(data.battery?.discharge) }}<span class="unit">kWh</span></div>
        <div class="unit">Discharge</div>
      </div>
    </div>
    <div class="card-label">Battery charge/discharge</div>
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

.battery-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.battery-item {
  background: #f0f0f0;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
}

.battery-item .value {
  font-size: 20px;
  font-weight: 600;
  color: #667eea;
}

.battery-item .unit {
  font-size: 12px;
  color: #666;
}

.card-label {
  font-size: 12px;
  color: #999;
  margin-top: 10px;
  font-style: italic;
}
</style>
