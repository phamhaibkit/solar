<template>
  <div class="card">
    <div class="card-header">
      <span class="card-icon">🔌</span>
      <span class="card-title">Load Consumption</span>
    </div>
    <div class="card-value">{{ formatNumber(data.load?.daily) }}<span class="card-unit">kWh</span></div>
    <div class="card-subvalue">Total: {{ formatNumber(data.load?.total) }}<span class="card-unit">kWh</span></div>
    <div class="card-label">Consumption of load</div>
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

.card-value {
  font-size: 36px;
  font-weight: 700;
  color: #667eea;
  margin: 10px 0;
}

.card-subvalue {
  font-size: 14px;
  color: #666;
  margin: 5px 0;
}

.card-unit {
  font-size: 16px;
  color: #999;
  margin-left: 5px;
}

.card-label {
  font-size: 12px;
  color: #999;
  margin-top: 10px;
  font-style: italic;
}
</style>
