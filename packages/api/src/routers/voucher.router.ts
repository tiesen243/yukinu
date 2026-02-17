import * as Validators from '@yukinu/validators/general'

import { createTRPCRouter, protectedProcedure } from '@/trpc'

export const voucherRouter = createTRPCRouter({
  all: protectedProcedure
    .meta({
      message: 'Get all vouchers successfully',
      role: ['admin', 'moderator'],
    })
    .input(Validators.allVouchersInput)
    .output(Validators.allVouchersOutput)
    .query(({ ctx, input }) => ctx.services.voucher.all(input)),

  one: protectedProcedure
    .meta({ message: 'Get voucher successfully' })
    .input(Validators.oneVoucherInput)
    .output(Validators.oneVoucherOutput)
    .query(({ ctx, input }) => ctx.services.voucher.one(input)),

  create: protectedProcedure
    .meta({
      message: 'Voucher created successfully',
      role: ['admin', 'moderator'],
    })
    .input(Validators.createVoucherInput)
    .output(Validators.createVoucherOutput)
    .mutation(({ ctx, input }) => ctx.services.voucher.create(input)),

  update: protectedProcedure
    .meta({
      message: 'Voucher updated successfully',
      role: ['admin', 'moderator'],
    })
    .input(Validators.updateVoucherInput)
    .output(Validators.updateVoucherOutput)
    .mutation(({ ctx, input }) => ctx.services.voucher.update(input)),

  delete: protectedProcedure
    .meta({
      message: 'Voucher deleted successfully',
      role: ['admin', 'moderator'],
    })
    .input(Validators.deleteVoucherInput)
    .output(Validators.deleteVoucherOutput)
    .mutation(({ ctx, input }) => ctx.services.voucher.delete(input)),
})
