import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'
import { utapi } from '@yukinu/uploadthing'

import type { UserIdActionDto } from '@/modules/identity/application/dtos/user/user-id-action.dto'
import type { UserRepository } from '@/modules/identity/domain/repositories/user.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class PermanentlyDeleteUserUseCase extends AbstractUseCase<
  UserIdActionDto.Input,
  UserIdActionDto.Output
> {
  constructor(
    private readonly _db: Database,
    private readonly _userRepo: UserRepository,
  ) {
    super()
  }

  public async execute(
    input: UserIdActionDto.Input,
  ): Promise<UserIdActionDto.Output> {
    const user = await this._userRepo.find(input)
    if (!user)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `User with id ${input.id} not found`,
      })

    await this._userRepo.delete(input)
    if (user.image) await utapi.deleteFiles(user.image.split('/').pop() ?? '')

    return { id: input.id }
  }
}
