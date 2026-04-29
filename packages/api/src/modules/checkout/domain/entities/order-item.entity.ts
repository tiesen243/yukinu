import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class OrderItemEntity extends AbstractEntity<OrderItemEntity> {
  declare public quantity: number
  declare public unitPrice: number

  declare public orderId: number
  declare public productId: string
  declare public productVariantId: string | null

  public constructor(props: AbstractEntity.EntityProps<OrderItemEntity>) {
    super({
      productVariantId: null,
      ...props,
    })
  }

  get isVariant(): boolean {
    return this.productVariantId !== null
  }

  get totalPrice(): number {
    return this.quantity * this.unitPrice
  }
}
