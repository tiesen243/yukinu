import type { TRPCRouterRecord } from '@trpc/server'
import type { Database } from '@yukinu/db/drizzle'

import type { UseCases } from '@/modules/identity/types'

import { DrizzleUserRepository } from '@/modules/identity/infrastructures/drizzle/user.repository'
import { authRouter } from '@/modules/identity/interfaces/auth.router'

export const createIdentityModule = (db: Database) => {
  const _userRepo = new DrizzleUserRepository(db)

  const useCases = {} satisfies UseCases

  return {
    useCases,
    router: {
      auth: authRouter(useCases),
    } satisfies TRPCRouterRecord,
  }
}
