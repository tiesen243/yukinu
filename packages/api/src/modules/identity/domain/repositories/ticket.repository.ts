import type { TicketEntity } from '@/modules/identity/domain/entities/ticket.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface TicketRepository extends AbstractRepository<TicketEntity> {}
