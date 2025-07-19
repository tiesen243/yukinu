import { createRouter, createWebHistory } from 'vue-router'

import Index from '@/routes/_index.vue'

export const router = createRouter({
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
    },
    {
      path: '/p/:id',
      name: 'product-detail',
      component: () => import('@/routes/product-detail.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/routes/not-found.vue'),
    },
  ],
})
