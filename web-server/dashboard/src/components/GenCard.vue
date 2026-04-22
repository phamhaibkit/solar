<template>
  <div class="card">
    <div class="card-header">
      <span class="card-icon">⚙️</span>
      <span class="card-title">GEN Energy</span>
    </div>
    <div class="card-value">{{ formatNumber(dashboard.data.gen?.daily) }}<span class="card-unit">kWh</span></div>
    <div class="card-label">GEN Energy</div>
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

.card-value {
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
  margin: 8px 0;
}

.card-subvalue {
  font-size: 14px;
  color: #666;
  margin: 5px 0;
}

.card-unit {
  font-size: 12px;
  color: #999;
  margin-left: 4px;
}

.card-label {
  font-size: 10px;
  color: #999;
  margin-top: 8px;
  font-style: italic;
}
</style>
