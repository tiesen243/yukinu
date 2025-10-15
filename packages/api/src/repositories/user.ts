import type { Database, Transaction } from '@yukinu/db'

export interface IUserRepository {
  findByIndentifier(
    data: IUserRepository.FindByIndentifierParams,
    tx?: Database | Transaction,
  ): Promise<string | null>

  create(
    data: IUserRepository.CreateParams,
    tx: Database | Transaction,
  ): Promise<string | null>
}

export declare namespace IUserRepository {
  export interface FindByIndentifierParams {
    username?: string
    email?: string
  }

  export interface CreateParams {
    username: string
    email: string
  }
}
