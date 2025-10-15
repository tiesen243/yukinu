import type { Database, Transaction } from '@yukinu/db'

export interface IAccountRepository {
  create(
    data: IAccountRepository.CreateParams,
    tx?: Database | Transaction,
  ): Promise<boolean>
}

export declare namespace IAccountRepository {
  export interface CreateParams {
    userId: string
    provider: string
    accountId: string
    password: string
  }
}
