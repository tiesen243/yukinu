import * as Validators from '@yukinu/validators/general'

import { createTRPCRouter, protectedProcedure } from '@/trpc'

export const ticketRouter = createTRPCRouter({
  all: protectedProcedure
    .meta({ message: 'Tickets fetched successfully.' })
    .input(Validators.allTicketsInput.omit({ userId: true }))
    .output(Validators.allTicketsOutput)
    .query(({ ctx, input }) =>
      ctx.services.ticket.all({ ...input, userId: ctx.session.userId }),
    ),

  allByAdmin: protectedProcedure
    .meta({
      message: 'All tickets fetched successfully.',
      role: ['admin', 'moderator'],
    })
    .input(Validators.allTicketsInput.omit({ userId: true }))
    .output(Validators.allTicketsOutput)
    .query(({ ctx, input }) =>
      ctx.services.ticket.all({ ...input, userId: '' }),
    ),

  one: protectedProcedure
    .meta({ message: 'Ticket fetched successfully.' })
    .input(Validators.oneTicketInput)
    .output(Validators.oneTicketOutput)
    .query(({ ctx, input }) => ctx.services.ticket.one(input)),

  updateStatus: protectedProcedure
    .meta({
      message: 'Ticket status updated successfully.',
      role: ['admin', 'moderator'],
    })
    .input(Validators.updateTicketStatusInput)
    .output(Validators.updateTicketStatusOutput)
    .mutation(({ ctx, input }) => ctx.services.ticket.updateStatus(input)),
})
