import * as z from 'zod'

import { SessionEntity } from '@/modules/identity/domain/entities/session.entity'

export namespace AllSessionsDto {
  export const input = z.object({ userId: z.cuid2() })
  export type Input = z.infer<typeof input>

  export const output = z.array(z.instanceof(SessionEntity))
  export type Output = z.infer<typeof output>
}
