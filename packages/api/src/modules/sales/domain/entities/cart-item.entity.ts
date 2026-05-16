import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class CartItemEntity extends AbstractEntity<CartItemEntity> {
  declare public quantity: number

  declare public userId: string
  declare public productId: string
  declare public productVariantId: string | null

  public constructor(props: AbstractEntity.EntityProps<CartItemEntity>) {
    super({
      productVariantId: null,
      ...props,
    })
  }

  get isVariant(): boolean {
    return this.productVariantId !== null
  }
}
