import type { TRPCRouterRecord } from '@trpc/server'

import type { UseCases } from '@/modules/catalog/types'
import type { VendorMiddleware } from '@/modules/merchant/interfaces/vendor.middleware'

import { DeleteVariantDto } from '@/modules/catalog/application/dtos/variant/delete-variant.dto'
import { RecreateVariantDto } from '@/modules/catalog/application/dtos/variant/recreate-variant.dto'
import { UpdateVariantDto } from '@/modules/catalog/application/dtos/variant/update-variant.dto'
import { protectedProcedure } from '@/trpc'

export const variantRouter = (
  { variant }: UseCases,
  deps: {
    vendorMiddleware: VendorMiddleware
  },
) =>
  ({
    delete: protectedProcedure
      .use(deps.vendorMiddleware)
      .input(DeleteVariantDto.input)
      .output(DeleteVariantDto.output)
      .mutation(({ input }) => variant.delete.execute(input)),

    recreate: protectedProcedure
      .use(deps.vendorMiddleware)
      .input(RecreateVariantDto.input.omit({ vendorId: true }))
      .output(RecreateVariantDto.output)
      .mutation(({ ctx, input }) =>
        variant.recreate.execute({
          ...input,
          vendorId: ctx.session.vendorId,
        }),
      ),

    update: protectedProcedure
      .use(deps.vendorMiddleware)
      .input(UpdateVariantDto.input)
      .output(UpdateVariantDto.output)
      .mutation(({ input }) => variant.update.execute(input)),
  }) satisfies TRPCRouterRecord
