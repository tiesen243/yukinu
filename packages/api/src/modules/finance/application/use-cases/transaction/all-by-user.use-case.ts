import type { Database } from '@yukinu/db/drizzle'

import type { AllTransactionsByUserDto } from '@/modules/finance/application/dtos/transaction/all-by-user.dto'
import type { TransactionRepository } from '@/modules/finance/domain/repositories/transaction.repository'

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
