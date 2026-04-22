import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import RawDataView from '../views/RawDataView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/raw-data',
      name: 'raw-data',
      component: RawDataView,
    },
  ],
});

export default router;
