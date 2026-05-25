import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class VendorBalanceEntity extends AbstractEntity<VendorBalanceEntity> {
  declare public balance: string

  declare public vendorId: string
}
