import type { Database } from '@yukinu/db'
import type { VerificationSchema } from '@yukinu/validators/auth'

export interface IVerificationRepository {
  find(
    token: VerificationSchema['token'],
    type?: VerificationSchema['type'],
    tx?: Database,
  ): Promise<VerificationSchema | null>

  create(
    data: VerificationSchema,
    tx?: Database,
  ): Promise<VerificationSchema['token']>

  delete(
    token: VerificationSchema['token'],
    tx?: Database,
  ): Promise<VerificationSchema['token']>
}
