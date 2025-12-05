import { randomBytes } from 'node:crypto'
import { TRPCError } from '@trpc/server'

import type { SessionWithUser } from '@yukinu/auth'
import type { AuthValidators } from '@yukinu/validators/auth'
import { Password } from '@yukinu/auth'
import { sendEmail } from '@yukinu/email'
import { env } from '@yukinu/validators/env'

import type { IAuthService } from '@/contracts/services/auth.service'
import { BaseService } from '@/services/base.service'

export class AuthService extends BaseService implements IAuthService {
  private readonly _password = new Password()

  async getCurrentUser(
    userId: NonNullable<SessionWithUser['user']>['id'],
  ): Promise<SessionWithUser> {
    const { eq } = this._orm
    const { sessions, users } = this._schema

    const [session] = await this._db
      .select({
        token: sessions.token,
        user: {
          id: users.id,
          email: users.email,
          username: users.username,
          role: users.role,
          image: users.image,
        },
        ipAddress: sessions.ipAddress,
        userAgent: sessions.userAgent,
        expiresAt: sessions.expiresAt,
      })
      .from(sessions)
      .where(eq(sessions.userId, userId))
      .innerJoin(users, eq(users.id, sessions.userId))
      .limit(1)

    if (!session) throw new TRPCError({ code: 'UNAUTHORIZED' })
    return session
  }

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
      .where(
        and(eq(verifications.token, token), eq(verifications.type, 'email')),
      )
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
    const { accounts, users } = this._schema
    const { userId, currentPassword, newPassword } = input

    const whereClause = and(
      eq(accounts.userId, userId),
      eq(accounts.provider, 'credentials'),
    )

    return this._db.transaction(async (tx) => {
      const [account] = await tx
        .select({
          password: accounts.password,
          email: users.email,
          username: users.username,
        })
        .from(accounts)
        .where(whereClause)
        .innerJoin(users, eq(users.id, accounts.userId))
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
      await tx
        .update(accounts)
        .set({ password: newPasswordHash })
        .where(whereClause)

      await sendEmail({
        to: account.email,
        subject: 'Yukinu Password Changed',
        template: 'ChangePassword',
        data: { username: account.username },
      })
    })
  }

  async forgotPassword(
    input: AuthValidators.ForgotPasswordInput,
  ): Promise<AuthValidators.ForgotPasswordOutput> {
    const { eq } = this._orm
    const { users } = this._schema
    const { email } = input

    const [user] = await this._db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
    if (!user) return

    return this._db.transaction(async (tx) => {
      const token = randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

      await tx.insert(this._schema.verifications).values({
        token,
        userId: user.id,
        type: 'password_reset',
        expiresAt,
      })

      const resetLink = `https://${env.VERCEL_PROJECT_PRODUCTION_URL}/forogt-password/reset?token=${token}`
      await sendEmail({
        to: email,
        subject: 'Yukinu Password Reset',
        template: 'ResetPassword',
        data: { username: user.username, resetLink },
      })
    })
  }

  async resetPassword(
    input: AuthValidators.ResetPasswordInput,
  ): Promise<AuthValidators.ResetPasswordOutput> {
    const { and, eq } = this._orm
    const { verifications } = this._schema
    const { token, newPassword } = input

    const [verification] = await this._db
      .select()
      .from(verifications)
      .where(eq(verifications.token, token))
      .limit(1)
    if (!verification)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'The password reset token is invalid.',
      })

    return this._db.transaction(async (tx) => {
      if (verification.expiresAt < new Date()) {
        await tx.delete(verifications).where(eq(verifications.token, token))
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'The password reset token has expired.',
        })
      }

      const passwordHash = await this._password.hash(newPassword)
      await tx
        .update(this._schema.accounts)
        .set({ password: passwordHash })
        .where(
          and(
            eq(this._schema.accounts.userId, verification.userId),
            eq(this._schema.accounts.provider, 'credentials'),
          ),
        )
      await tx.delete(verifications).where(eq(verifications.token, token))
    })
  }
}
