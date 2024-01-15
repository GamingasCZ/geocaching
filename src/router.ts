import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'domov',
      component: () => import('@/Domov.vue')
    },
    {
      path: '/videa',
      name: 'videa',
      component: () => import('@/Videa.vue')
    },
    {
      path: '/videa/:video',
      name: 'video',
      component: () => import('@/komponenty/Videoprehravac.vue'),
    },
    {
      path: '/hry',
      name: 'hry',
      component: () => import('@/Hry.vue')
    },
    {
      path: '/hry/:hra',
      name: 'hra',
      component: () => import('@/komponenty/Hroprehravac.vue')
    },
    {
      path: '/nastenka',
      name: 'nastenka',
      component: () => import('@/Nastenka.vue')
    },
  ]
})

export default router
