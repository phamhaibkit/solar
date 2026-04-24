<template>
  <div class="container">
    <h2>☀️ ATESS Solar Monitoring Dashboard</h2>

    <div class="timestamp">{{ formattedTimestamp }}</div>

    <div class="device-info">
      <div>Logger SN: {{ dashboard.data.device?.loggerSN || '-' }} | Device SN: {{ dashboard.data.device?.deviceSN || '-' }}</div>
    </div>

    <div class="grid">
      <PvCard />
      <LoadCard />
      <BatteryCard />
      <GridCard />
      <GenCard />
    </div>

    <RealTimeChart />

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
import RealTimeChart from '../components/RealTimeChart.vue';

const dashboard = useDashboardStore();
const { formattedTimestamp, init, stopPolling } = dashboard;

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

h2 {
  color: white;
  text-align: center;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-size: 2rem;
}

.timestamp {
  color: white;
  text-align: center;
  font-size: 14px;
  opacity: 0.9;
}

.device-info {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
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
  grid-template-columns: repeat(5, 200px);
  gap: 15px;
  margin-bottom: 20px;
  justify-content: center;
}
</style>
