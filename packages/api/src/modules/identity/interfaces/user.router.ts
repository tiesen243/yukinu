import type { TRPCRouterRecord } from '@trpc/server'

import type { UseCases } from '@/modules/identity/types'

import { AllUsersDto } from '@/modules/identity/application/dtos/user/all-users.dto'
import { OneUserDto } from '@/modules/identity/application/dtos/user/one-user.dto'
import { ProfileDto } from '@/modules/identity/application/dtos/user/profile.dto'
import { UpdateProfileDto } from '@/modules/identity/application/dtos/user/update-profile.dto'
import { UpdateUserDto } from '@/modules/identity/application/dtos/user/update-user.dto'
import { publicProcedure } from '@/trpc'

export const userRouter = (useCases: UseCases) =>
  ({
    all: publicProcedure
      .input(AllUsersDto.input)
      .output(AllUsersDto.output)
      .query(({ input }) => useCases.user.allUsers.execute(input)),

    one: publicProcedure
      .input(OneUserDto.input)
      .output(OneUserDto.output)
      .query(({ input }) => useCases.user.oneUser.execute(input)),

    profile: publicProcedure
      .input(ProfileDto.input)
      .output(ProfileDto.output)
      .query(({ input }) => useCases.user.profile.execute(input)),

    updateProfile: publicProcedure
      .input(UpdateProfileDto.input)
      .output(UpdateProfileDto.output)
      .mutation(({ input }) => useCases.user.updateProfile.execute(input)),

    update: publicProcedure
      .input(UpdateUserDto.input)
      .output(UpdateUserDto.output)
      .mutation(({ input }) => useCases.user.updateUser.execute(input)),

    delete: publicProcedure
      .input(OneUserDto.input)
      .output(OneUserDto.output)
      .mutation(({ input }) => useCases.user.deleteUser.execute(input)),

    restore: publicProcedure
      .input(OneUserDto.input)
      .output(OneUserDto.output)
      .mutation(({ input }) => useCases.user.restoreUser.execute(input)),

    permanentlyDelete: publicProcedure
      .input(OneUserDto.input)
      .output(OneUserDto.output)
      .mutation(({ input }) =>
        useCases.user.permanentlyDeleteUser.execute(input),
      ),
  }) satisfies TRPCRouterRecord
