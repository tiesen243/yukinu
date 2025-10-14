import { profiles } from '@yukinu/db/schema/profile'

import { AbstractRepository } from './abstract.repository'

export class ProfileRepository extends AbstractRepository {
  async create(userId: string, name: string) {
    try {
      await this._db.insert(profiles).values({
        id: userId,
        fullName: name,
      })
      return true
    } catch {
      return false
    }
  }
}
