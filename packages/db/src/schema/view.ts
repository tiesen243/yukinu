import { eq, sql } from 'drizzle-orm'
import { pgView } from 'drizzle-orm/pg-core'

import { profiles } from './profile'
import { users } from './user'

export const usersView = pgView('users_view').as((qb) =>
  qb
    .select({
      id: users.id,
      email: users.email,
      username: users.username,
      role: users.role,
      avatarUrl: sql<string | null>`${profiles.avatarUrl}`.as('avatar_url'),
    })
    .from(users)
    .where(eq(users.status, 'active'))
    .innerJoin(profiles, eq(users.id, profiles.id)),
)
