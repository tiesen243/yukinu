import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import Index from '@/routes/_index.vue'
import NotFound from '@/routes/not-found.vue'
import ProductDetail from '@/routes/product-detail.vue'

const routes = [
  {
    path: '/',
    component: Index,
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFound,
  },
  {
    path: '/:id',
    component: ProductDetail,
  },
] as RouteRecordRaw[]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
