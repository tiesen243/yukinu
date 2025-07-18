import type { TRPCRouterRecord } from '@trpc/server'
import { TRPCError } from '@trpc/server'

import { Password } from '@yuki/auth'
import { and, eq } from '@yuki/db'
import { accounts, cartItems, sessions, users } from '@yuki/db/schema'
import {
  changePasswordSchema,
  deleteAccountSchema,
  deleteSessionSchema,
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

      return { message: 'User created successfully' }
    }),

  changePassword: protectedProcedure
    .input(changePasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

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
      })

      return { message: 'Password changed successfully' }
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
} satisfies TRPCRouterRecord
