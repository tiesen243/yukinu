import { TRPCError } from '@trpc/server'

import type { Database } from '@yukinu/db'
import type { UserModels } from '@yukinu/validators/user'

import type { IProfileRepository, IUserRepository, IUserService } from '@/types'

export class UserService implements IUserService {
  public constructor(
    private readonly _db: Database,
    private readonly _profileRepo: IProfileRepository,
    private readonly _userRepo: IUserRepository,
  ) {}

  public async all(input: UserModels.AllInput): Promise<UserModels.AllOutput> {
    const { search = '', limit, page } = input
    const offset = (page - 1) * limit

    const criteria = search
      ? [{ email: `%${search}%` }, { username: `%${search}%` }]
      : []
    const users = await this._userRepo.findBy(
      criteria,
      { createdAt: 'desc' },
      limit,
      offset,
    )

    const totalItems = await this._userRepo.count(criteria)
    const totalPages = Math.ceil(totalItems / limit)

    return {
      users,
      pagination: { page, totalPages, totalItems },
    }
  }

  public async one(input: UserModels.OneInput): Promise<UserModels.OneOutput> {
    const user = await this._userRepo.find(input.id)
    if (!user)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found.' })
    return user
  }

  public async update(
    input: UserModels.UpdateInput,
    actingUser: Pick<UserModels.User, 'id' | 'role'>,
  ): Promise<UserModels.UpdateOutput> {
    const { id = '', ...updateData } = input

    const existingUser = await this.one({ id })

    this.checkModifyPermissions(existingUser, actingUser)

    await this._userRepo.update(id, updateData)
    return { userId: id }
  }

  public async delete(
    input: UserModels.DeleteInput,
    actingUser: Pick<UserModels.User, 'id' | 'role'>,
  ): Promise<UserModels.DeleteOutput> {
    const { id } = input

    const existingUser = await this.one({ id })
    this.checkModifyPermissions(existingUser, actingUser)

    return this._db.transaction(async (tx) => {
      await this._profileRepo.delete(id, tx)
      await this._userRepo.delete(id, tx)
      return { userId: input.id }
    })
  }

  private checkModifyPermissions(
    user: Pick<UserModels.User, 'id' | 'role'>,
    actingUser: Pick<UserModels.User, 'id' | 'role'>,
  ) {
    if (actingUser.id === user.id)
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Users cannot modify their own account.',
      })

    if (actingUser.role === 'moderator' && user.role === 'admin')
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Moderators cannot modify admin users.',
      })
  }
}
