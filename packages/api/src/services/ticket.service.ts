import type { ITicketRepository } from '@/contracts/repositories/ticket.repository'
import type { ITicketService } from '@/contracts/services/ticket.service'
import type { Database } from '@yukinu/db'
import type * as Validators from '@yukinu/validators/general'

import { TRPCError } from '@trpc/server'

export class TicketService implements ITicketService {
  constructor(
    private readonly _db: Database,
    private readonly _ticket: ITicketRepository,
  ) {}

  async all(
    input: Validators.AllTicketsInput,
  ): Promise<Validators.AllTicketsOutput> {
    const { userId, status, page, limit } = input
    const offset = (page - 1) * limit

    const whereClauses = [{ ...(userId ? { userId } : {}), status }]

    const [tickets, total] = await Promise.all([
      this._ticket.all(whereClauses, { createdAt: 'desc' }, { limit, offset }),
      this._ticket.count(whereClauses),
    ])
    const totalPages = Math.ceil(total / limit)

    return {
      tickets,
      pagination: { total, page, totalPages, limit },
    }
  }

  async one(
    input: Validators.OneTicketInput,
  ): Promise<Validators.OneTicketOutput> {
    const ticket = await this._ticket.find(input.id)
    if (!ticket)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Ticket not found' })
    return ticket
  }

  async create(
    input: Validators.CreateTicketInput,
  ): Promise<Validators.CreateTicketOutput> {
    const newTicketId = await this._ticket.create(input)
    return { id: newTicketId }
  }

  async updateStatus(
    input: Validators.UpdateTicketStatusInput,
  ): Promise<Validators.UpdateTicketStatusOutput> {
    const ticket = await this.one({ id: input.id })
    await this._ticket.update(ticket.id, { status: input.status })
    return { id: ticket.id }
  }
}
