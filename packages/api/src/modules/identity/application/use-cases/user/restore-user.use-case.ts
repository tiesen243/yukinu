import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { UserRepository } from '@/modules/identity/domain/repositories/user.repository'
import type { OneUserDto } from '@/modules/identity/types'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class RestoreUserUseCase extends AbstractUseCase<
  OneUserDto.Input,
  OneUserDto.Output
> {
  constructor(
    private readonly _db: Database,
    private readonly _userRepo: UserRepository,
  ) {
    super()
  }

  public async execute(input: OneUserDto.Input): Promise<OneUserDto.Output> {
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

    if (user.deletedAt === null)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `User with id ${input.id} is not deleted`,
      })

    const restoredUser = user.clone({ deletedAt: null })
    await this._userRepo.save(restoredUser)

    return restoredUser
  }
}
