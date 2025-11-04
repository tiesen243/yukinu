import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { lazy } from '@trpc/server'

import { createTRPCRouter, publicProcedure } from '../trpc'

const appRouter = createTRPCRouter({
  auth: lazy(() => import('./auth.router')),
  user: lazy(() => import('./user.router')),

  health: publicProcedure.query(async ({ ctx }) => {
    const health = {
      status: 'ok',
      database: 'connected',
      uptime: process.uptime(),
      timestamp: new Date(),
    }

    try {
      await ctx.db.execute('SELECT 1')
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
