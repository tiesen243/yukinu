import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class VendorEntity extends AbstractEntity<VendorEntity> {
  declare public name: string
  declare public description: string | null
  declare public image: string | null
  declare public address: string | null
  declare public contact: string | null
  declare public status: VendorEntity.Status
  declare public payoutBankName: string | null
  declare public payoutAccountName: string | null
  declare public payoutAccountNumber: string | null

  declare public ownerId: string

  public constructor(props: AbstractEntity.EntityProps<VendorEntity>) {
    super({
      description: null,
      image: null,
      address: null,
      contact: null,
      payoutBankName: null,
      payoutAccountName: null,
      payoutAccountNumber: null,
      ...props,
    })
  }
}

export namespace VendorEntity {
  export type Status = 'pending' | 'approved' | 'rejected' | 'suspended'
}
