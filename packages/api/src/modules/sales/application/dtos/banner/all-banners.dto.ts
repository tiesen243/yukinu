import { z } from 'zod'

import { BannerEntity } from '@/modules/sales/domain/entities/banner.entity'

export namespace AllBannersDto {
  export const input = z.void()
  export type Input = z.infer<typeof input>

  export const output = z.array(z.instanceof(BannerEntity))
  export type Output = z.infer<typeof output>
}
