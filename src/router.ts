import { createRouter, createWebHistory } from 'vue-router'
import DomovskaStranka from './Domov.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'domov',
      component: DomovskaStranka
    }
  ]
})

export default router
