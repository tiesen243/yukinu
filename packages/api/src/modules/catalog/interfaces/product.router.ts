import type { TRPCRouterRecord } from '@trpc/server'

import type { UseCases } from '@/modules/catalog/types'
import type { VendorMiddleware } from '@/modules/merchant/interfaces/vendor.middleware'

import { AllProductsDto } from '@/modules/catalog/application/dtos/product/all-products.dto'
import { OneProductDto } from '@/modules/catalog/application/dtos/product/one-product.dto'
import { SaveProductDto } from '@/modules/catalog/application/dtos/product/save-product.dto'
import { protectedProcedure, publicProcedure } from '@/trpc'

export const productRouter = (
  { product }: UseCases,
  deps: {
    vendorMiddleware: VendorMiddleware
  },
) =>
  ({
    all: publicProcedure
      .input(AllProductsDto.input)
      .output(AllProductsDto.output)
      .query(({ input }) => product.all.execute(input)),

    allByVendor: protectedProcedure
      .use(deps.vendorMiddleware)
      .input(AllProductsDto.input)
      .output(AllProductsDto.output)
      .query(({ ctx, input }) =>
        product.all.execute({
          ...input,
          vendorId: ctx.session.vendorId,
        }),
      ),

    one: publicProcedure
      .input(OneProductDto.input)
      .output(OneProductDto.output)
      .query(({ ctx, input }) =>
        product.one.execute({ ...input, userId: ctx.session?.userId }),
      ),

    create: protectedProcedure
      .use(deps.vendorMiddleware)
      .input(SaveProductDto.input.omit({ vendorId: true }))
      .output(SaveProductDto.output)
      .mutation(({ ctx, input }) =>
        product.create.execute({
          ...input,
          vendorId: ctx.session.vendorId,
        }),
      ),

    update: protectedProcedure
      .use(deps.vendorMiddleware)
      .input(SaveProductDto.input.omit({ vendorId: true, variants: true }))
      .output(SaveProductDto.output)
      .mutation(({ ctx, input }) =>
        product.update.execute({
          ...input,
          vendorId: ctx.session.vendorId,
        }),
      ),

    delete: protectedProcedure
      .use(deps.vendorMiddleware)
      .input(OneProductDto.input.omit({ vendorId: true }))
      .mutation(({ ctx, input }) =>
        product.delete.execute({
          ...input,
          vendorId: ctx.session.vendorId,
        }),
      ),

    restore: protectedProcedure
      .use(deps.vendorMiddleware)
      .input(OneProductDto.input.omit({ vendorId: true }))
      .mutation(({ ctx, input }) =>
        product.restore.execute({
          ...input,
          vendorId: ctx.session.vendorId,
        }),
      ),

    permanentDelete: protectedProcedure
      .use(deps.vendorMiddleware)
      .input(OneProductDto.input.omit({ vendorId: true }))
      .mutation(({ ctx, input }) =>
        product.permanentDelete.execute({
          ...input,
          vendorId: ctx.session.vendorId,
        }),
      ),
  }) satisfies TRPCRouterRecord
