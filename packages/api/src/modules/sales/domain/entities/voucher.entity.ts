import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class VoucherItemEntity extends AbstractEntity<VoucherItemEntity> {
  declare public code: string
  declare public discountAmount: string | null
  declare public discountPercentage: number | null
  declare public quantity: number
  declare public expiredAt: Date

  public constructor(props: AbstractEntity.EntityProps<VoucherItemEntity>) {
    super({
      discountAmount: null,
      discountPercentage: null,
      ...props,
    })
  }
}
