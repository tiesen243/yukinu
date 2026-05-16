import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class BannerEntity extends AbstractEntity<BannerEntity> {
  declare public url: string
}
