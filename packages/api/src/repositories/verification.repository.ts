import type { IVerificationRepository } from '@/contracts/repositories/verification.repository'
import type { Database, orm } from '@yukinu/db'
import type * as schema from '@yukinu/db/schema'
import type { VerificationSchema } from '@yukinu/validators/auth'

export class VerificationRepository implements IVerificationRepository {
  constructor(
    protected _db: Database,
    protected _orm: typeof orm,
    protected _schema: typeof schema,
  ) {}

  async find(
    token: VerificationSchema['token'],
    type?: VerificationSchema['type'],
    tx = this._db,
  ): Promise<VerificationSchema | null> {
    const { and, eq } = this._orm
    const { verifications } = this._schema

    const [result] = await tx
      .select()
      .from(verifications)
      .where(and(eq(verifications.token, token), eq(verifications.type, type)))
      .limit(1)

    return result ?? null
  }

  async create(
    data: VerificationSchema,
    tx = this._db,
  ): Promise<VerificationSchema['token']> {
    const { verifications } = this._schema

    const [result] = await tx
      .insert(verifications)
      .values(data)
      .returning({ token: verifications.token })

    return result ? result.token : ''
  }

  async delete(
    token: VerificationSchema['token'],
    tx?: Database,
  ): Promise<VerificationSchema['token']> {
    const { eq } = this._orm
    const { verifications } = this._schema

    const [result] = await (tx ?? this._db)
      .delete(verifications)
      .where(eq(verifications.token, token))
      .returning({ token: verifications.token })

    return result ? result.token : ''
  }
}
