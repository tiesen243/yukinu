import type UserTypes from '@yukinu/db/schema/user'
import type ViewTypes from '@yukinu/db/schema/view'
import { and, db, eq, or } from '@yukinu/db'
import { profiles } from '@yukinu/db/schema/profile'
import { accounts, sessions, users } from '@yukinu/db/schema/user'
import { usersView } from '@yukinu/db/schema/view'
import { env } from '@yukinu/validators/env'

import type { AuthOptions } from './core/types'
import { encodeHex, generateSecureString, hashSecret } from './core/crypto'
import Facebook from './providers/facebook'
import Google from './providers/google'

const adapter = getAdapter()
export const authOptions = {
  adapter,
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    expiresThreshold: 60 * 60 * 24 * 1, // 1 days
  },
  providers: {
    facebook: new Facebook({
      clientId: env.AUTH_FACEBOOK_ID,
      clientSecret: env.AUTH_FACEBOOK_SECRET,
    }),
    google: new Google({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),
  },
} satisfies AuthOptions

export type Providers = keyof typeof authOptions.providers

export async function validateSessionToken(token: string) {
  const hashToken = encodeHex(await hashSecret(token))
  return await adapter.getSessionAndUser(hashToken)
}

export async function invalidateSessionToken(token: string) {
  const hashToken = encodeHex(await hashSecret(token))
  await adapter.deleteSession(hashToken)
}

export async function invalidateSessionTokens(userId: string) {
  await adapter.deleteSessionsByUserId(userId)
}

function getAdapter(): AuthOptions['adapter'] {
  return {
    getUserByIndentifier: async (indentifier) => {
      const [user] = await db
        .select()
        .from(usersView)
        .where(
          or(
            eq(usersView.email, indentifier),
            eq(usersView.username, indentifier),
          ),
        )
      return user ?? null
    },

    createUser: async (data) => {
      const username = generateSecureString().slice(0, 8)
      const [user] = await db
        .insert(users)
        .values({ email: data.email, username })
        .returning({ id: users.id })
      if (!user) return null

      await db.insert(profiles).values({
        id: user.id,
        fullName: data.name,
        avatarUrl: data.image,
      })

      return user.id
    },

    getAccount: async (provider, accountId) => {
      const [account] = await db
        .select({
          id: accounts.id,
          userId: accounts.userId,
          provider: accounts.provider,
          accountId: accounts.accountId,
          password: accounts.password,
          status: users.status,
        })
        .from(accounts)
        .where(
          and(
            eq(accounts.provider, provider),
            eq(accounts.accountId, accountId),
          ),
        )
        .innerJoin(users, eq(accounts.userId, users.id))
      return account ?? null
    },

    createAccount: async (data) => {
      await db.insert(accounts).values(data)
    },

    getSessionAndUser: async (token) => {
      const [session] = await db
        .select({
          user: {
            id: usersView.id,
            email: usersView.email,
            username: usersView.username,
            role: usersView.role,
            status: usersView.status,
            avatarUrl: usersView.avatarUrl,
          },
          userAgent: sessions.userAgent,
          ipAddress: sessions.ipAddress,
          expires: sessions.expires,
        })
        .from(sessions)
        .where(eq(sessions.token, token))
        .innerJoin(usersView, eq(sessions.userId, usersView.id))
      return session ?? null
    },
    createSession: async (data) => {
      await db.insert(sessions).values(data)
    },
    updateSession: async (token, data) => {
      await db.update(sessions).set(data).where(eq(sessions.token, token))
    },
    deleteSession: async (token) => {
      await db.delete(sessions).where(eq(sessions.token, token))
    },
    deleteSessionsByUserId: async (userId) => {
      await db.delete(sessions).where(eq(sessions.userId, userId))
    },
  }
}

declare module './core/types.d.ts' {
  interface User extends ViewTypes.UserView {
    id: string
  }

  interface Account extends UserTypes.Account {
    id: string
    status: UserTypes.User['status']
  }

  interface NewAccount extends UserTypes.NewAccount {
    userId: string
  }

  interface Session extends Omit<UserTypes.Session, 'userId' | 'createdAt'> {
    user: User | null
  }

  interface NewSession extends UserTypes.NewSession {
    token: string
  }
}
