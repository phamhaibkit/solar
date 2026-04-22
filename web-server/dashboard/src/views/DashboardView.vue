<template>
  <div class="container">
    <h1>☀️ ATESS Solar Monitoring Dashboard</h1>
    
    <div class="timestamp">{{ formattedTimestamp }}</div>
    
    <div class="device-info">
      <div>Logger SN: {{ data.device?.loggerSN || '-' }} | Device SN: {{ data.device?.deviceSN || '-' }}</div>
      <div>Status: <span :class="statusClass">{{ status }}</span></div>
    </div>
    
    <div class="grid">
      <PvCard />
      <LoadCard />
      <BatteryCard />
      <GridCard />
      <GenCard />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useDashboardStore } from '../stores/dashboard';
import PvCard from '../components/PvCard.vue';
import LoadCard from '../components/LoadCard.vue';
import BatteryCard from '../components/BatteryCard.vue';
import GridCard from '../components/GridCard.vue';
import GenCard from '../components/GenCard.vue';

const dashboard = useDashboardStore();
const { data, status, formattedTimestamp, statusClass, init, stopPolling } = dashboard;

onMounted(() => {
  init();
});

onUnmounted(() => {
  stopPolling();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: white;
  text-align: center;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.timestamp {
  color: white;
  text-align: center;
  margin-bottom: 20px;
  font-size: 14px;
  opacity: 0.9;
}

.device-info {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  color: white;
  text-align: center;
}

.status-online {
  color: #4CAF50;
  font-weight: 600;
}

.status-offline {
  color: #f44336;
  font-weight: 600;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}
</style>
