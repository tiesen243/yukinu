import { and, db, eq, or } from '@yukinu/db'
import { profiles } from '@yukinu/db/schemas/profile'
import { accounts, sessions, users } from '@yukinu/db/schemas/user'
import { env } from '@yukinu/validators/env'

import type { AuthOptions } from './core/types'
import { encodeHex, generateSecureString, hashSecret } from './core/crypto'
import Facebook from './providers/facebook'
import Google from './providers/google'

const adapter = getAdapter()
export const authOptions = {
  adapter,
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    expiresThreshold: 60 * 60 * 24 * 7, // 7 days
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

function getAdapter(): AuthOptions['adapter'] {
  return {
    getUserByEmailOrUsername: async (identifier) => {
      const [user] = await db
        .select({
          id: users.id,
          username: users.username,
          email: users.email,
          role: users.role,
          avatarUrl: profiles.avatarUrl,
        })
        .from(users)
        .where(or(eq(users.email, identifier), eq(users.username, identifier)))
        .innerJoin(profiles, eq(profiles.userId, users.id))
      return user ?? null
    },
    createUser: async (data) => {
      const [user] = await db
        .insert(users)
        .values({
          username: generateSecureString(),
          email: data.email,
        })
        .returning()
      if (!user) return null

      await db
        .insert(profiles)
        .values({ userId: user.id, fullName: data.name, avatarUrl: data.image })

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatarUrl: data.image,
      }
    },
    getAccount: async (provider, accountId) => {
      const [account] = await db
        .select()
        .from(accounts)
        .where(
          and(
            eq(accounts.provider, provider),
            eq(accounts.accountId, accountId),
          ),
        )
      return account ?? null
    },
    createAccount: async (data) => {
      await db.insert(accounts).values(data)
    },
    getSessionAndUser: async (token) => {
      const [session] = await db
        .select({
          user: {
            id: users.id,
            username: users.username,
            email: users.email,
            role: users.role,
            avatarUrl: profiles.avatarUrl,
          },
          ipAddress: sessions.ipAddress,
          userAgent: sessions.userAgent,
          expires: sessions.expires,
        })
        .from(sessions)
        .where(eq(sessions.token, token))
        .innerJoin(users, eq(sessions.userId, users.id))
        .innerJoin(profiles, eq(profiles.userId, users.id))
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
  }
}

declare module './core/types.d.ts' {
  type ISession = typeof sessions.$inferSelect

  interface User {
    id: string
    username: string
    email: string
    role: 'admin' | 'user'
    avatarUrl: string | null
  }

  interface Session extends ISession {
    token: string
  }
}
