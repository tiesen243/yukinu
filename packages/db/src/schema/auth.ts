import { createId } from '@yukinu/lib/create-id'
import { UserValidators } from '@yukinu/validators/user'
import {
  index,
  pgEnum,
  pgTable,
  primaryKey,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

import { createdAt, updatedAt } from '@/schema/shared'

export const userRoleEnum = pgEnum('user_role', UserValidators.roles)

export const userStatusEnum = pgEnum('user_status', UserValidators.statuses)

export const users = pgTable(
  'users',
  (t) => ({
    id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
    username: t.varchar({ length: 20 }).notNull(),
    email: t.varchar({ length: 255 }).notNull(),
    emailVerified: t.timestamp({ mode: 'date' }),
    role: userRoleEnum().default('user').notNull(),
    status: userStatusEnum().default('active').notNull(),
    image: t.varchar({ length: 500 }),
    createdAt,
    updatedAt,
    deletedAt: t.timestamp({ mode: 'date' }),
  }),
  (t) => [
    uniqueIndex('users_username_idx').on(t.username),
    uniqueIndex('users_email_uq_idx').on(t.email),
  ],
)

export const accounts = pgTable(
  'accounts',
  (t) => ({
    userId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    provider: t.varchar({ length: 50 }).notNull(),
    accountId: t.varchar({ length: 100 }).notNull(),
    password: t.text(),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.accountId] }),
    index('accounts_user_id_idx').on(t.userId),
  ],
)

export const sessions = pgTable(
  'sessions',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey(),
    userId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    token: t.varchar({ length: 64 }).notNull(),
    expiresAt: t.timestamp({ mode: 'date' }).notNull(),
    ipAddress: t.varchar({ length: 45 }),
    userAgent: t.text(),
    createdAt,
  }),
  (t) => [
    index('sessions_user_id_idx').on(t.userId),
    uniqueIndex('sessions_id_token_uq_idx').on(t.id, t.token),
  ],
)

export const verifications = pgTable(
  'verifications',
  (t) => ({
    token: t.varchar({ length: 64 }).primaryKey(),
    userId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: t.timestamp({ mode: 'date' }).notNull(),
    type: t.varchar({ length: 50 }).notNull(),
  }),
  (t) => [index('verifications_user_id_idx').on(t.userId)],
)
