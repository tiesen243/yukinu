import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { lazy } from '@trpc/server'

import { createTRPCRouter } from '@/trpc'

const appRouter = createTRPCRouter({
  auth: lazy(() => import('@/routers/auth.router')),
  user: lazy(() => import('@/routers/user.router')),
})

type AppRouter = typeof appRouter
type RouterInputs = inferRouterInputs<AppRouter>
type RouterOutputs = inferRouterOutputs<AppRouter>

export type { AppRouter, RouterInputs, RouterOutputs }
export { appRouter }
