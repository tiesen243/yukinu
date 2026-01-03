import type { IVerificationRepository } from '@/contracts/repositories/verification.repository'
import type { Database, orm } from '@yukinu/db'
import type * as schema from '@yukinu/db/schema'
import type { VerificationSchema } from '@yukinu/validators/auth'

export class VerificationRepository implements IVerificationRepository {
  constructor(
    protected _db: Database,
    protected _orm: typeof orm,
    protected _schema: typeof schema,
    protected _table: typeof schema.verifications,
  ) {}

  async find(
    token: VerificationSchema['token'],
    type?: VerificationSchema['type'],
    tx = this._db,
  ): Promise<VerificationSchema | null> {
    const { and, eq } = this._orm

    const [result] = await tx
      .select()
      .from(this._table)
      .where(and(eq(this._table.token, token), eq(this._table.type, type)))
      .limit(1)

    return result ?? null
  }

  async create(
    data: VerificationSchema,
    tx = this._db,
  ): Promise<VerificationSchema['token']> {
    const [result] = await tx
      .insert(this._table)
      .values(data)
      .returning({ token: this._table.token })

    return result ? result.token : ''
  }

  async delete(
    token: VerificationSchema['token'],
    tx?: Database,
  ): Promise<VerificationSchema['token']> {
    const { eq } = this._orm

    const [result] = await (tx ?? this._db)
      .delete(this._table)
      .where(eq(this._table.token, token))
      .returning({ token: this._table.token })

    return result ? result.token : ''
  }
}
