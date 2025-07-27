import type { TRPCRouterRecord } from '@trpc/server'
import { TRPCError } from '@trpc/server'

import { Password } from '@yuki/auth'
import { and, eq } from '@yuki/db'
import {
  accounts,
  cartItems,
  sessions,
  users,
  verifiers,
} from '@yuki/db/schema'
import { sendEmail } from '@yuki/email'
import {
  changePasswordSchema,
  deleteAccountSchema,
  deleteSessionSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  signUpSchema,
} from '@yuki/validators/auth'

import { protectedProcedure, publicProcedure } from '../trpc'

const password = new Password()

export const authRouter = {
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
        columns: { id: true },
      })
      if (user)
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User already exists',
        })

      await ctx.db.transaction(async (tx) => {
        const [newUser] = await tx
          .insert(users)
          .values({
            email: input.email,
            name: input.name,
            image: '',
          })
          .returning({ id: users.id })
        await tx.insert(accounts).values({
          provider: 'credentials',
          accountId: newUser?.id ?? '',
          userId: newUser?.id ?? '',
          password: await password.hash(input.password),
        })
      })

      await sendEmail({
        email: 'Welcome',
        to: input.email,
        subject: 'Welcome to Yuki',
        text: 'Thank you for signing up! We are excited to have you on board.',
        data: { name: input.name },
      })

      return { message: 'User created successfully' }
    }),

  changePassword: protectedProcedure
    .input(changePasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const userAgent = ctx.req.headers.get('user-agent') ?? 'unknown'
      const ipAddress = ctx.req.headers.get('x-forwarded-for') ?? 'unknown'

      const account = await ctx.db.query.accounts.findFirst({
        where: and(
          eq(accounts.provider, 'credentials'),
          eq(accounts.accountId, userId),
        ),
        columns: { password: true },
      })

      if (account?.password) {
        if (!input.currentPassword)
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Current password is required',
          })
        const isValid = await password.verify(
          account.password,
          input.currentPassword,
        )
        if (!isValid)
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Current password is incorrect',
          })
      }

      await ctx.db.transaction(async (tx) => {
        const hashedPassword = await password.hash(input.newPassword)

        await tx
          .insert(accounts)
          .values({
            provider: 'credentials',
            accountId: userId,
            userId,
            password: hashedPassword,
          })
          .onConflictDoUpdate({
            target: [accounts.provider, accounts.accountId],
            set: { password: hashedPassword },
          })

        if (input.isLogoutAll)
          await tx.delete(sessions).where(eq(sessions.userId, userId))

        await sendEmail({
          email: 'ChangePassword',
          to: ctx.session.user.email,
          subject: 'Your password has been changed',
          text: 'Your password has been successfully changed.',
          data: { name: ctx.session.user.name, userAgent, ipAddress },
        })
      })

      return { message: 'Password changed successfully' }
    }),

  forgotPassword: publicProcedure
    .input(forgotPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: (t, { eq }) => eq(t.email, input.email),
      })
      if (!user) return

      const [verifier] = await ctx.db
        .insert(verifiers)
        .values({
          expiration: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
          token: crypto.randomUUID(),
          userId: user.id,
        })
        .returning()
      if (verifier)
        await sendEmail({
          email: 'ResetPassword',
          to: input.email,
          subject: 'Reset your password',
          text: 'You requested a password reset. Click the link below to reset your password.',
          data: {
            name: user.name,
            token: verifier.token,
          },
        })
    }),

  resetPassword: publicProcedure
    .input(resetPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const userAgent = ctx.req.headers.get('user-agent') ?? 'unknown'
      const ipAddress = ctx.req.headers.get('x-forwarded-for') ?? 'unknown'

      const verifier = await ctx.db.query.verifiers.findFirst({
        where: (t, { eq }) => eq(t.token, input.token),
        with: { user: true },
      })
      if (!verifier)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invalid or expired reset token',
        })
      if (verifier.expiration < new Date()) {
        await ctx.db.delete(verifiers).where(eq(verifiers.token, input.token))
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Reset token has expired',
        })
      }

      await ctx.db.transaction(async (tx) => {
        await tx
          .update(accounts)
          .set({ password: await password.hash(input.newPassword) })
          .where(
            and(
              eq(accounts.provider, 'credentials'),
              eq(accounts.accountId, verifier.userId),
            ),
          )
        await tx.delete(verifiers).where(eq(verifiers.userId, verifier.userId))
        await tx.delete(sessions).where(eq(sessions.userId, verifier.userId))
      })

      await sendEmail({
        email: 'ChangePassword',
        to: verifier.user.email,
        subject: 'Your password has been reset',
        text: 'Your password has been successfully reset.',
        data: { name: verifier.user.name, userAgent, ipAddress },
      })
    }),

  listSessions: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id
    return ctx.db.query.sessions.findMany({
      where: eq(sessions.userId, userId),
      orderBy: (sessions, { desc }) => [desc(sessions.expires)],
    })
  }),

  deleteSession: protectedProcedure
    .input(deleteSessionSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      await ctx.db
        .delete(sessions)
        .where(
          and(eq(sessions.token, input.token), eq(sessions.userId, userId)),
        )
    }),

  deleteAccount: protectedProcedure
    .input(deleteAccountSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const account = await ctx.db.query.accounts.findFirst({
        where: and(
          eq(accounts.provider, 'credentials'),
          eq(accounts.accountId, userId),
        ),
        columns: { password: true },
      })

      const isValid = await password.verify(
        account?.password ?? '',
        input.password,
      )
      if (!isValid)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Password is incorrect',
        })

      await ctx.db.transaction(async (tx) => {
        await tx.delete(users).where(eq(users.id, userId))
        await tx.delete(accounts).where(eq(accounts.userId, userId))
        await tx.delete(sessions).where(eq(sessions.userId, userId))
        await tx.delete(cartItems).where(eq(cartItems.userId, userId))
      })
    }),
} satisfies TRPCRouterRecord
