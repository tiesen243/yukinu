import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class CategoryEntity extends AbstractEntity<CategoryEntity> {
  declare public name: string
  declare public description: string | null
  declare public image: string | null

  declare public parentId: string | null

  public constructor(props: AbstractEntity.EntityProps<CategoryEntity>) {
    super({
      description: null,
      image: null,
      parentId: null,
      ...props,
    })
  }
}
