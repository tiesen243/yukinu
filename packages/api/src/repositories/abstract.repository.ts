import type { db, DrizlzeTransaction } from '@yukinu/db'

export abstract class AbstractRepository {
  constructor(protected readonly _db: typeof db | DrizlzeTransaction) {}

  setTransaction(tx: DrizlzeTransaction) {
    return new (this.constructor as new (db: DrizlzeTransaction) => this)(tx)
  }
}
