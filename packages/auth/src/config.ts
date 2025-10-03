import { and, db, eq } from '@yukinu/db'
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
    getUserByEmail: async (email) => {
      const [user] = await db.select().from(users).where(eq(users.email, email))
      return user ?? null
    },
    createUser: async (data) => {
      const [user] = await db
        .insert(users)
        .values({
          ...data,
          username: generateSecureString(),
        })
        .returning()
      return user ?? null
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
          user: users,
          expires: sessions.expires,
        })
        .from(sessions)
        .where(eq(sessions.token, token))
        .innerJoin(users, eq(sessions.userId, users.id))
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
  type IUser = typeof users.$inferSelect
  type ISession = typeof sessions.$inferSelect

  interface User extends IUser {
    id: string
  }
  interface Session extends ISession {
    token: string
  }
}
