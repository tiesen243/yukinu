import { TRPCError } from '@trpc/server'

import type { Database } from '@yukinu/db/types'
import type { AuthValidator } from '@yukinu/validators/auth'
import { invalidateSessionTokens, Password } from '@yukinu/auth'

import type {
  IAccountRepository,
  IAuthService,
  IProfileRepository,
  IUserRepository,
} from '@/types'

export class AuthService implements IAuthService {
  private readonly _password: Password

  constructor(
    private readonly _db: Database,
    private readonly _accountRepo: IAccountRepository,
    private readonly _profileRepo: IProfileRepository,
    private readonly _userRepo: IUserRepository,
  ) {
    this._password = new Password()
  }

  async register(data: AuthValidator.RegisterBody): Promise<{ id: string }> {
    const { username, email } = data

    const [user] = await this._userRepo.findBy([{ username }, { email }], {}, 1)
    if (user)
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Username or email already exists',
      })

    return this._db.transaction(async (tx) => {
      const user = await this._userRepo.create({ username, email }, tx)
      if (!user) return tx.rollback()

      const provider = 'credentials'
      const password = await this._password.hash(data.password)

      await this._accountRepo.create(
        { userId: user.id, provider, accountId: user.id, password },
        tx,
      )

      await this._profileRepo.create(
        { id: user.id, fullName: data.username },
        tx,
      )

      return { id: user.id }
    })
  }

  async changePassword(
    userId: string,
    data: AuthValidator.ChangePasswordBody,
  ): Promise<{ id: string }> {
    const { currentPassword, newPassword, isLogOutOtherSessions } = data

    const [existedAccount] = await this._accountRepo.findBy(
      [{ accountId: userId, provider: 'credentials' }],
      {},
      1,
    )

    const provider = 'credentials'
    const newPasswordHash = await this._password.hash(newPassword)

    const result = await this._db.transaction(async (tx) => {
      if (!existedAccount) {
        await this._accountRepo.create(
          { userId, provider, accountId: userId, password: newPasswordHash },
          tx,
        )
        return { id: userId }
      }

      const { id, password } = existedAccount
      if (password === null || !currentPassword)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Current password is required',
        })

      if (!(await this._password.verify(password, currentPassword)))
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Current password is incorrect',
        })

      if (currentPassword === newPassword)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'New password must be different from the current password',
        })

      await this._accountRepo.update(id, { password: newPasswordHash }, tx)
      return { id: userId }
    })

    if (isLogOutOtherSessions) await invalidateSessionTokens(userId)
    return result
  }
}
