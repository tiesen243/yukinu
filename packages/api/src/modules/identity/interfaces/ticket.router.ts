import type { TRPCRouterRecord } from '@trpc/server'

import type { UseCases } from '@/modules/identity/types'

import { AllTicketsDto } from '@/modules/identity/application/dtos/ticket/all-tickets.dto'
import { CreateTicketDto } from '@/modules/identity/application/dtos/ticket/create-ticket.dto'
import { OneTicketDto } from '@/modules/identity/application/dtos/ticket/one-ticket.dto'
import { UpdateTicketStatusDto } from '@/modules/identity/application/dtos/ticket/update-ticket-status.dto'
import { protectedProcedure } from '@/trpc'

export const ticketRouter = ({ ticket }: UseCases) =>
  ({
    all: protectedProcedure
      .meta({ role: ['admin', 'moderator'] })
      .input(AllTicketsDto.input.omit({ userId: true }))
      .output(AllTicketsDto.output)
      .query(({ input }) => ticket.all.execute(input)),

    me: protectedProcedure
      .input(AllTicketsDto.input.omit({ userId: true }))
      .output(AllTicketsDto.output)
      .query(({ ctx, input }) =>
        ticket.all.execute({
          ...input,
          userId: ctx.session.userId,
        }),
      ),

    one: protectedProcedure
      .input(OneTicketDto.input)
      .output(OneTicketDto.output)
      .query(({ input }) => ticket.one.execute(input)),

    create: protectedProcedure
      .input(CreateTicketDto.input.omit({ userId: true }))
      .output(CreateTicketDto.output)
      .mutation(({ ctx, input }) =>
        ticket.create.execute({
          ...input,
          userId: ctx.session.userId,
        }),
      ),

    updateStatus: protectedProcedure
      .meta({ role: ['admin', 'moderator'] })
      .input(UpdateTicketStatusDto.input)
      .output(UpdateTicketStatusDto.output)
      .mutation(({ input }) => ticket.updateStatus.execute(input)),
  }) satisfies TRPCRouterRecord
