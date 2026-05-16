import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class WishlistItemEntity extends AbstractEntity<WishlistItemEntity> {
  declare public addedAt: Date

  declare public userId: string
  declare public productId: string

  public constructor(
    props: AbstractEntity.EntityProps<WishlistItemEntity, 'addedAt'>,
  ) {
    super({
      addedAt: new Date(),
      ...props,
    })
  }
}
