import type { Database } from '@yukinu/db/drizzle'

import type { CreateTicketDto } from '@/modules/identity/application/dtos/ticket/create-ticket.dto'
import type { TicketRepository } from '@/modules/identity/domain/repositories/ticket.repository'

import { TicketEntity } from '@/modules/identity/domain/entities/ticket.entity'
import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class CreateTicketUseCase extends AbstractUseCase<
  CreateTicketDto.Input,
  CreateTicketDto.Output
> {
  constructor(
    private readonly _db: Database,
    private readonly _ticketRepo: TicketRepository,
  ) {
    super()
  }

  async execute(input: CreateTicketDto.Input): Promise<CreateTicketDto.Output> {
    const ticket = new TicketEntity(input)
    await this._ticketRepo.save(ticket)
    return { id: ticket.id }
  }
}
