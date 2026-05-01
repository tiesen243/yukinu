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
      .input(ProfileDto.input)
      .output(ProfileDto.output)
      .query(({ input }) => user.profile.execute(input)),

    updateProfile: protectedProcedure
      .input(UpdateProfileDto.input)
      .output(UpdateProfileDto.output)
      .mutation(({ input }) => user.updateProfile.execute(input)),

    update: protectedProcedure
      .meta({ role: ['admin', 'moderator'] })
      .input(UpdateUserDto.input)
      .output(UpdateUserDto.output)
      .mutation(({ input }) => user.updateUser.execute(input)),

    delete: protectedProcedure
      .input(OneUserDto.input)
      .output(OneUserDto.output)
      .mutation(({ input }) => user.deleteUser.execute(input)),

    restore: protectedProcedure
      .meta({ role: ['admin', 'moderator'] })
      .input(OneUserDto.input)
      .output(OneUserDto.output)
      .mutation(({ input }) => user.restoreUser.execute(input)),

    permanentDelete: protectedProcedure
      .meta({ role: ['admin'] })
      .input(OneUserDto.input)
      .output(OneUserDto.output)
      .mutation(({ input }) => user.permanentDeleteUser.execute(input)),
  }) satisfies TRPCRouterRecord
