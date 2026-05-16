import * as z from 'zod'

import { TicketEntity } from '@/modules/identity/domain/entities/ticket.entity'

export namespace OneTicketDto {
  export const input = z.object({ id: z.cuid2() })
  export type Input = z.infer<typeof input>

  export const output = z.instanceof(TicketEntity)
  export type Output = z.infer<typeof output>
}
