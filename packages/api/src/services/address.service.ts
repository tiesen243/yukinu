import { TRPCError } from '@trpc/server'

import type { Database } from '@yukinu/db'
import type { AddressModels } from '@yukinu/validators/address'

import type { IAddressRepository, IAddressService } from '@/types'

export class AddressService implements IAddressService {
  constructor(
    private readonly _db: Database,
    private readonly _address: IAddressRepository,
  ) {}

  async all(input: AddressModels.AllInput): Promise<AddressModels.AllOutput> {
    const { userId } = input
    const addresses = await this._address.findBy([{ userId }])
    return { addresses }
  }

  async one(input: AddressModels.OneInput): Promise<AddressModels.OneOutput> {
    const { id, userId } = input
    const address = await this._address.find(id)
    if (!address)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Address not found.' })

    if (address.userId !== userId)
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: "You don't have permission to access this address.",
      })

    return address
  }

  async create(
    input: AddressModels.CreateInput,
  ): Promise<AddressModels.CreateOutput> {
    const addressCount = await this._address.count([{ userId: input.userId }])
    if (addressCount >= 5)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You can have a maximum of 5 addresses.',
      })

    const newAddress = await this._address.create({
      ...input,
      isDefault: addressCount === 0,
    })

    return { addressId: newAddress.id }
  }

  async update(
    input: AddressModels.UpdateInput,
  ): Promise<AddressModels.UpdateOutput> {
    const { id = '', userId, isDefault, ...updateData } = input

    const address = await this._address.find(id)
    if (!address)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Address not found.' })

    if (address.userId !== userId)
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: "You don't have permission to update this address.",
      })

    return this._db.transaction(async (tx) => {
      if (isDefault) {
        await this._address.updateBy([{ userId }], { isDefault: false }, tx)
        await this._address.update(id, { isDefault }, tx)
      }

      await this._address.update(id, updateData, tx)
      return { addressId: id }
    })
  }

  async delete(
    input: AddressModels.DeleteInput,
  ): Promise<AddressModels.DeleteOutput> {
    const { id, userId } = input

    const address = await this._address.find(id)
    if (!address)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Address not found.' })

    if (address.userId !== userId)
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: "You don't have permission to delete this address.",
      })

    if (address.isDefault) {
      if ((await this._address.count([{ userId }])) > 1)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Cannot delete the default address. Please set another address as default before deleting.',
        })
    }

    await this._address.delete(id)
    return { addressId: id }
  }
}
