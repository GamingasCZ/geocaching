import { createRouter, createWebHistory } from 'vue-router'
import DomovskaStranka from './Domov.vue'
import Videa from './Videa.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'domov',
      component: DomovskaStranka
    },
    {
      path: '/videa',
      name: 'videa',
      component: Videa
    }
  ]
})

export default router
