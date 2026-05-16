import type { Database } from '@yukinu/db/drizzle'

import type { AllTicketsDto } from '@/modules/identity/application/dtos/ticket/all-tickets.dto'
import type { TicketRepository } from '@/modules/identity/domain/repositories/ticket.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class AllTicketsUseCase extends AbstractUseCase<
  AllTicketsDto.Input,
  AllTicketsDto.Output
> {
  constructor(
    private readonly _db: Database,
    private readonly _ticketRepo: TicketRepository,
  ) {
    super()
  }

  async execute(input: AllTicketsDto.Input): Promise<AllTicketsDto.Output> {
    const { userId, status, page, limit } = input
    const offset = (page - 1) * limit
    const whereClauses = [
      { ...(userId ? { userId } : {}), ...(status ? { status } : {}) },
    ]

    const [tickets, total] = await Promise.all([
      this._ticketRepo.find(
        whereClauses,
        { createdAt: 'desc' },
        { limit, offset },
      ),
      this._ticketRepo.count(whereClauses),
    ])
    const totalPages = Math.ceil(total / limit)

    return { tickets, pagination: { total, page, totalPages, limit } }
  }
}
