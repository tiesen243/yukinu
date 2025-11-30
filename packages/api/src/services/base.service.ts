import type { db, orm } from '@yukinu/db'
import type * as schema from '@yukinu/db/schema'

export abstract class BaseService {
  constructor(
    protected readonly _db: typeof db,
    protected readonly _orm: typeof orm,
    protected readonly _schema: typeof schema,
  ) {}
}
