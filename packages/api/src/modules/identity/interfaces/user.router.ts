import type { TRPCRouterRecord } from '@trpc/server'

import type { UseCases } from '@/modules/identity/types'

import { AllUsersDto } from '@/modules/identity/application/dtos/user/all-users.dto'
import { OneUserDto } from '@/modules/identity/application/dtos/user/one-user.dto'
import { ProfileDto } from '@/modules/identity/application/dtos/user/profile.dto'
import { UpdateProfileDto } from '@/modules/identity/application/dtos/user/update-profile.dto'
import { UpdateUserDto } from '@/modules/identity/application/dtos/user/update-user.dto'
import { protectedProcedure } from '@/trpc'

export const userRouter = ({ user }: UseCases) =>
  ({
    all: protectedProcedure
      .meta({ role: ['admin', 'moderator'] })
      .input(AllUsersDto.input)
      .output(AllUsersDto.output)
      .query(({ input }) => user.allUsers.execute(input)),

    one: protectedProcedure
      .meta({ role: ['admin', 'moderator'] })
      .input(OneUserDto.input)
      .output(OneUserDto.output)
      .query(({ input }) => user.oneUser.execute(input)),

    profile: protectedProcedure
      .input(ProfileDto.input.omit({ id: true }))
      .output(ProfileDto.output)
      .query(({ ctx }) => user.profile.execute({ id: ctx.session.userId })),

    updateProfile: protectedProcedure
      .input(UpdateProfileDto.input.omit({ id: true }))
      .output(UpdateProfileDto.output)
      .mutation(({ ctx, input }) =>
        user.updateProfile.execute({
          ...input,
          id: ctx.session.userId,
        }),
      ),

    update: protectedProcedure
      .meta({ role: ['admin', 'moderator'] })
      .input(UpdateUserDto.input)
      .output(UpdateUserDto.output)
      .mutation(({ ctx, input }) =>
        user.updateUser.execute({
          ...input,
          currentUserId: ctx.session.userId,
          currentUserRole: ctx.session.role,
        }),
      ),

    delete: protectedProcedure
      .input(OneUserDto.input)
      .output(OneUserDto.output)
      .mutation(({ ctx, input }) =>
        user.deleteUser.execute({
          ...input,
          currentUserId: ctx.session.userId,
        }),
      ),

    restore: protectedProcedure
      .meta({ role: ['admin', 'moderator'] })
      .input(OneUserDto.input)
      .output(OneUserDto.output)
      .mutation(({ input }) => user.restoreUser.execute(input)),

    permanentDelete: protectedProcedure
      .meta({ role: ['admin'] })
      .input(OneUserDto.input)
      .output(OneUserDto.output)
      .mutation(({ ctx, input }) =>
        user.permanentDeleteUser.execute({
          ...input,
          currentUserId: ctx.session.userId,
        }),
      ),
  }) satisfies TRPCRouterRecord
