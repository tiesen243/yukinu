import * as z from 'zod'

import { TicketEntity } from '@/modules/identity/domain/entities/ticket.entity'
import { Pagination } from '@/shared/schema'

export namespace AllTicketsDto {
  export const input = Pagination.input.extend({
    userId: z.cuid2().optional(),
    status: z.enum(TicketEntity.statuses).nullable(),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    tickets: z.array(z.instanceof(TicketEntity)),
    pagination: Pagination.output,
  })
  export type Output = z.infer<typeof output>
}
