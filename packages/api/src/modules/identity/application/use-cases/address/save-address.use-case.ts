import type { Database } from '@yukinu/db/drizzle'

import type { SaveAddressDto } from '@/modules/identity/application/dtos/address/save-address.dto'
import type { AddressRepository } from '@/modules/identity/domain/repositories/address.repository'

import { AddressEntity } from '@/modules/identity/domain/entities/address.entity'
import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class SaveAddressUseCase extends AbstractUseCase<
  SaveAddressDto.Input,
  SaveAddressDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _addressRepo: AddressRepository,
  ) {
    super()
  }

  public async execute(
    input: SaveAddressDto.Input,
  ): Promise<SaveAddressDto.Output> {
    const address = new AddressEntity(input)
    await this._addressRepo.save(address)
    return address
  }
}
