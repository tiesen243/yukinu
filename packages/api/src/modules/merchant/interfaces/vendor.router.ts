import type { TRPCRouterRecord } from '@trpc/server'

import type { UseCases } from '@/modules/merchant/types'

import { AllVendorsDto } from '@/modules/merchant/application/dtos/vendor/all-vendors.dto'
import { GetBalanceDto } from '@/modules/merchant/application/dtos/vendor/get-balance.dto'
import { OneVendorDto } from '@/modules/merchant/application/dtos/vendor/one-vendor.dto'
import { SaveVendorDto } from '@/modules/merchant/application/dtos/vendor/save-vendor.dto'
import { UpdateVendorStatusDto } from '@/modules/merchant/application/dtos/vendor/update-vendor-status.dto'
import { vendorMiddleware } from '@/modules/merchant/interfaces/vendor.middleware'
import { protectedProcedure, publicProcedure } from '@/trpc'

export const vendorRouter = ({ vendor }: UseCases) =>
  ({
    all: protectedProcedure
      .meta({ role: ['admin', 'moderator'] })
      .input(AllVendorsDto.input)
      .output(AllVendorsDto.output)
      .query(({ input }) => vendor.all.execute(input)),

    one: publicProcedure
      .input(OneVendorDto.input)
      .output(OneVendorDto.output)
      .query(({ input }) => vendor.one.execute(input)),

    me: protectedProcedure
      .use(vendorMiddleware)
      .output(OneVendorDto.output)
      .query(({ ctx }) => vendor.one.execute({ id: ctx.session.vendorId })),

    balance: protectedProcedure
      .use(vendorMiddleware)
      .input(GetBalanceDto.input.omit({ vendorId: true }))
      .output(GetBalanceDto.output)
      .query(({ ctx }) =>
        vendor.getBalance.execute({ vendorId: ctx.session.vendorId }),
      ),

    create: protectedProcedure
      .meta({ role: ['user'] })
      .input(SaveVendorDto.input.omit({ id: true, ownerId: true }))
      .output(SaveVendorDto.output)
      .mutation(({ ctx, input }) =>
        vendor.save.execute({
          ownerId: ctx.session.userId,
          ...input,
        }),
      ),

    update: protectedProcedure
      .use(vendorMiddleware)
      .input(SaveVendorDto.input.omit({ id: true, ownerId: true }))
      .output(SaveVendorDto.output)
      .mutation(({ ctx, input }) =>
        vendor.save.execute({
          id: ctx.session.vendorId,
          ownerId: ctx.session.userId,
          ...input,
        }),
      ),

    updateStatus: protectedProcedure
      .meta({ role: ['admin', 'moderator'] })
      .input(UpdateVendorStatusDto.input)
      .output(UpdateVendorStatusDto.output)
      .mutation(({ input }) => vendor.updateStatus.execute(input)),
  }) satisfies TRPCRouterRecord
