import * as Validators from '@yukinu/validators/general'

import { createTRPCRouter, protectedProcedure } from '@/trpc'

export const ticketRouter = createTRPCRouter({
  all: protectedProcedure
    .meta({ message: 'Tickets fetched successfully.' })
    .input(Validators.allTicketsInput.omit({ userId: true }))
    .output(Validators.allTicketsOutput)
    .query(({ ctx, input }) =>
      ctx.services.ticket.all({
        ...input,
        userId: ['admin', 'moderator'].includes(ctx.session.role)
          ? ''
          : ctx.session.userId,
      }),
    ),

  one: protectedProcedure
    .meta({ message: 'Ticket fetched successfully.' })
    .input(Validators.oneTicketInput)
    .output(Validators.oneTicketOutput)
    .query(({ ctx, input }) => ctx.services.ticket.one(input)),

  create: protectedProcedure
    .meta({ message: 'Ticket created successfully.' })
    .input(Validators.createTicketInput.omit({ userId: true }))
    .output(Validators.createTicketOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.ticket.create({
        ...input,
        userId: ctx.session.userId,
      }),
    ),

  updateStatus: protectedProcedure
    .meta({
      message: 'Ticket status updated successfully.',
      role: ['admin', 'moderator'],
    })
    .input(Validators.updateTicketStatusInput)
    .output(Validators.updateTicketStatusOutput)
    .mutation(({ ctx, input }) => ctx.services.ticket.updateStatus(input)),
})
