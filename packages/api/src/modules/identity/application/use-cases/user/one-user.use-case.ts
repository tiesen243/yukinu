import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { OneUserDto } from '@/modules/identity/application/dtos/user/one-user.dto'
import type { UserRepository } from '@/modules/identity/domain/repositories/user.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class OneUserUseCase extends AbstractUseCase<
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
    const user = await this._userRepo.find(input)
    if (!user)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })

    return user
  }
}
