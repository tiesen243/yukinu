import type { Database, Transaction } from '@yukinu/db'

export interface IProfileRepository {
  create(
    data: IProfileRepository.CreateParams,
    tx?: Database | Transaction,
  ): Promise<boolean>
}

export declare namespace IProfileRepository {
  export interface CreateParams {
    userId: string
    fullName: string
  }
}
