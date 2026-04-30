import type { TRPCRouterRecord } from '@trpc/server'

import type { UseCases } from '@/modules/identity/types'

import { AllSessionsDto } from '@/modules/identity/application/dtos/security/all-sessions.dto'
import {
  ChangePasswordDto,
  ChangeUsernameDto,
  DeleteSessionDto,
} from '@/modules/identity/types'
import { protectedProcedure } from '@/trpc'

export const securityRouter = ({ security }: UseCases) =>
  ({
    allSessions: protectedProcedure
      .input(AllSessionsDto.input.omit({ userId: true }))
      .output(AllSessionsDto.output)
      .query(({ ctx }) =>
        security.allSessions.execute({ userId: ctx.session.userId }),
      ),

    deleteSession: protectedProcedure
      .input(DeleteSessionDto.input.omit({ userId: true }))
      .output(DeleteSessionDto.output)
      .mutation(({ ctx, input }) =>
        security.deleteSession.execute({
          ...input,
          userId: ctx.session.userId,
        }),
      ),

    changeUsername: protectedProcedure
      .input(ChangeUsernameDto.input.omit({ id: true }))
      .output(ChangeUsernameDto.output)
      .mutation(({ ctx, input }) =>
        security.changeUsername.execute({
          ...input,
          id: ctx.session.userId,
        }),
      ),

    changePassword: protectedProcedure
      .input(ChangePasswordDto.input.omit({ userId: true }))
      .output(ChangePasswordDto.output)
      .mutation(({ ctx, input }) =>
        security.changePassword.execute({
          ...input,
          userId: ctx.session.userId,
        }),
      ),
  }) satisfies TRPCRouterRecord
