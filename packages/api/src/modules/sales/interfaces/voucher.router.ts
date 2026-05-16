import type { UseCases } from '@/modules/sales/types'

import { AllVouchersDto } from '@/modules/sales/application/dtos/voucher/all-vouchers.dto'
import { OneVoucherDto } from '@/modules/sales/application/dtos/voucher/one-voucher.dto'
import { SaveVoucherDto } from '@/modules/sales/application/dtos/voucher/save-voucher.dto'
import { protectedProcedure } from '@/trpc'

export const voucherRouter = ({ voucher }: UseCases) => ({
  all: protectedProcedure
    .meta({ role: ['admin', 'moderator'] })
    .input(AllVouchersDto.input)
    .output(AllVouchersDto.output)
    .query(({ input }) => voucher.all.execute(input)),

  one: protectedProcedure
    .input(OneVoucherDto.input)
    .output(OneVoucherDto.output)
    .query(({ input }) => voucher.one.execute(input)),

  save: protectedProcedure
    .meta({ role: ['admin', 'moderator'] })
    .input(SaveVoucherDto.input)
    .output(SaveVoucherDto.output)
    .mutation(({ input }) => voucher.save.execute(input)),

  apply: protectedProcedure
    .input(OneVoucherDto.input)
    .output(OneVoucherDto.output)
    .mutation(async ({ input }) => {
      const _voucher = await voucher.one.execute(input)
      await voucher.save.execute({
        ..._voucher,
        quantity: _voucher.quantity - 1,
      })
      return _voucher
    }),

  delete: protectedProcedure
    .meta({ role: ['admin', 'moderator'] })
    .input(OneVoucherDto.input)
    .output(OneVoucherDto.output)
    .mutation(({ input }) => voucher.delete.execute(input)),
})
