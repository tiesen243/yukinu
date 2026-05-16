import { z } from 'zod'

export namespace CreateBannerDto {
  export const input = z.object({ url: z.url() })
  export type Input = z.infer<typeof input>

  export const output = z.object({ id: z.cuid2() })
  export type Output = z.infer<typeof output>
}
