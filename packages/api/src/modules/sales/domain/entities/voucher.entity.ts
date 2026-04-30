import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class VoucherEntity extends AbstractEntity<VoucherEntity> {
  declare public code: string
  declare public discountAmount: string | null
  declare public discountPercentage: number | null
  declare public quantity: number
  declare public expiredAt: Date

  public constructor(props: AbstractEntity.EntityProps<VoucherEntity>) {
    super({
      discountAmount: null,
      discountPercentage: null,
      ...props,
    })
  }
}
