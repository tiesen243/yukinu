import type { TRPCRouterRecord } from '@trpc/server'

import type { UseCases } from '@/modules/identity/types'

import { publicProcedure } from '@/trpc'

export const authRouter = (_useCases: UseCases) =>
  ({
    signIn: publicProcedure.mutation(() => ({
      accessToken: 'fake-access-token',
      refreshToken: 'fake-refresh-token',
    })),
  }) satisfies TRPCRouterRecord
