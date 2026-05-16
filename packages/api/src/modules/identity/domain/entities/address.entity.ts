import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class AddressEntity extends AbstractEntity<AddressEntity> {
  declare public recipientName: string
  declare public phoneNumber: string
  declare public street: string
  declare public city: string
  declare public state: string
  declare public postalCode: string
  declare public country: string

  declare public userId: string
}
