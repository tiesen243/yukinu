import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import Index from '@/routes/_index.vue'
import NotFound from '@/routes/not-found.vue'

const routes = [
  {
    path: '/',
    component: Index,
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFound,
  },
] as RouteRecordRaw[]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
