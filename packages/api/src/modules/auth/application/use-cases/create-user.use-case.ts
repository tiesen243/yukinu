import type { IUserRepository } from '@/modules/auth/domain/repositories/user.repository'

import { UserEntity } from '@/modules/auth/domain/entities/user.entity'
import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class CreateUserUseCase extends AbstractUseCase<
  { id?: string },
  string
> {
  public constructor(private readonly _userRepo: IUserRepository) {
    super()
  }

  public async execute(input: { id?: string }): Promise<string> {
    const user = new UserEntity({
      ...(input.id ? { id: input.id } : {}),
      username: `new_user_${Date.now()}`.slice(0, 20),
      email: `new_user_${Date.now()}@example.com`,
    })

    await this._userRepo.save(user)

    return user.id
  }
}
