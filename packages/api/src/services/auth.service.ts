import { TRPCError } from '@trpc/server'

import type { Database } from '@yukinu/db'
import type { AuthModels } from '@yukinu/validators/auth'
import {
  createSessionCookie,
  invalidateSession,
  invalidateSessionTokens,
  Password,
} from '@yukinu/auth'

import type {
  IAccountRepository,
  IAuthService,
  IProfileRepository,
  IUserRepository,
} from '@/types'

export class AuthService implements IAuthService {
  private readonly _password: Password

  public constructor(
    private readonly _db: Database,
    private readonly _account: IAccountRepository,
    private readonly _profile: IProfileRepository,
    private readonly _user: IUserRepository,
  ) {
    this._password = new Password()
  }

  public async login(
    input: AuthModels.LoginInput,
    headers: Headers,
    resHeaders: Headers,
  ): Promise<AuthModels.LoginOutput> {
    const { identifier, password } = input

    const [existingUser] = await this._user.findBy(
      [{ email: identifier }, { username: identifier }],
      {},
      1,
    )
    if (!existingUser)
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid credentials',
      })

    const [existingAccount] = await this._account.findBy(
      [{ userId: existingUser.id, provider: 'credentials' }],
      {},
      1,
    )
    if (
      !existingAccount?.password ||
      !(await this._password.verify(existingAccount.password, password))
    )
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid credentials',
      })

    const { token, expires, cookie } = await createSessionCookie(
      existingUser.id,
      headers,
    )

    resHeaders.append('Set-Cookie', cookie)
    return { token, expires }
  }

  public async logout(headers: Headers, resHeaders: Headers): Promise<void> {
    const cookie = await invalidateSession(headers)
    if (cookie) resHeaders.append('Set-Cookie', cookie)
  }

  public async register(
    input: AuthModels.RegisterInput,
  ): Promise<AuthModels.RegisterOutput> {
    const { email, username } = input

    const [existingUser] = await this._user.findBy(
      [{ email }, { username }],
      {},
      1,
    )
    if (existingUser)
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Email or username already in use',
      })

    const password = await this._password.hash(input.password)

    return this._db.transaction(async (tx) => {
      const { id: userId } = await this._user.create({ email, username }, tx)

      await this._account.create(
        { userId, provider: 'credentials', accountId: userId, password },
        tx,
      )

      await this._profile.create({ id: userId, fullName: username }, tx)

      return { userId }
    })
  }

  public async changePassword(
    input: AuthModels.ChangePasswordInput,
  ): Promise<AuthModels.ChangePasswordOutput> {
    const { userId, currentPassword, newPassword, isLogOutOtherSessions } =
      input

    const [existingAccount] = await this._account.findBy(
      [{ userId, provider: 'credentials' }],
      {},
      1,
    )

    if (
      existingAccount?.password &&
      !(await this._password.verify(
        existingAccount.password,
        currentPassword ?? '',
      ))
    )
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid current password',
      })

    const password = await this._password.hash(newPassword)
    await this._account.create({
      userId,
      provider: 'credentials',
      accountId: userId,
      password,
    })

    if (isLogOutOtherSessions) await invalidateSessionTokens(userId)

    return { userId }
  }
}
