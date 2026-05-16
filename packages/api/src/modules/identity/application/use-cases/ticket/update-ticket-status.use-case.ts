import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { UpdateTicketStatusDto } from '@/modules/identity/application/dtos/ticket/update-ticket-status.dto'
import type { TicketRepository } from '@/modules/identity/domain/repositories/ticket.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class UpdateTicketStatusUseCase extends AbstractUseCase<
  UpdateTicketStatusDto.Input,
  UpdateTicketStatusDto.Output
> {
  constructor(
    private readonly _db: Database,
    private readonly _ticketRepo: TicketRepository,
  ) {
    super()
  }

  async execute(
    input: UpdateTicketStatusDto.Input,
  ): Promise<UpdateTicketStatusDto.Output> {
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

    const updatedTicket = ticket.clone({ status: input.status })
    await this._ticketRepo.save(updatedTicket)
    return { id: updatedTicket.id }
  }
}
