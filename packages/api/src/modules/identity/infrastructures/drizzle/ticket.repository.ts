import type { Database } from '@yukinu/db/drizzle'

import { tickets } from '@yukinu/db/schema'

import type { TicketRepository } from '@/modules/identity/domain/repositories/ticket.repository'

import { TicketEntity } from '@/modules/identity/domain/entities/ticket.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleTicketRepository
  extends DrizzleRepository<TicketEntity, typeof tickets>
  implements TicketRepository
{
  public constructor(db: Database) {
    super(db, tickets, 'id')
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof tickets>,
  ): TicketEntity {
    return new TicketEntity(row)
  }
}
