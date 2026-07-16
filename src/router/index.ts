import { createRouter, createWebHistory } from 'vue-router'
import JourneyView from '../views/JourneyView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/journey',
    },
    {
      path: '/journey',
      name: 'journey',
      component: JourneyView,
    },
    {
      path: '/status',
      name: 'status',
      component: () => import('../views/StatusView.vue'),
    },
    {
      path: '/pass',
      name: 'pass',
      component: () => import('../views/PassView.vue'),
    },
  ],
})

export default router
