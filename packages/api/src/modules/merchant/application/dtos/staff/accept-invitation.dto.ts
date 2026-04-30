import * as z from 'zod'

export namespace AcceptInvitationDto {
  export const input = z.object({ token: z.string(), userId: z.cuid2() })
  export type Input = z.infer<typeof input>

  export const output = z.object({ userId: z.cuid2() })
  export type Output = z.infer<typeof output>
}
