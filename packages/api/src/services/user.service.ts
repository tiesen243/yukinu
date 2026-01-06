import type { IProfileRepository } from '@/contracts/repositories/profile.repository'
import type { IUserRepository } from '@/contracts/repositories/user.repository'
import type { IUserService } from '@/contracts/services/user.service'
import type { Database } from '@yukinu/db'
import type { Role } from '@yukinu/validators/auth'
import type * as Validators from '@yukinu/validators/user'

import { TRPCError } from '@trpc/server'
import { utapi } from '@yukinu/uploadthing'
import { roles } from '@yukinu/validators/auth'

export class UserService implements IUserService {
  constructor(
    private readonly _db: Database,
    private readonly _profile: IProfileRepository,
    private readonly _user: IUserRepository,
  ) {}

  async all(
    input: Validators.AllUsersInput,
  ): Promise<Validators.AllUsersOutput> {
    const { search, role, page, limit } = input
    const offset = (page - 1) * limit

    const whereClauses = [
      { username: `%${search}%`, ...(role ? [role] : []) },
      { email: `%${search}%`, ...(role ? [role] : []) },
    ]

    const [users, total] = await Promise.all([
      this._user.all(whereClauses, { createdAt: 'desc' }, { limit, offset }),
      this._user.count(whereClauses),
    ])
    const totalPages = Math.ceil(total / limit)

    return {
      users,
      pagination: { total, page, limit, totalPages },
    }
  }

  async one(input: Validators.OneUserInput): Promise<Validators.OneUserOutput> {
    const user = await this._user.find(input.id)
    if (!user)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    return user
  }

  async update(
    input: Validators.UpdateUserInput,
  ): Promise<Validators.UpdateUserOutput> {
    const { id, userId, status, role } = input

    await this._check(id, userId, ['moderator', 'user'], {
      forbidden: 'You cannot update users with critical roles',
      badRequest: 'You cannot update your own role or status',
    })

    await this._user.update(id, { status, role })

    return { id }
  }

  async delete(
    input: Validators.DeleteUserInput,
  ): Promise<Validators.DeleteUserOutput> {
    const { id, userId } = input

    const targetUser = await this._check(
      id,
      userId,
      ['moderator', 'user', 'vendor_staff'],
      {
        forbidden: 'You cannot delete users with critical roles',
        badRequest: 'You cannot delete your own account',
      },
    )

    if (targetUser.deletedAt)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `User with ID ${id} is already deleted`,
      })

    await this._user.update(id, { deletedAt: new Date() })

    return { id }
  }

  async restore(
    input: Validators.RestoreUserInput,
  ): Promise<Validators.RestoreUserOutput> {
    const { id, userId } = input

    const targetUser = await this._check(
      id,
      userId,
      ['moderator', 'user', 'vendor_staff'],
      {
        forbidden: 'You cannot restore users with critical roles',
        badRequest: 'You cannot restore your own account',
      },
    )

    if (!targetUser.deletedAt)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `User with ID ${id} is not deleted`,
      })

    await this._user.update(id, { deletedAt: null })

    return { id }
  }

  async permanentlyDelete(
    input: Validators.PermanentlyDeleteUserInput,
  ): Promise<Validators.PermanentlyDeleteUserOutput> {
    const { id, userId } = input

    const targetUser = await this._check(id, userId, ['moderator', 'user'], {
      forbidden: 'You cannot permanently delete users with critical roles',
      badRequest: 'You cannot permanently delete your own account',
    })

    if (!targetUser.deletedAt)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `User with ID ${id} must be deleted before permanently deleting`,
      })

    await this._user.delete(id)
    await utapi.deleteFiles(targetUser.image?.split('/').pop() ?? '')

    return { id }
  }

  async profile(
    input: Validators.ProfileInput,
  ): Promise<Validators.ProfileOutput> {
    const profile = await this._user.findWithProfile(input.id)
    if (!profile)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    return profile
  }

  async updateProfile(
    input: Validators.UpdateProfileInput,
  ): Promise<Validators.UpdateProfileOutput> {
    const { id, avatar, banner, ...data } = input
    const updateData = { ...data, ...(banner ? { banner } : {}) }

    const targetUser = await this._user.findWithProfile(id)
    if (!targetUser)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `User with ID ${id} not found`,
      })

    await this._db.transaction(async (tx) => {
      await this._profile.update(id, updateData, tx)

      if (avatar && targetUser.image !== avatar)
        await this._user.update(id, { image: avatar }, tx)
    })

    if (avatar && targetUser.image !== avatar)
      await utapi.deleteFiles(targetUser.image?.split('/').pop() ?? '')

    if (banner && targetUser.profile.banner !== banner)
      await utapi.deleteFiles(targetUser.profile.banner?.split('/').pop() ?? '')

    return { id }
  }

  private async _check(
    currentUserId: Validators.ProfileSchema['id'],
    targetUserId: Validators.ProfileSchema['id'],
    roles_: Role[],
    messages: { forbidden: string; badRequest: string },
  ) {
    if (currentUserId === targetUserId)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: messages.badRequest,
      })

    const targetUser = await this._user.find(targetUserId)
    if (!targetUser)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `User with ID ${targetUserId} not found`,
      })

    const crs: string[] = roles.filter((r) => roles_.includes(r) === false)
    if (crs.includes(targetUser.role))
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `${messages.forbidden} (${crs.join(', ')})`,
      })

    return targetUser
  }
}
