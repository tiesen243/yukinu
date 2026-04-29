import type { UserEntity } from '@/modules/auth/domain/entities/user.entity'

import type { IUserRepository } from '@/modules/auth/domain/repositories/user.repository'
import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class GetUsersUseCase extends AbstractUseCase<void, UserEntity[]> {
  public constructor(private readonly _userRepo: IUserRepository) {
    super()
  }

  public execute(): Promise<UserEntity[]> {
    return this._userRepo.all()
  }
}
