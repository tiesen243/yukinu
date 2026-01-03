import { createId } from '@yukinu/lib/create-id'
import { index, pgTable } from 'drizzle-orm/pg-core'

import { users } from '@/schema'

export const profiles = pgTable('profiles', (t) => ({
  id: t
    .varchar({ length: 24 })
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  fullName: t.varchar({ length: 255 }),
  bio: t.text(),
  gender: t.varchar({ length: 50 }),
  dateOfBirth: t.date(),
}))

export const addresses = pgTable(
  'addresses',
  (t) => ({
    id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
    userId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    recipientName: t.varchar({ length: 255 }).notNull(),
    phoneNumber: t.varchar({ length: 20 }).notNull(),
    street: t.varchar({ length: 255 }).notNull(),
    city: t.varchar({ length: 100 }).notNull(),
    state: t.varchar({ length: 100 }).notNull(),
    postalCode: t.varchar({ length: 20 }).notNull(),
    country: t.varchar({ length: 100 }).notNull(),
  }),
  (t) => [index('addresses_user_id_idx').on(t.userId)],
)
