import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import { db } from '@yukinu/db'

import { createAuthModule } from '@/modules/auth'
import { createTRPCRouter } from '@/trpc'

const createApp = () => {
  const authModule = createAuthModule(db)

  return createTRPCRouter({
    auth: authModule.router,
  })
}

type AppRouter = ReturnType<typeof createApp>
type RouterInputs = inferRouterInputs<AppRouter>
type RouterOutputs = inferRouterOutputs<AppRouter>

export type { AppRouter, RouterInputs, RouterOutputs }
export { createApp }
