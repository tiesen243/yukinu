import { createId } from '@yukinu/lib/create-id'
import { pgTable, uniqueIndex, type AnyPgColumn } from 'drizzle-orm/pg-core'

export const categories = pgTable(
  'categories',
  (t) => ({
    id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
    parentId: t
      .varchar({ length: 24 })
      .references((): AnyPgColumn => categories.id, { onDelete: 'set null' }),
    name: t.varchar({ length: 100 }).notNull(),
    description: t.text(),
    image: t.varchar({ length: 500 }),
  }),
  (t) => [uniqueIndex('categories_name_idx').on(t.name)],
)
