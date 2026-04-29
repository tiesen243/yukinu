import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class ProductEntity extends AbstractEntity<ProductEntity> {
  declare public name: string
  declare public description: string
  declare public price: number
  declare public stock: number
  declare public sold: number
  declare public deletedAt: Date | null

  declare public vendorId: string | null
  declare public categoryId: string | null

  public constructor(props: AbstractEntity.EntityProps<ProductEntity>) {
    super({
      deletedAt: null,
      vendorId: null,
      categoryId: null,
      ...props,
    })
  }
}
