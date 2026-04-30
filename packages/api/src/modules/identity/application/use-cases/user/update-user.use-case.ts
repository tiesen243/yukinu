import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { UpdateUserDto } from '@/modules/identity/application/dtos/user/update-user.dto'
import type { UserRepository } from '@/modules/identity/domain/repositories/user.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class UpdateUserUseCase extends AbstractUseCase<
  UpdateUserDto.Input,
  UpdateUserDto.Output
> {
  constructor(
    private readonly _db: Database,
    private readonly _userRepo: UserRepository,
  ) {
    super()
  }

  public async execute(
    input: UpdateUserDto.Input,
  ): Promise<UpdateUserDto.Output> {
    const { id, status, role } = input

    const [user] = await this._userRepo.find([{ id }], {}, { limit: 1 })
    if (!user)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `User with id ${input.id} not found`,
      })

    const updatedUser = user.clone({ status, role })
    await this._userRepo.save(updatedUser)

    return { id: input.id }
  }
}
