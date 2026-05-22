import { TRPCError } from '@trpc/server'
import { Password } from '@yukinu/auth'

import type { UseCases } from '@/modules/finance/types'

import { PaymentHookDto } from '@/modules/finance/application/dtos/payment/payment-hook.dto'
import { OnePaymentDto } from '@/modules/finance/types'
import { protectedProcedure, publicProcedure } from '@/trpc'

export const paymentRouter = ({ payment }: UseCases) => ({
  one: protectedProcedure
    .input(OnePaymentDto.input)
    .output(OnePaymentDto.output)
    .query(({ input }) => payment.one.execute(input)),

  webhook: publicProcedure
    .input(PaymentHookDto.input)
    .output(PaymentHookDto.output)
    .mutation(async ({ ctx, input }) => {
      const apiKey =
        ctx.reqHeaders.get('authorization')?.replace('Apikey ', '') ?? ''
      const expectedToken = process.env.SEPAY_TOKEN ?? ''

      if (!(await new Password().verify(expectedToken, apiKey)))
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid API key',
        })

      return payment.hook.execute(input)
    }),
})
