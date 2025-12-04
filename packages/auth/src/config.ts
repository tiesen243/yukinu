import { db, orm } from '@yukinu/db'
import { accounts, profiles, sessions, users } from '@yukinu/db/schema'
import { env } from '@yukinu/validators/env'

import type { AuthConfig } from '@/types'
import { Facebook } from '@/providers/facebook'
import { Google } from '@/providers/google'

export const authOptions = {
  secret: env.AUTH_SECRET,

  providers: [
    new Facebook(env.AUTH_FACEBOOK_ID, env.AUTH_FACEBOOK_SECRET),
    new Google(env.AUTH_GOOGLE_ID, env.AUTH_GOOGLE_SECRET),
  ],

  adapter: {
    user: {
      async find(identifier) {
        const [record] = await db
          .select()
          .from(users)
          .where(
            orm.or(
              orm.eq(users.id, identifier),
              orm.eq(users.email, identifier),
              orm.eq(users.username, identifier),
            ),
          )
          .limit(1)

        if (!record) return null
        if (record.status === 'inactive')
          throw new Error(
            'Your account is banned from our platform. Please contact support for more information.',
          )

        return record
      },
      async create(data) {
        const username =
          'user' + Math.floor(1000 + Math.random() * 9000).toString()

        const [result] = await db
          .insert(users)
          .values({ ...data, username })
          .returning({ id: users.id })
        if (!result) throw new Error('Failed to create user')

        await db
          .insert(profiles)
          .values({ id: result.id, fullName: data.username })

        return result
      },
    },

    account: {
      async find(provider, accountId) {
        const [record] = await db
          .select()
          .from(accounts)
          .where(
            orm.and(
              orm.eq(accounts.provider, provider),
              orm.eq(accounts.accountId, accountId),
            ),
          )
          .limit(1)

        return record ?? null
      },
      async create(data) {
        await db.insert(accounts).values(data)
      },
    },

    /**
     * If you use JWT authentication, session management may not be necessary.
     * To disable sessions when using JWT, you can throw an error in the session methods:
     * ```ts
     * throw new Error("Sessions are not supported with JWT auth.");
     * ```
     */
    session: {
      async find(id) {
        const [record] = await db
          .select({
            user: {
              id: users.id,
              username: users.username,
              email: users.email,
              role: users.role,
              image: users.image,
            },
            token: sessions.token,
            expiresAt: sessions.expiresAt,
            ipAddress: sessions.ipAddress,
            userAgent: sessions.userAgent,
          })
          .from(sessions)
          .where(orm.eq(sessions.id, id))
          .innerJoin(users, orm.eq(sessions.userId, users.id))
          .limit(1)

        return record ?? null
      },
      async create(data) {
        await db.insert(sessions).values(data)
      },
      async update(id, data) {
        await db.update(sessions).set(data).where(orm.eq(sessions.id, id))
      },
      async delete(id) {
        await db.delete(sessions).where(orm.eq(sessions.id, id))
      },
    },
  },
} as const satisfies AuthConfig
