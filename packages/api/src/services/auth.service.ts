import { randomBytes } from 'node:crypto'
import { TRPCError } from '@trpc/server'

import type { AuthValidators } from '@yukinu/validators/auth'
import { Password } from '@yukinu/auth'
import { sendEmail } from '@yukinu/email'
import { env } from '@yukinu/validators/env'

import type { IAuthService } from '@/contracts/services/auth.service'
import { BaseService } from '@/services/base.service'

export class AuthService extends BaseService implements IAuthService {
  private readonly _password = new Password()

  async register(
    input: AuthValidators.RegisterInput,
  ): Promise<AuthValidators.RegisterOutput> {
    const { eq, or } = this._orm
    const { accounts, profiles, users, verifications } = this._schema
    const { email, username, password } = input

    const [existingUser] = await this._db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.username, username)))
      .limit(1)
    if (existingUser)
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'A user with the given email or username already exists.',
      })

    return this._db.transaction(async (tx) => {
      const [newUser] = await tx
        .insert(users)
        .values({ email, username })
        .returning({ id: users.id })
      if (!newUser)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create a new user.',
        })

      const passwordHash = await this._password.hash(password)
      await tx.insert(accounts).values({
        userId: newUser.id,
        provider: 'credentials',
        accountId: newUser.id,
        password: passwordHash,
      })

      await tx.insert(profiles).values({ id: newUser.id, fullName: username })

      const token = randomBytes(32).toString('hex')
      await tx.insert(verifications).values({
        token,
        userId: newUser.id,
        type: 'email',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      })

      const verificationLink = `https://${env.VERCEL_PROJECT_PRODUCTION_URL}/verify-email?token=${token}`
      await sendEmail({
        to: email,
        subject: 'Welcome to Yukinu!',
        template: 'Welcome',
        data: { username, verificationLink },
      })

      return newUser
    })
  }

  async verifyEmail(
    input: AuthValidators.VerifyEmailInput,
  ): Promise<AuthValidators.VerifyEmailOutput> {
    const { and, eq } = this._orm
    const { users, verifications } = this._schema
    const { token } = input

    const [verification] = await this._db
      .select()
      .from(verifications)
      .where(and(eq(verifications.token, token)))
      .limit(1)
    if (!verification)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'The verification token is invalid.',
      })

    return this._db.transaction(async (tx) => {
      if (verification.expiresAt < new Date()) {
        await tx.delete(verifications).where(eq(verifications.token, token))
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'The verification token has expired.',
        })
      }

      await tx
        .update(users)
        .set({ emailVerified: new Date() })
        .where(eq(users.id, verification.userId))
      await tx.delete(verifications).where(eq(verifications.token, token))
    })
  }

  async changePassword(
    input: AuthValidators.ChangePasswordInput,
  ): Promise<AuthValidators.ChangePasswordOutput> {
    const { and, eq } = this._orm
    const { accounts } = this._schema
    const { userId, currentPassword, newPassword } = input

    const whereClause = and(
      eq(accounts.userId, userId),
      eq(accounts.provider, 'credentials'),
    )

    return this._db.transaction(async (tx) => {
      const [account] = await tx
        .select()
        .from(accounts)
        .where(whereClause)
        .limit(1)

      if (!account?.password) {
        const newPasswordHash = await this._password.hash(newPassword)
        return void tx.insert(accounts).values({
          userId,
          provider: 'credentials',
          accountId: userId,
          password: newPasswordHash,
        })
      }

      if (!currentPassword)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Current password is required to change the password.',
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

      const newPasswordHash = await this._password.hash(newPassword)
      return void tx
        .update(accounts)
        .set({ password: newPasswordHash })
        .where(whereClause)
    })
  }

  forgotPassword(
    _input: AuthValidators.ForgotPasswordInput,
  ): Promise<AuthValidators.ForgotPasswordOutput> {
    throw new Error('Method not implemented.')
  }

  resetPassword(
    _input: AuthValidators.ResetPasswordInput,
  ): Promise<AuthValidators.ResetPasswordOutput> {
    throw new Error('Method not implemented.')
  }
}
