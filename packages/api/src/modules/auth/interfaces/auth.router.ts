import * as z from 'zod'

import type { UseCases } from '@/modules/auth/types'

import { createTRPCRouter, publicProcedure } from '@/trpc'

export const authRouter = (useCases: UseCases) =>
  createTRPCRouter({
    signIn: publicProcedure.mutation(() => ({
      accessToken: 'fake-access-token',
      refreshToken: 'fake-refresh-token',
    })),

    getUsers: publicProcedure.query(() => useCases.getUsers.execute()),
    createUser: publicProcedure.mutation(() => useCases.createUser.execute({})),
    updateUser: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(({ input }) => useCases.createUser.execute({ id: input.id })),
  })
