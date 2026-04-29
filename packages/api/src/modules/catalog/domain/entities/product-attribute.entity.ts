import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class ProductAttributeEntity extends AbstractEntity<ProductAttributeEntity> {
  declare public value: number

  declare public productId: string
  declare public attributeId: string
}
