import type { TRPCRouterRecord } from '@trpc/server'

import type { UseCases } from '@/modules/merchant/types'

import { vendorMiddleware } from '@/modules/merchant/interfaces/vendor.middleware'
import {
  AllStaffsDto,
  InviteStaffDto,
  AcceptInvitationDto,
  RemoveStaffDto,
} from '@/modules/merchant/types'
import { protectedProcedure } from '@/trpc'

export const staffRouter = (useCases: UseCases) =>
  ({
    all: protectedProcedure
      .use(vendorMiddleware)
      .input(AllStaffsDto.input)
      .output(AllStaffsDto.output)
      .query(({ ctx }) =>
        useCases.staff.all.execute({ id: ctx.session.vendorId }),
      ),

    invite: protectedProcedure
      .meta({ role: ['vendor_owner'] })
      .use(vendorMiddleware)
      .input(InviteStaffDto.input.omit({ vendorId: true }))
      .output(InviteStaffDto.output)
      .mutation(({ ctx, input }) =>
        useCases.staff.invite.execute({
          vendorId: ctx.session.vendorId,
          ...input,
        }),
      ),

    acceptInvitation: protectedProcedure
      .meta({ role: ['user'] })
      .input(AcceptInvitationDto.input.omit({ userId: true }))
      .output(AcceptInvitationDto.output)
      .mutation(({ ctx, input }) =>
        useCases.staff.accept.execute({
          userId: ctx.session.userId,
          token: input.token,
        }),
      ),

    remove: protectedProcedure
      .meta({ role: ['vendor_owner'] })
      .use(vendorMiddleware)
      .input(RemoveStaffDto.input.omit({ vendorId: true }))
      .output(RemoveStaffDto.output)
      .mutation(({ ctx, input }) =>
        useCases.staff.remove.execute({
          vendorId: ctx.session.vendorId,
          ...input,
        }),
      ),
  }) satisfies TRPCRouterRecord
