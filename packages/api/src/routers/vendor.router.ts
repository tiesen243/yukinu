import { VendorValidators } from '@yukinu/validators/vendor'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/trpc'

export const VendorRouter = createTRPCRouter({
  all: publicProcedure
    .meta({ message: 'Vendors fetched successfully' })
    .input(VendorValidators.allInput)
    .output(VendorValidators.allOutput)
    .query(({ ctx, input }) => ctx.services.vendor.all(input)),

  one: publicProcedure
    .meta({ message: 'Vendor fetched successfully' })
    .input(VendorValidators.oneInput)
    .output(VendorValidators.oneOutput)
    .query(({ ctx, input }) => ctx.services.vendor.one(input)),

  create: protectedProcedure
    .meta({
      message: 'Vendor created successfully',
      role: ['user'],
    })
    .input(VendorValidators.createInput)
    .output(VendorValidators.createOutput)
    .mutation(({ ctx, input }) => ctx.services.vendor.create(input)),

  updateStatus: protectedProcedure
    .meta({
      message: 'Vendor status updated successfully',
      role: ['admin', 'moderator'],
    })
    .input(VendorValidators.updateStatusInput)
    .output(VendorValidators.updateStatusOutput)
    .mutation(({ ctx, input }) => ctx.services.vendor.updateStatus(input)),

  update: protectedProcedure
    .meta({
      message: 'Vendor updated successfully',
      role: ['vendor_owner'],
    })
    .input(VendorValidators.updateInput)
    .output(VendorValidators.updateOutput)
    .mutation(({ ctx, input }) => ctx.services.vendor.update(input)),

  addStaff: protectedProcedure
    .meta({
      message: 'Vendor staff added successfully',
      role: ['vendor_owner'],
    })
    .input(VendorValidators.addStaffInput)
    .output(VendorValidators.addStaffOutput)
    .mutation(({ ctx, input }) => ctx.services.vendor.addStaff(input)),

  removeStaff: protectedProcedure
    .meta({
      message: 'Vendor staff removed successfully',
      role: ['vendor_owner'],
    })
    .input(VendorValidators.removeStaffInput)
    .output(VendorValidators.removeStaffOutput)
    .mutation(({ ctx, input }) => ctx.services.vendor.removeStaff(input)),
})
