import type { ISessionRepository } from '@/contracts/repositories/session.repository'
import type { Database, orm as ORM } from '@yukinu/db'
import type * as Schema from '@yukinu/db/schema'
import type { SessionSchema, UserSchema } from '@yukinu/validators/auth'

import { BaseRepository } from '@/repositories/base.repository'

export class SessionRepository
  extends BaseRepository<typeof Schema.sessions>
  implements ISessionRepository
{
  constructor(db: Database, orm: typeof ORM, schema: typeof Schema) {
    super(db, orm, schema, schema.sessions)
  }

  allByUserId(
    userId: UserSchema['id'],
    tx = this._db,
  ): Promise<Omit<SessionSchema, 'userId' | 'token'>[]> {
    const { eq, desc } = this._orm

    return tx
      .select({
        id: this._table.id,
        expiresAt: this._table.expiresAt,
        ipAddress: this._table.ipAddress,
        userAgent: this._table.userAgent,
        createdAt: this._table.createdAt,
      })
      .from(this._table)
      .where(eq(this._table.userId, userId))
      .orderBy(desc(this._table.createdAt))
  }
}
