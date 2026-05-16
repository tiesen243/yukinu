import type { TRPCRouterRecord } from '@trpc/server'

import type { UseCases } from '@/modules/identity/types'

import {
  AllAddressesDto,
  OneAddressDto,
  SaveAddressDto,
} from '@/modules/identity/types'
import { protectedProcedure } from '@/trpc'

export const addressRouter = ({ adddress }: UseCases) =>
  ({
    all: protectedProcedure
      .output(AllAddressesDto.output)
      .query(({ ctx }) => adddress.all.execute({ userId: ctx.session.userId })),

    one: protectedProcedure
      .input(OneAddressDto.input.omit({ userId: true }))
      .output(OneAddressDto.output)
      .query(({ ctx, input }) =>
        adddress.one.execute({ userId: ctx.session.userId, ...input }),
      ),

    create: protectedProcedure
      .input(SaveAddressDto.input.omit({ id: true, userId: true }))
      .output(SaveAddressDto.output)
      .mutation(({ ctx, input }) =>
        adddress.save.execute({
          userId: ctx.session.userId,
          ...input,
        }),
      ),

    update: protectedProcedure
      .input(SaveAddressDto.input.omit({ userId: true }))
      .output(SaveAddressDto.output)
      .mutation(({ ctx, input }) =>
        adddress.save.execute({
          userId: ctx.session.userId,
          ...input,
        }),
      ),

    delete: protectedProcedure
      .input(OneAddressDto.input.omit({ userId: true }))
      .output(OneAddressDto.output)
      .mutation(({ ctx, input }) =>
        adddress.delete.execute({
          userId: ctx.session.userId,
          ...input,
        }),
      ),
  }) satisfies TRPCRouterRecord
