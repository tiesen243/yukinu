import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import { lazy } from '@trpc/server'

import { createTRPCRouter } from '@/trpc'

const appRouter = createTRPCRouter({
  auth: lazy(() => import('@/routers/auth.router')),
  category: lazy(() => import('@/routers/category.router')),
  order: lazy(() => import('@/routers/order.router')),
  product: lazy(() => import('@/routers/product.router')),
  user: lazy(() => import('@/routers/user.router')),
  vendor: lazy(() => import('@/routers/vendor.router')),
})

type AppRouter = typeof appRouter
type RouterInputs = inferRouterInputs<AppRouter>
type RouterOutputs = inferRouterOutputs<AppRouter>

export type { AppRouter, RouterInputs, RouterOutputs }
export { appRouter }
