import { AddressModels } from '@yukinu/validators/address'

import { createTRPCRouter, protectedProcedure } from '@/trpc'

export const addressRouter = createTRPCRouter({
  all: protectedProcedure
    .meta({ message: 'Fetched addresses successfully' })
    .input(AddressModels.allInput.omit({ userId: true }))
    .output(AddressModels.allOutput)
    .query(({ ctx }) =>
      ctx.addressService.all({ userId: ctx.session.user.id }),
    ),

  one: protectedProcedure
    .meta({ message: 'Fetched address successfully' })
    .input(AddressModels.oneInput.omit({ userId: true }))
    .output(AddressModels.oneOutput)
    .query(({ ctx, input }) =>
      ctx.addressService.one({ id: input.id, userId: ctx.session.user.id }),
    ),

  create: protectedProcedure
    .meta({ message: 'Address created successfully' })
    .input(AddressModels.createInput.omit({ userId: true }))
    .output(AddressModels.createOutput)
    .mutation(({ ctx, input }) =>
      ctx.addressService.create({
        ...input,
        userId: ctx.session.user.id,
      }),
    ),

  update: protectedProcedure
    .meta({ message: 'Address updated successfully' })
    .input(AddressModels.updateInput.omit({ userId: true }))
    .output(AddressModels.updateOutput)
    .mutation(({ ctx, input }) =>
      ctx.addressService.update({
        ...input,
        userId: ctx.session.user.id,
      }),
    ),

  delete: protectedProcedure
    .meta({ message: 'Address deleted successfully' })
    .input(AddressModels.deleteInput.omit({ userId: true }))
    .output(AddressModels.deleteOutput)
    .mutation(({ ctx, input }) =>
      ctx.addressService.delete({
        id: input.id,
        userId: ctx.session.user.id,
      }),
    ),
})
