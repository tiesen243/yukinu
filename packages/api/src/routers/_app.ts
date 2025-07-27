import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import { createTRPCRouter, publicProcedure } from '../trpc'
import { addressRouter } from './address'
import { authRouter } from './auth'
import { cartRouter } from './cart'
import { orderRouter } from './order'
import { productRouter } from './product'

const appRouter = createTRPCRouter({
  address: addressRouter,
  auth: authRouter,
  cart: cartRouter,
  order: orderRouter,
  product: productRouter,

  health: publicProcedure.query(() => {
    return { message: 'API is healthy' }
  }),
})

type AppRouter = typeof appRouter

type RouterInputs = inferRouterInputs<AppRouter>
type RouterOutputs = inferRouterOutputs<AppRouter>

export type { AppRouter, RouterInputs, RouterOutputs }
export { appRouter }
