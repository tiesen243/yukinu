import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class AttributeEntity extends AbstractEntity<AttributeEntity> {
  declare public name: string
}
