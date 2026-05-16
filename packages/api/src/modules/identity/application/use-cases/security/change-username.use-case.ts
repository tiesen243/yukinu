import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'
import { Password } from '@yukinu/auth'

import type { ChangeUsernameDto } from '@/modules/identity/application/dtos/security/change-username.dto'
import type { AccountRepository } from '@/modules/identity/domain/repositories/account.repository'
import type { UserRepository } from '@/modules/identity/domain/repositories/user.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class ChangeUsernameUseCase extends AbstractUseCase<
  ChangeUsernameDto.Input,
  ChangeUsernameDto.Output
> {
  private readonly _password = new Password()

  constructor(
    private readonly _db: Database,
    private readonly _accountRepo: AccountRepository,
    private readonly _userRepo: UserRepository,
  ) {
    super()
  }

  async execute(
    input: ChangeUsernameDto.Input,
  ): Promise<ChangeUsernameDto.Output> {
    const { id, username, password } = input

    const [targetUser] = await this._userRepo.find([{ id }], {}, { limit: 1 })
    if (!targetUser)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `User with id ${id} not found`,
      })

    const [user] = await this._userRepo.find([{ username }], {}, { limit: 1 })
    if (user)
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'A user with the given username already exists.',
      })

    const [account] = await this._accountRepo.find(
      [{ provider: 'credentials', providerAccountId: id }],
      {},
      { limit: 1 },
    )
    if (!account?.password)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You do not have a password set. Cannot change username.',
      })

    if (!(await this._password.verify(account.password, password)))
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'The provided password is incorrect.',
      })

    const updatedUser = targetUser.clone({ username })
    await this._userRepo.save(updatedUser)

    return { id }
  }
}
