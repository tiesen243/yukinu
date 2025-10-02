import { relations } from 'drizzle-orm'
import { index, pgEnum, pgTable, primaryKey } from 'drizzle-orm/pg-core'

import { createdAt, createId, updatedAt } from '../utils'
import { orders } from './order'
import { addresses, profiles, wishlistItems } from './profile'
import { reviews } from './review'
import { vendorUsers } from './vendor'

export const userRoleEnum = pgEnum('user_role', ['admin', 'user'])
export const userStatusEnum = pgEnum('user_status', [
  'active',
  'inactive',
  'banned',
])

export const users = pgTable(
  'users',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey().$default(createId).notNull(),

    username: t.varchar({ length: 255 }).unique().notNull(),
    email: t.varchar({ length: 255 }).unique().notNull(),
    emailVerified: t.timestamp({ mode: 'date', withTimezone: true }),
    role: userRoleEnum().default('user').notNull(),
    status: userStatusEnum().default('active').notNull(),
    createdAt,
    updatedAt,
  }),
  (t) => [
    index('users_email_idx').on(t.email),
    index('users_username_idx').on(t.username),
    index('users_role_idx').on(t.role),
    index('users_status_idx').on(t.status),
  ],
)

export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  sessions: many(sessions),

  profile: one(profiles),
  addresses: many(addresses),
  wishlistItems: many(wishlistItems),

  vendorUsers: many(vendorUsers),

  orders: many(orders),
  reviews: many(reviews),
}))

export const accounts = pgTable(
  'accounts',
  (t) => ({
    provider: t.varchar({ length: 255 }).notNull(),
    accountId: t.varchar({ length: 255 }).notNull(),
    userId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    password: t.varchar({ length: 255 }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.accountId] }),
    index('account_user_id_idx').on(t.userId),
  ],
)

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}))

export const sessions = pgTable(
  'sessions',
  (t) => ({
    token: t.varchar({ length: 255 }).primaryKey().notNull(),
    expires: t.timestamp({ mode: 'date', withTimezone: true }).notNull(),
    userId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  }),
  (t) => [index('session_user_id_idx').on(t.userId)],
)

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))
