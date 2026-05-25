import type { UseCases } from '@/modules/finance/types'

import { AllTransactionsByUserDto } from '@/modules/finance/application/dtos/all-transactions-by-user.dto'
import { protectedProcedure } from '@/trpc'

export const transactionRouter = ({ transaction }: UseCases) => ({
  allByUser: protectedProcedure
    .input(AllTransactionsByUserDto.input.omit({ userId: true }))
    .output(AllTransactionsByUserDto.output)
    .query(({ ctx }) =>
      transaction.allByUser.execute({ userId: ctx.session.userId }),
    ),
})
