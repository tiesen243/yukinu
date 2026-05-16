import { db } from '@yukinu/db'
import { and, eq, or } from '@yukinu/db/drizzle'
import { accounts, profiles, sessions, users } from '@yukinu/db/schema'
import { sendEmail } from '@yukinu/email'
import { createId } from '@yukinu/lib/create-id'

import type { AuthAdapter } from '@/core/types'

export const adapter = {
  async createUser(user) {
    const newUser = await db.transaction(async (tx) => {
      const [createdUser] = await tx
        .insert(users)
        .values({
          ...user,
          id: createId(),
          username: `u${Math.random().toString(36).slice(2, 8)}`,
          emailVerified: new Date(),
        })
        .returning({ id: users.id })

      if (!createdUser) throw new Error('Failed to create user')
      await tx.insert(profiles).values({
        id: createdUser.id,
        fullName: user.username,
      })

      return createdUser
    })

    await sendEmail({
      to: user.email,
      subject: 'Welcome to Yukinu!',
      template: 'Welcome',
      data: { username: user.username },
    })

    return newUser
  },
  async getUser(id) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    if (!user) return null
    return user
  },
  async getUserByEmail(email) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (!user) return null
    return user
  },
  async getUserByAccount({ provider, providerAccountId }) {
    const [account] = await db
      .select({
        id: users.id,
        password: accounts.password,
      })
      .from(accounts)
      .innerJoin(users, eq(accounts.userId, users.id))
      .where(
        and(
          eq(accounts.provider, provider),
          eq(accounts.providerAccountId, providerAccountId),
        ),
      )
      .limit(1)

    if (!account) return null
    return account
  },
  async getUserByIdentity({ username, email }) {
    const [user] = await db
      .select({
        id: users.id,
        password: accounts.password,
        emailVerified: users.emailVerified,
      })
      .from(users)
      .where(or(eq(users.username, username), eq(users.email, email)))
      .innerJoin(
        accounts,
        and(
          eq(accounts.userId, users.id),
          eq(accounts.provider, 'credentials'),
        ),
      )
      .limit(1)

    if (!user) return null
    return user
  },
  async updateUser({ id, ...user }) {
    const [updatedUser] = await db
      .update(users)
      .set(user)
      .where(eq(users.id, id))
      .returning({ id: users.id })

    if (!updatedUser) return null
    return updatedUser
  },
  async deleteUser(id) {
    await db.delete(users).where(eq(users.id, id))
  },

  async createSession(session) {
    const [createdSession] = await db
      .insert(sessions)
      .values(session)
      .returning({ id: sessions.id })

    if (!createdSession) throw new Error('Failed to create session')
    return createdSession
  },
  async getSessionWithUser(id) {
    const [result] = await db
      .select({
        session: {
          id: sessions.id,
          token: sessions.token,
          ipAddress: sessions.ipAddress,
          userAgent: sessions.userAgent,
          expiresAt: sessions.expiresAt,
        },
        user: {
          id: users.id,
          username: users.username,
          email: users.email,
          image: users.image,
          role: users.role,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
          emailVerified: users.emailVerified,
        },
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.id, id))
      .limit(1)

    if (!result) return null
    return result
  },
  async updateSession({ id, ...session }) {
    const [updatedSession] = await db
      .update(sessions)
      .set(session)
      .where(eq(sessions.id, id))
      .returning({ id: sessions.id })

    if (!updatedSession) return null
    return updatedSession
  },
  async deleteSession(id) {
    await db.delete(sessions).where(eq(sessions.id, id))
  },

  async getAccount(provider, providerAccountId) {
    const [account] = await db
      .select()
      .from(accounts)
      .where(
        and(
          eq(accounts.provider, provider),
          eq(accounts.providerAccountId, providerAccountId),
        ),
      )
      .limit(1)

    if (!account) return null
    return account
  },
  async createAccount(account) {
    await db.insert(accounts).values(account)
  },
} satisfies AuthAdapter
