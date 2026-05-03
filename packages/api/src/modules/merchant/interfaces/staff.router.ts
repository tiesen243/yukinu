import type { TRPCRouterRecord } from '@trpc/server'

import type { UseCases } from '@/modules/merchant/types'

import { vendorMiddleware } from '@/modules/merchant/interfaces/vendor.middleware'
import {
  AllStaffsDto,
  InviteStaffDto,
  AcceptInvitationDto,
  RemoveStaffDto,
} from '@/modules/merchant/types'
import { protectedProcedure, publicProcedure } from '@/trpc'

export const staffRouter = ({ staff }: UseCases) =>
  ({
    all: protectedProcedure
      .use(vendorMiddleware)
      .input(AllStaffsDto.input.omit({ id: true }))
      .output(AllStaffsDto.output)
      .query(({ ctx }) => staff.all.execute({ id: ctx.session.vendorId })),

    invite: protectedProcedure
      .meta({ role: ['vendor_owner'] })
      .use(vendorMiddleware)
      .input(InviteStaffDto.input.omit({ vendorId: true }))
      .output(InviteStaffDto.output)
      .mutation(({ ctx, input }) =>
        staff.invite.execute({
          vendorId: ctx.session.vendorId,
          ...input,
        }),
      ),

    acceptInvitation: publicProcedure
      .input(AcceptInvitationDto.input)
      .output(AcceptInvitationDto.output)
      .mutation(({ input }) => staff.accept.execute({ token: input.token })),

    remove: protectedProcedure
      .meta({ role: ['vendor_owner'] })
      .use(vendorMiddleware)
      .input(RemoveStaffDto.input.omit({ vendorId: true }))
      .output(RemoveStaffDto.output)
      .mutation(({ ctx, input }) =>
        staff.remove.execute({
          vendorId: ctx.session.vendorId,
          ...input,
        }),
      ),
  }) satisfies TRPCRouterRecord
