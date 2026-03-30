import { allInput, allOutput } from '@yukinu/validators/order'
import * as Validators from '@yukinu/validators/vendor'

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  vendorProcedure,
} from '@/trpc'

export const VendorRouter = createTRPCRouter({
  all: publicProcedure
    .meta({
      message: 'Vendors fetched successfully',
      role: ['admin', 'moderator'],
    })
    .input(Validators.allVendorsInput)
    .output(Validators.allVendorsOutput)
    .query(({ ctx, input }) => ctx.services.vendor.all(input)),

  one: publicProcedure
    .meta({
      message: 'Vendor fetched successfully',
      role: ['admin', 'moderator'],
    })
    .input(Validators.oneVendorInput)
    .output(Validators.oneVendorOutput)
    .query(({ ctx, input }) => ctx.services.vendor.one(input)),

  me: vendorProcedure
    .meta({ message: 'Vendor fetched successfully', role: ['vendor_owner'] })
    .input(Validators.oneVendorInput.omit({ id: true }))
    .output(Validators.oneVendorOutput)
    .query(({ ctx }) => ctx.services.vendor.one({ id: ctx.vendorId })),

  create: protectedProcedure
    .meta({
      message: 'Vendor created successfully',
      role: ['user'],
    })
    .input(Validators.createVendorInput.omit({ ownerId: true }))
    .output(Validators.createVendorOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.vendor.create({
        ...input,
        ownerId: ctx.session.userId,
      }),
    ),

  updateStatus: protectedProcedure
    .meta({
      message: 'Vendor status updated successfully',
      role: ['admin', 'moderator'],
    })
    .input(Validators.updateVendorStatusInput.omit({ userId: true }))
    .output(Validators.updateVendorStatusOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.vendor.updateStatus({
        ...input,
        userId: ctx.session.userId,
      }),
    ),

  update: vendorProcedure
    .meta({
      message: 'Vendor updated successfully',
      role: ['vendor_owner'],
    })
    .input(Validators.updateVendorInput.omit({ id: true }))
    .output(Validators.updateVendorOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.vendor.update({ ...input, id: ctx.vendorId }),
    ),

  orders: vendorProcedure
    .meta({
      message: 'Vendor orders fetched successfully',
      role: ['vendor_owner', 'vendor_staff'],
    })
    .input(allInput.pick({ page: true, limit: true }))
    .output(allOutput)
    .query(({ ctx, input }) =>
      ctx.services.order.all({
        ...input,
        userId: null,
        vendorId: ctx.vendorId,
        paymentId: null,
      }),
    ),
})
