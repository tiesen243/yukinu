import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class VendorBalanceEntity extends AbstractEntity<VendorBalanceEntity> {
  declare public balance: number

  declare public vendorId: string
}
