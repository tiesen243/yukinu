import * as z from 'zod'

import { TicketEntity } from '@/modules/identity/domain/entities/ticket.entity'

export namespace UpdateTicketStatusDto {
  export const input = z.object({
    id: z.cuid2(),
    status: z.enum(TicketEntity.statuses),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({ id: z.cuid2() })
  export type Output = z.infer<typeof output>
}
