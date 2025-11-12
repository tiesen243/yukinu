import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { lazy } from '@trpc/server'

import { db } from '@yukinu/db'

import { createTRPCRouter, publicProcedure } from '@/trpc'

const appRouter = createTRPCRouter({
  auth: lazy(() => import('@/routers/auth.router')),
  profile: lazy(() => import('@/routers/profile.router')),
  user: lazy(() => import('@/routers/user.router')),
  vendor: lazy(() => import('@/routers/vendor.router')),

  health: publicProcedure.query(async () => {
    const health = {
      status: 'ok',
      database: 'connected',
      uptime: process.uptime(),
      timestamp: new Date(),
    }

    try {
      await db.execute('SELECT 1')
    } catch {
      health.database = 'disconnected'
    }

    return health
  }),
})

type AppRouter = typeof appRouter

type RouterInputs = inferRouterInputs<AppRouter>
type RouterOutputs = inferRouterOutputs<AppRouter>

export type { AppRouter, RouterInputs, RouterOutputs }
export { appRouter }
