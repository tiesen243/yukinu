import type { TRPCRouterRecord } from '@trpc/server'

import type { UseCases } from '@/modules/identity/types'

import { AllUsersDto } from '@/modules/identity/application/dtos/user/all-users.dto'
import { publicProcedure } from '@/trpc'

export const userRouter = (useCases: UseCases) =>
  ({
    all: publicProcedure
      .input(AllUsersDto.input)
      .output(AllUsersDto.output)
      .query(({ input }) => useCases.user.allUsers.execute(input)),
  }) satisfies TRPCRouterRecord
