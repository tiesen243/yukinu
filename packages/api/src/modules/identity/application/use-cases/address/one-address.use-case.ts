import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { OneAddressDto } from '@/modules/identity/application/dtos/address/one-address.dto'
import type { AddressRepository } from '@/modules/identity/domain/repositories/address.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class OneAddressUseCase extends AbstractUseCase<
  OneAddressDto.Input,
  OneAddressDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _addressRepo: AddressRepository,
  ) {
    super()
  }

  public async execute(
    input: OneAddressDto.Input,
  ): Promise<OneAddressDto.Output> {
    const [address] = await this._addressRepo.find([input], {}, { limit: 1 })

    if (!address)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Address with id ${input.id} not found`,
      })

    return address
  }
}
