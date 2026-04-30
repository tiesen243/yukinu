import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { UserRepository } from '@/modules/identity/domain/repositories/user.repository'
import type { OneUserDto } from '@/modules/identity/types'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class DeleteUserUseCase extends AbstractUseCase<
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
    const [user] = await this._userRepo.find([input], {}, { limit: 1 })
    if (!user)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `User with id ${input.id} not found`,
      })

    const deletedUser = user.clone({ deletedAt: new Date() })
    await this._userRepo.save(deletedUser)

    return deletedUser
  }
}
