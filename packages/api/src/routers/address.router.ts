import * as Validators from '@yukinu/validators/user'

import { createTRPCRouter, protectedProcedure } from '@/trpc'

export const addressRouter = createTRPCRouter({
  all: protectedProcedure
    .meta({ message: 'User addresses fetched successfully' })
    .input(Validators.allAddressesInput.omit({ userId: true }))
    .output(Validators.allAddressesOutput)
    .query(({ ctx }) =>
      ctx.services.address.all({ userId: ctx.session.userId }),
    ),

  one: protectedProcedure
    .meta({ message: 'User address fetched successfully' })
    .input(Validators.oneAddressInput.omit({ userId: true }))
    .output(Validators.oneAddressOutput)
    .query(({ ctx, input }) =>
      ctx.services.address.one({
        ...input,
        userId: ctx.session.userId,
      }),
    ),

  create: protectedProcedure
    .meta({ message: 'User address created successfully' })
    .input(Validators.createAddressInput.omit({ userId: true }))
    .output(Validators.createAddressOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.address.create({ ...input, userId: ctx.session.userId }),
    ),

  update: protectedProcedure
    .meta({ message: 'User address updated successfully' })
    .input(Validators.updateAddressInput.omit({ userId: true }))
    .output(Validators.updateAddressOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.address.update({ ...input, userId: ctx.session.userId }),
    ),

  delete: protectedProcedure
    .meta({ message: 'User address deleted successfully' })
    .input(Validators.deleteAddressInput.omit({ userId: true }))
    .output(Validators.deleteAddressOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.address.delete({ ...input, userId: ctx.session.userId }),
    ),
})
