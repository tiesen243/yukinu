import type { Database } from '@yukinu/db/drizzle'

import type { TransactionRepository } from '@/modules/finance/domain/repositories/transaction.repository'

import type { AllTransactionsByUserDto } from '@/modules/finance/application/dtos/all-transactions-by-user.dto'
import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class AllTransactionsByUserUseCase extends AbstractUseCase<
  AllTransactionsByUserDto.Input,
  AllTransactionsByUserDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _transactionRepo: TransactionRepository,
  ) {
    super()
  }

  public execute(
    params: AllTransactionsByUserDto.Input,
  ): Promise<AllTransactionsByUserDto.Output> {
    const { userId } = params
    return this._transactionRepo.findByUserId(userId)
  }
}
