import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class VariantOptionEntity extends AbstractEntity<
  VariantOptionEntity,
  number
> {
  declare public value: string

  declare public variantId: string
}
