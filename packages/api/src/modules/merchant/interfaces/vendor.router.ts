import type { TRPCRouterRecord } from '@trpc/server'

import type { UseCases } from '@/modules/merchant/types'

import { vendorMiddleware } from '@/modules/merchant/interfaces/vendor.middleware'
import {
  AllVendorsDto,
  OneVendorDto,
  SaveVendorDto,
  UpdateVendorStatusDto,
} from '@/modules/merchant/types'
import { staffRouter } from '@/modules/merchant/interfaces/staff.router'
import { protectedProcedure, publicProcedure } from '@/trpc'

export const vendorRouter = (useCases: UseCases) =>
  ({
    all: protectedProcedure
      .meta({ role: ['admin', 'moderator'] })
      .input(AllVendorsDto.input)
      .output(AllVendorsDto.output)
      .query(({ input }) => useCases.vendor.all.execute(input)),

    one: protectedProcedure
      .meta({ role: ['admin', 'moderator'] })
      .input(OneVendorDto.input)
      .output(OneVendorDto.output)
      .query(({ input }) => useCases.vendor.one.execute(input)),

    me: protectedProcedure
      .use(vendorMiddleware)
      .output(OneVendorDto.output)
      .query(({ ctx }) =>
        useCases.vendor.one.execute({ id: ctx.session.vendorId }),
      ),

    create: protectedProcedure
      .meta({ role: ['user'] })
      .input(SaveVendorDto.input.omit({ id: true, ownerId: true }))
      .output(SaveVendorDto.output)
      .mutation(({ ctx, input }) =>
        useCases.vendor.save.execute({
          ownerId: ctx.session.userId,
          ...input,
        }),
      ),

    update: protectedProcedure
      .use(vendorMiddleware)
      .input(SaveVendorDto.input.omit({ id: true, ownerId: true }))
      .output(SaveVendorDto.output)
      .mutation(({ ctx, input }) =>
        useCases.vendor.save.execute({
          id: ctx.session.vendorId,
          ownerId: ctx.session.userId,
          ...input,
        }),
      ),


    updateStatus: protectedProcedure
      .meta({ role: ['admin', 'moderator'] })
      .input(UpdateVendorStatusDto.input)
      .output(UpdateVendorStatusDto.output)
      .mutation(({ input }) => useCases.vendor.updateStatus.execute(input)),

  }) satisfies TRPCRouterRecord
