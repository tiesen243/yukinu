import * as Validators from '@yukinu/validators/vendor'

import { createTRPCRouter, protectedProcedure, vendorProcedure } from '@/trpc'

export const vendorStaffRouter = createTRPCRouter({
  all: vendorProcedure
    .meta({
      message: 'Vendor staff fetched successfully',
      role: ['vendor_owner'],
    })
    .input(Validators.allStaffsInput.omit({ id: true }))
    .output(Validators.allStaffsOutput)
    .query(({ ctx, input }) =>
      ctx.services.vendorStaff.all({ ...input, id: ctx.vendorId }),
    ),

  invite: vendorProcedure
    .meta({ message: 'Staff invited successfully.', role: ['vendor_owner'] })
    .input(Validators.inviteStaffInput.omit({ vendorId: true }))
    .output(Validators.inviteStaffOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.vendorStaff.invite({
        ...input,
        vendorId: ctx.vendorId,
      }),
    ),

  acceptInvitation: protectedProcedure
    .meta({
      message: 'Staff invitation accepted successfully.',
      role: ['user'],
    })
    .input(Validators.acceptStaffInvitationInput)
    .output(Validators.acceptStaffInvitationOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.vendorStaff.acceptInvitation(input),
    ),

  remove: vendorProcedure
    .meta({ message: 'Staff removed successfully.', role: ['vendor_owner'] })
    .input(Validators.removeStaffInput.omit({ vendorId: true }))
    .output(Validators.removeStaffOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.vendorStaff.remove({
        ...input,
        vendorId: ctx.vendorId,
      }),
    ),
})
