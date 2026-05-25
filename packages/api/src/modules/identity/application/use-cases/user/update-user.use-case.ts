import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { UpdateUserDto } from '@/modules/identity/application/dtos/user/update-user.dto'
import type { UserEntity } from '@/modules/identity/domain/entities/user.entity'
import type { UserRepository } from '@/modules/identity/domain/repositories/user.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class UpdateUserUseCase extends AbstractUseCase<
  UpdateUserDto.Input & {
    currentUserId: UserEntity['id']
    currentUserRole: UserEntity.Role
  },
  UpdateUserDto.Output
> {
  constructor(
    private readonly _db: Database,
    private readonly _userRepo: UserRepository,
  ) {
    super()
  }

  public async execute(
    input: UpdateUserDto.Input & {
      currentUserId: UserEntity['id']
      currentUserRole: UserEntity.Role
    },
  ): Promise<UpdateUserDto.Output> {
    const { id, status, role } = input

    const [user] = await this._userRepo.find([{ id }], {}, { limit: 1 })
    if (!user)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `User with id ${input.id} not found`,
      })

    await this._checkValid(user, input)
    const updatedUser = user.clone({ status, role })
    await this._userRepo.save(updatedUser)

    return { id: input.id }
  }

  private async _checkValid(
    user: UserEntity,
    input: UpdateUserDto.Input & {
      currentUserId: UserEntity['id']
      currentUserRole: UserEntity.Role
    },
  ) {
    const { status, role, currentUserId, currentUserRole } = input

    if (user.id === currentUserId)
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You are not allowed to update your self',
      })

    if (user.role === 'vendor_owner' || user.role === 'vendor_staff')
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You are not allowed to update vendor user',
      })

    if (input.currentUserRole === 'moderator') {
      if (user.role === 'admin')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not allowed to update admin user',
        })

      if (role === 'admin')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not allowed to assign admin role',
        })
    } else if (
      currentUserRole === 'admin' &&
      user.role === 'admin' &&
      (status === 'inactive' || (role !== undefined && role !== 'admin'))
    )
      await this._checkHaveOneAdmin()
  }

  private async _checkHaveOneAdmin() {
    const [admin] = await this._userRepo.find(
      [{ role: 'admin' }],
      {},
      { limit: 1 },
    )
    if (!admin)
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'There must be at least one admin user',
      })
  }
}
