import type { Database, Transaction } from '@yukinu/db'
import { profiles } from '@yukinu/db/schema/profile'

import type { IProfileRepository } from './profile'

export class ProfileRepository implements IProfileRepository {
  constructor(private readonly _db: Database) {}

  async create(
    data: IProfileRepository.CreateParams,
    tx: Database | Transaction = this._db,
  ): Promise<boolean> {
    try {
      await tx.insert(profiles).values({
        id: data.userId,
        fullName: data.fullName,
      })
      return true
    } catch {
      return false
    }
  }
}
