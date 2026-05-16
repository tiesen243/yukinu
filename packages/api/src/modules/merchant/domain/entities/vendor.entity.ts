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

  declare public ownerId: string | null

  public constructor(
    props: AbstractEntity.EntityProps<VendorEntity, 'status'>,
  ) {
    super({
      description: null,
      image: null,
      address: null,
      contact: null,
      payoutBankName: null,
      payoutAccountName: null,
      payoutAccountNumber: null,
      ownerId: null,
      status: 'pending',
      ...props,
    })
  }
}

export namespace VendorEntity {
  export const statuses = [
    'pending',
    'approved',
    'rejected',
    'suspended',
  ] as const
  export type Status = (typeof statuses)[number]
}
