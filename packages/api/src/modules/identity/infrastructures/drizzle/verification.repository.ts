import type { Database } from '@yukinu/db/drizzle'

import { eq } from '@yukinu/db/drizzle'
import { users, verifications } from '@yukinu/db/schema'

import type { VerificationRepository } from '@/modules/identity/domain/repositories/verification.repository'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

import { VerificationEntity } from '@/modules/identity/domain/entities/verification.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleVerificationRepository
  extends DrizzleRepository<VerificationEntity, typeof verifications>
  implements VerificationRepository
{
  public constructor(db: Database) {
    super(db, verifications, 'token')
  }

  public async findWithUser(
    criterias: AbstractRepository.Criteria<VerificationEntity>[] = [],
    orderBy: Partial<Record<keyof VerificationEntity, 'asc' | 'desc'>> = {},
    options: { limit?: number; offset?: number } = {},
    tx: Database = this._db,
  ): Promise<VerificationEntity.WithUser[]> {
    const whereClauses = this._buildCriteria(criterias)
    const orderByClause = this._buildOrderBy(orderBy)

    const query = tx
      .select({
        verification: verifications,
        user: { id: users.id, email: users.email, username: users.username },
      })
      .from(this._table)
      .innerJoin(users, eq(verifications.userId, users.id))
      .$dynamic()

    if (whereClauses) query.where(whereClauses)
    if (orderByClause) query.orderBy(orderByClause)
    if (options.limit) query.limit(options.limit)
    if (options.offset) query.offset(options.offset)

    const rows = await query

    return rows.map((row) =>
      Object.assign(this._mapToEntity(row.verification), {
        user: row.user,
      }),
    )
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof verifications>,
  ): VerificationEntity {
    return new VerificationEntity(row)
  }
}
