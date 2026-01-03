import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import { lazy } from '@trpc/server'

import { createTRPCRouter } from '@/trpc'

const appRouter = createTRPCRouter({
  address: lazy(() => import('@/routers/address.router')),
  auth: lazy(() => import('@/routers/auth.router')),
  banner: lazy(() => import('@/routers/banner.router')),
  cart: lazy(() => import('@/routers/cart.router')),
  category: lazy(() => import('@/routers/category.router')),
  order: lazy(() => import('@/routers/order.router')),
  product: lazy(() => import('@/routers/product.router')),
  security: lazy(() => import('@/routers/security.router')),
  staff: lazy(() => import('@/routers/staff.router')),
  ticket: lazy(() => import('@/routers/ticket.router')),
  user: lazy(() => import('@/routers/user.router')),
  productVariant: lazy(() => import('@/routers/product-variant.router')),
  vendor: lazy(() => import('@/routers/vendor.router')),
  webhook: lazy(() => import('@/routers/webhook.router')),
  wishlist: lazy(() => import('@/routers/wishlist.router')),
})

type AppRouter = typeof appRouter
type RouterInputs = inferRouterInputs<AppRouter>
type RouterOutputs = inferRouterOutputs<AppRouter>

export type { AppRouter, RouterInputs, RouterOutputs }
export { appRouter }
