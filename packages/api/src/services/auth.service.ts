import type { IAccountRepository } from '@/contracts/repositories/account.repository'
import type { IProfileRepository } from '@/contracts/repositories/profile.repository'
import type { IUserRepository } from '@/contracts/repositories/user.repository'
import type { IVerificationRepository } from '@/contracts/repositories/verification.repository'
import type { IAuthService } from '@/contracts/services/auth.service'
import type { Database } from '@yukinu/db'
import type * as Validators from '@yukinu/validators/auth'

import { TRPCError } from '@trpc/server'
import { Password } from '@yukinu/auth'
import { sendEmail } from '@yukinu/email'
import { env } from '@yukinu/validators/env'

import { randomBytes } from 'node:crypto'

export class AuthService implements IAuthService {
  private readonly _password = new Password()

  constructor(
    private readonly _db: Database,
    private readonly _account: IAccountRepository,
    private readonly _user: IUserRepository,
    private readonly _profile: IProfileRepository,
    private readonly _verification: IVerificationRepository,
  ) {}

  async getCurrentUser(userId: Validators.UserSchema['id']): Promise<
    Omit<Validators.SessionSchema, 'id' | 'userId' | 'createdAt'> & {
      user: Pick<
        Validators.UserSchema,
        'id' | 'username' | 'email' | 'role' | 'image'
      >
    }
  > {
    const user = await this._user.find(userId)
    if (!user)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found.' })

    const { id, username, email, role, image } = user
    return {
      token: '',
      userAgent: null,
      expiresAt: new Date(),
      ipAddress: null,
      user: { id, username, email, role, image },
    }
  }

  async register(
    input: Validators.RegisterInput,
  ): Promise<Validators.RegisterOutput> {
    const { username, email, password: _password } = input

    const user = await this._user.findByIdentifier({ email, username })
    if (user)
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'A user with the given email or username already exists.',
      })

    const password = await this._password.hash(_password)
    const { userId, token } = await this._db.transaction(async (tx) => {
      const userId = await this._user.create({ email, username }, tx)
      await this._account.create(
        { userId, provider: 'credentials', accountId: userId, password },
        tx,
      )
      await this._profile.create({ id: userId, fullName: username }, tx)

      const token = randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
      await this._verification.create(
        { token, userId, type: 'email', expiresAt },
        tx,
      )

      return { userId, token }
    })

    const verificationLink = `https://${env.VERCEL_PROJECT_PRODUCTION_URL}/verify-email?token=${token}`
    await sendEmail({
      to: email,
      subject: 'Welcome to Yukinu!',
      template: 'Welcome',
      data: { username, verificationLink },
    })

    return { id: userId }
  }

  async verifyEmail(
    input: Validators.VerifyEmailInput,
  ): Promise<Validators.VerifyEmailOutput> {
    const { token } = input

    const verification = await this._verification.find(token, 'email')
    if (!verification)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid or expired verification token.',
      })

    const { userId, expiresAt } = verification
    return this._db.transaction(async (tx) => {
      if (expiresAt < new Date()) {
        await this._verification.delete(token, tx)
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'The verification token has expired.',
        })
      }

      await this._user.update(userId, { emailVerified: new Date() }, tx)
      await this._verification.delete(token, tx)

      return { userId }
    })
  }

  async forgotPassword(
    input: Validators.ForgotPasswordInput,
  ): Promise<Validators.ForgotPasswordOutput> {
    const { email } = input

    const user = await this._user.findByIdentifier({ email, username: null })
    if (!user?.username) return { id: '' }

    const { id, username } = user
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    await this._verification.create({
      token,
      userId: id,
      type: 'password_reset',
      expiresAt,
    })

    const resetLink = `https://${env.VERCEL_PROJECT_PRODUCTION_URL}/forogt-password/reset?token=${token}`
    await sendEmail({
      to: email,
      subject: 'Yukinu Password Reset',
      template: 'ResetPassword',
      data: { username, resetLink },
    })

    return { id }
  }

  async resetPassword(
    input: Validators.ResetPasswordInput,
  ): Promise<Validators.ResetPasswordOutput> {
    const { token, newPassword } = input

    const verification = await this._verification.find(token, 'password_reset')
    if (!verification)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid or expired password reset token.',
      })

    const { userId, expiresAt } = verification
    return this._db.transaction(async (tx) => {
      if (expiresAt < new Date()) {
        await this._verification.delete(token, tx)
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'The password reset token has expired.',
        })
      }

      const password = await this._password.hash(newPassword)
      await this._account.update(userId, { password }, tx)
      await this._verification.delete(token, tx)

      return { userId }
    })
  }
}
