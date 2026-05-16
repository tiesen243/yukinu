import type { Database } from '@yukinu/db/drizzle'

import type { AllAddressesDto } from '@/modules/identity/application/dtos/address/all-addresses.dto'
import type { AddressRepository } from '@/modules/identity/domain/repositories/address.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class AllAddressesUseCase extends AbstractUseCase<
  AllAddressesDto.Input,
  AllAddressesDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _addressRepo: AddressRepository,
  ) {
    super()
  }

  public execute(
    input: AllAddressesDto.Input,
  ): Promise<AllAddressesDto.Output> {
    return this._addressRepo.find([input], { recipientName: 'desc' })
  }
}
