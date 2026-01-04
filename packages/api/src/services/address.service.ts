import type { IAddressRepository } from '@/contracts/repositories/address.repository'
import type { IAddressService } from '@/contracts/services/address.service'
import type { Database } from '@yukinu/db'
import type * as Validators from '@yukinu/validators/user'

import { TRPCError } from '@trpc/server'

export class AddressService implements IAddressService {
  constructor(
    private readonly _db: Database,
    private readonly _address: IAddressRepository,
  ) {}

  async all(
    input: Validators.AllAddressesInput,
  ): Promise<Validators.AllAddressesOutput> {
    const { userId } = input
    const addresses = await this._address.all([{ userId }])
    return { addresses }
  }

  async one(
    input: Validators.OneAddressInput,
  ): Promise<Validators.OneAddressOutput> {
    const address = await this._address.find(input.id)
    if (!address)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Address with ID ${input.id} not found.`,
      })

    if (address.userId !== input.userId)
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `You do not have permission to access this address.`,
      })

    return address
  }

  async create(
    input: Validators.CreateAddressInput,
  ): Promise<Validators.CreateAddressOutput> {
    const newAddressId = await this._address.create(input)
    return { id: newAddressId }
  }

  async update(
    input: Validators.UpdateAddressInput,
  ): Promise<Validators.UpdateAddressOutput> {
    const { id, userId, ...updateData } = input

    await this.one({ id, userId })
    await this._address.update(id, updateData)

    return { id }
  }

  async delete(
    input: Validators.DeleteAddressInput,
  ): Promise<Validators.DeleteAddressOutput> {
    const { id, userId } = input

    await this.one({ id, userId })
    await this._address.delete(id)

    return { id }
  }
}
