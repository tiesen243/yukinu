import type { AddressEntity } from '@/modules/identity/domain/entities/address.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface AddressRepository extends AbstractRepository<AddressEntity> {}
