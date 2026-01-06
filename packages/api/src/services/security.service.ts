import type { IAccountRepository } from '@/contracts/repositories/account.repository'
import type { ISessionRepository } from '@/contracts/repositories/session.repository'
import type { IUserRepository } from '@/contracts/repositories/user.repository'
import type { ISecurityService } from '@/contracts/services/security.service'
import type { Database } from '@yukinu/db'
import type * as Validators from '@yukinu/validators/auth'

import { TRPCError } from '@trpc/server'
import { Password } from '@yukinu/auth'
import { sendEmail } from '@yukinu/email'

export class SecurityService implements ISecurityService {
  private readonly _password = new Password()

  constructor(
    private readonly _db: Database,
    private readonly _account: IAccountRepository,
    private readonly _session: ISessionRepository,
    private readonly _user: IUserRepository,
  ) {}

  allSessions(
    input: Validators.AllSessionsInput,
  ): Promise<Validators.AllSessionsOutput> {
    return this._session.allByUserId(input.userId)
  }

  async deleteSession(
    input: Validators.DeleteSessionInput,
  ): Promise<Validators.DeleteSessionOutput> {
    const session = await this._session.find(input.id)
    if (!session)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Session not found.' })
    if (session.userId !== input.userId)
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You do not have permission to delete this session.',
      })

    await this._session.delete(input.id)

    return { id: session.id }
  }

  async changeUsername(
    input: Validators.ChangeUsernameInput,
  ): Promise<Validators.ChangeUsernameOutput> {
    const { id, username, password } = input

    const [user] = await this._user.all([{ username }], {}, { limit: 1 })
    if (user)
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'A user with the given username already exists.',
      })

    const account = await this._account.find(id)
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

    await this._user.update(id, { username })

    return { id }
  }

  async changePassword(
    input: Validators.ChangePasswordInput,
  ): Promise<Validators.ChangePasswordOutput> {
    const { userId, currentPassword, newPassword, isLogout } = input

    if (userId === null)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'User ID is required to change password.',
      })

    const [password, user, account] = await Promise.all([
      this._password.hash(newPassword),
      this._user.find(userId),
      this._account.find(userId),
    ])

    if (!user)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found.',
      })

    if (account?.password) {
      if (!currentPassword)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Current password is required to change password.',
        })

      if (currentPassword === newPassword)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'The new password must be different from the current one.',
        })

      if (!(await this._password.verify(account.password, currentPassword)))
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'The current password is incorrect.',
        })
    }

    await this._db.transaction(async (tx) => {
      if (account?.password)
        await this._account.update(userId, { password }, tx)
      else
        await this._account.create(
          { userId, provider: 'credentials', accountId: userId, password },
          tx,
        )

      if (isLogout) await this._session.deleteMany([{ userId }], tx)
    })

    await sendEmail({
      to: user.email,
      subject: 'Yukinu Password Changed',
      template: 'ChangePassword',
      data: { username: user.username },
    })

    return { userId }
  }

  async deleteAccount(
    input: Validators.DeleteAccountInput,
  ): Promise<Validators.DeleteAccountOutput> {
    const { userId, password } = input

    const account = await this._account.find(userId)
    if (!account?.password)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You do not have a password set. Cannot delete account.',
      })

    if (!(await this._password.verify(account.password, password ?? '')))
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'The provided password is incorrect.',
      })

    await this._db.transaction(async (tx) => {
      await this._session.deleteMany([{ userId }], tx)
      await this._account.deleteMany([{ userId }], tx)
      await this._user.delete(userId, tx)
    })

    return { id: userId }
  }
}
