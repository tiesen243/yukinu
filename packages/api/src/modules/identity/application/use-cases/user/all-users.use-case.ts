import type { Database } from '@yukinu/db/drizzle'

import type { AllUsersDto } from '@/modules/identity/application/dtos/user/all-users.dto'
import type { UserRepository } from '@/modules/identity/domain/repositories/user.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class AllUsersUseCase extends AbstractUseCase<
  AllUsersDto.Input,
  AllUsersDto.Output
> {
  constructor(
    private readonly _db: Database,
    private readonly _userRepo: UserRepository,
  ) {
    super()
  }

  public async execute(input: AllUsersDto.Input): Promise<AllUsersDto.Output> {
    const { search, role, page, limit } = input
    const offset = (page - 1) * limit

    const roleClause = role ? { role } : {}
    const whereClauses = search
      ? [
          { username: `%${search}%`, ...roleClause },
          { email: `%${search}%`, ...roleClause },
        ]
      : []

    const [users, total] = await Promise.all([
      this._userRepo.all(
        whereClauses,
        { createdAt: 'desc' },
        { limit, offset },
      ),
      this._userRepo.count(whereClauses),
    ])
    const totalPages = Math.ceil(total / limit)

    return {
      users,
      pagination: { total, page, limit, totalPages },
    }
  }
}
