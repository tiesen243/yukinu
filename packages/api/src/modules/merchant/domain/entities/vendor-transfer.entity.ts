import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class VendorTransferEntity extends AbstractEntity<VendorTransferEntity> {
  declare public reference: string
  declare public amountIn: string | null
  declare public amountOut: string | null

  declare public vendorId: string

  public constructor(props: AbstractEntity.EntityProps<VendorTransferEntity>) {
    super({
      amountIn: null,
      amountOut: null,
      ...props,
    })
  }
}
