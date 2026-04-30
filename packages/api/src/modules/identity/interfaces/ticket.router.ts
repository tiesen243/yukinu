import type { TRPCRouterRecord } from '@trpc/server'

import type { UseCases } from '@/modules/identity/types'

import {
  AllTicketsDto,
  OneTicketDto,
  CreateTicketDto,
  UpdateTicketStatusDto,
} from '@/modules/identity/types'
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
      .input(CreateTicketDto.input)
      .output(CreateTicketDto.output)
      .mutation(({ input }) => ticket.create.execute(input)),

    updateStatus: protectedProcedure
      .meta({ role: ['admin', 'moderator'] })
      .input(UpdateTicketStatusDto.input)
      .output(UpdateTicketStatusDto.output)
      .mutation(({ input }) => ticket.updateStatus.execute(input)),
  }) satisfies TRPCRouterRecord
