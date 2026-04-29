import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class ProductAttributeEntity extends AbstractEntity<ProductAttributeEntity> {
  declare public value: string

  declare public productId: string
  declare public attributeId: string
}
