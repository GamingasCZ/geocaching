import { createRouter, createWebHistory } from 'vue-router'
import DomovskaStranka from './Domov.vue'
import Videa from './Videa.vue'
import Videoprehravac from './komponenty/Videoprehravac.vue'
import Hry from './Hry.vue'
import Nastenka from './Nastenka.vue'

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
    },
    {
      path: '/videa/:video',
      name: 'video',
      component: Videoprehravac,
    },
    {
      path: '/hry',
      name: 'hry',
      component: Hry
    },
    {
      path: '/nastenka',
      name: 'nastenka',
      component: Nastenka
    },
  ]
})

export default router
