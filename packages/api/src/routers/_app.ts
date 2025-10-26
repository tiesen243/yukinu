import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { lazy } from '@trpc/server'

import { createTRPCRouter, publicProcedure } from '../trpc'

const appRouter = createTRPCRouter({
  health: publicProcedure.query(async ({ ctx }) => {
    const { db, headers } = ctx

    let dbStatus = 'unknown'
    try {
      await db.execute('SELECT 1')
      dbStatus = 'connected'
    } catch {
      dbStatus = 'disconnected'
    }

    const ip = headers.get('x-forwarded-for') ?? headers.get('x-real-ip') ?? ''
    const userAgent = headers.get('user-agent') ?? ''
    const timestamp = new Date().toISOString()

    return {
      status: 'ok',
      timestamp,
      db: dbStatus,
      request: { ip, userAgent },
    }
  }),

  auth: lazy(() => import('./auth.router')),
  user: lazy(() => import('./user.router')),
})

type AppRouter = typeof appRouter

type RouterInputs = inferRouterInputs<AppRouter>
type RouterOutputs = inferRouterOutputs<AppRouter>

export type { AppRouter, RouterInputs, RouterOutputs }
export { appRouter }
