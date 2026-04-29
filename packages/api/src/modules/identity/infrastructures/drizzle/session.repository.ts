import type { Database } from '@yukinu/db/drizzle'

import { sessions } from '@yukinu/db/schema'

import type { SessionRepository } from '@/modules/identity/domain/repositories/session.repository'

import { SessionEntity } from '@/modules/identity/domain/entities/session.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleSessionRepository
  extends DrizzleRepository<SessionEntity, typeof sessions>
  implements SessionRepository
{
  public constructor(db: Database) {
    super(db, sessions, 'id')
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof sessions>,
  ): SessionEntity {
    return new SessionEntity(row)
  }
}
