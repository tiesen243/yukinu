import { VendorValidators } from '@yukinu/validators/vendor'

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  vendorProcedure,
} from '@/trpc'

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

  me: vendorProcedure
    .meta({ message: 'Vendor fetched successfully', role: ['vendor_owner'] })
    .output(VendorValidators.oneOutput.omit({ id: true }))
    .query(({ ctx }) => ctx.services.vendor.one({ id: ctx.vendorId })),

  create: protectedProcedure
    .meta({
      message: 'Vendor created successfully',
      role: ['user'],
    })
    .input(VendorValidators.createInput.omit({ ownerId: true }))
    .output(VendorValidators.createOutput)
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
    .input(VendorValidators.updateStatusInput)
    .output(VendorValidators.updateStatusOutput)
    .mutation(({ ctx, input }) => ctx.services.vendor.updateStatus(input)),

  update: vendorProcedure
    .meta({
      message: 'Vendor updated successfully',
      role: ['vendor_owner'],
    })
    .input(VendorValidators.updateInput.omit({ id: true }))
    .output(VendorValidators.updateOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.vendor.update({ ...input, id: ctx.vendorId }),
    ),

  allStaffs: vendorProcedure
    .meta({
      message: 'Vendor staff fetched successfully',
      role: ['vendor_owner'],
    })
    .input(VendorValidators.allStaffsInput.omit({ vendorId: true }))
    .output(VendorValidators.allStaffsOutput)
    .query(({ ctx, input }) =>
      ctx.services.vendor.allStaffs({ ...input, vendorId: ctx.vendorId }),
    ),

  addStaff: vendorProcedure
    .meta({
      message: 'Vendor staff added successfully',
      role: ['vendor_owner'],
    })
    .input(VendorValidators.addStaffInput.omit({ vendorId: true }))
    .output(VendorValidators.addStaffOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.vendor.addStaff({ ...input, vendorId: ctx.vendorId }),
    ),

  acceptStaffInvitation: publicProcedure
    .meta({ message: 'Vendor invitation accepted successfully' })
    .input(VendorValidators.acceptStaffInvitationInput)
    .output(VendorValidators.acceptStaffInvitationOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.vendor.acceptStaffInvitation(input),
    ),

  removeStaff: vendorProcedure
    .meta({
      message: 'Vendor staff removed successfully',
      role: ['vendor_owner'],
    })
    .input(VendorValidators.removeStaffInput.omit({ vendorId: true }))
    .output(VendorValidators.removeStaffOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.vendor.removeStaff({ ...input, vendorId: ctx.vendorId }),
    ),
})
