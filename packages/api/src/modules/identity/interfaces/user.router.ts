import type { TRPCRouterRecord } from '@trpc/server'

import type { UseCases } from '@/modules/identity/types'

import { AllUsersDto } from '@/modules/identity/application/dtos/user/all-users.dto'
import { OneUserDto } from '@/modules/identity/application/dtos/user/one-user.dto'
import { ProfileDto } from '@/modules/identity/application/dtos/user/profile.dto'
import { UpdateProfileDto } from '@/modules/identity/application/dtos/user/update-profile.dto'
import { UpdateUserDto } from '@/modules/identity/application/dtos/user/update-user.dto'
import { protectedProcedure } from '@/trpc'

export const userRouter = (useCases: UseCases) =>
  ({
    all: protectedProcedure
      .meta({ role: ['admin', 'moderator'] })
      .input(AllUsersDto.input)
      .output(AllUsersDto.output)
      .query(({ input }) => useCases.user.allUsers.execute(input)),

    one: protectedProcedure
      .meta({ role: ['admin', 'moderator'] })
      .input(OneUserDto.input)
      .output(OneUserDto.output)
      .query(({ input }) => useCases.user.oneUser.execute(input)),

    profile: protectedProcedure
      .input(ProfileDto.input)
      .output(ProfileDto.output)
      .query(({ input }) => useCases.user.profile.execute(input)),

    updateProfile: protectedProcedure
      .input(UpdateProfileDto.input)
      .output(UpdateProfileDto.output)
      .mutation(({ input }) => useCases.user.updateProfile.execute(input)),

    update: protectedProcedure
      .meta({ role: ['admin', 'moderator'] })
      .input(UpdateUserDto.input)
      .output(UpdateUserDto.output)
      .mutation(({ input }) => useCases.user.updateUser.execute(input)),

    delete: protectedProcedure
      .input(OneUserDto.input)
      .output(OneUserDto.output)
      .mutation(({ input }) => useCases.user.deleteUser.execute(input)),

    restore: protectedProcedure
      .meta({ role: ['admin', 'moderator'] })
      .input(OneUserDto.input)
      .output(OneUserDto.output)
      .mutation(({ input }) => useCases.user.restoreUser.execute(input)),

    permanentlyDelete: protectedProcedure
      .meta({ role: ['admin'] })
      .input(OneUserDto.input)
      .output(OneUserDto.output)
      .mutation(({ input }) =>
        useCases.user.permanentlyDeleteUser.execute(input),
      ),
  }) satisfies TRPCRouterRecord
