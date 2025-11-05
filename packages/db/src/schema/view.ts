import { eq, sql } from 'drizzle-orm'
import { pgView } from 'drizzle-orm/pg-core'

import { profiles } from '@/schema/profile'
import { users } from '@/schema/user'

export const usersView = pgView('users_view').as((qb) =>
  qb
    .select({
      id: users.id,
      email: users.email,
      username: users.username,
      role: users.role,
      status: users.status,
      avatarUrl: sql<string | null>`${profiles.avatarUrl}`.as('avatar_url'),
    })
    .from(users)
    .innerJoin(profiles, eq(users.id, profiles.id)),
)
export type UserView = typeof usersView.$inferSelect
