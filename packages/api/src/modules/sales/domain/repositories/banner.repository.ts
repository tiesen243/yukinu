import type { BannerEntity } from '@/modules/sales/domain/entities/banner.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface BannerRepository extends AbstractRepository<BannerEntity> {}
