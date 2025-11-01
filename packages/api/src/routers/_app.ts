import { lazy } from '@trpc/server'

import { createTRPCRouter } from '../trpc'

export const appRouter = createTRPCRouter({
  auth: lazy(() => import('./auth.router')),
  user: lazy(() => import('./user.router')),
})

export type AppRouter = typeof appRouter
