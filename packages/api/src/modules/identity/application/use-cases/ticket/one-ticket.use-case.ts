import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { OneTicketDto } from '@/modules/identity/application/dtos/ticket/one-ticket.dto'
import type { TicketRepository } from '@/modules/identity/domain/repositories/ticket.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class OneTicketUseCase extends AbstractUseCase<
  OneTicketDto.Input,
  OneTicketDto.Output
> {
  constructor(
    private readonly _db: Database,
    private readonly _ticketRepo: TicketRepository,
  ) {
    super()
  }

  async execute(input: OneTicketDto.Input): Promise<OneTicketDto.Output> {
    const [ticket] = await this._ticketRepo.find(
      [{ id: input.id }],
      {},
      { limit: 1 },
    )
    if (!ticket)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Ticket with id ${input.id} not found`,
      })
    return ticket
  }
}
