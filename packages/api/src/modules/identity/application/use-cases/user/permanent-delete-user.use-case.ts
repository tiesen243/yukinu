import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'
import { utapi } from '@yukinu/uploadthing'

import type { OneUserDto } from '@/modules/identity/application/dtos/user/one-user.dto'
import type { UserRepository } from '@/modules/identity/domain/repositories/user.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class PermanentDeleteUserUseCase extends AbstractUseCase<
  OneUserDto.Input & { currentUserId: string },
  OneUserDto.Output
> {
  constructor(
    private readonly _db: Database,
    private readonly _userRepo: UserRepository,
  ) {
    super()
  }

  public async execute(
    input: OneUserDto.Input & { currentUserId: string },
  ): Promise<OneUserDto.Output> {
    const [user] = await this._userRepo.find(
      [{ id: input.id }],
      {},
      { limit: 1 },
    )
    if (!user)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `User with id ${input.id} not found`,
      })

    if (user.id === input.currentUserId)
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You are not allowed to delete your self',
      })

    if (user.deletedAt === null)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `User with id ${input.id} is not deleted`,
      })

    await this._userRepo.delete([{ id: input.id }])
    if (user.image) await utapi.deleteFiles(user.image.split('/').pop() ?? '')

    return user
  }
}
