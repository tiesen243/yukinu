import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class TicketEntity extends AbstractEntity<TicketEntity> {
  declare public subject: string
  declare public description: string
  declare public status: TicketEntity.Status

  declare public userId: string
}

export namespace TicketEntity {
  export const statuses = ['open', 'resolved', 'closed'] as const
  export type Status = (typeof statuses)[number]
}
