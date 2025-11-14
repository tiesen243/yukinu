import type { AddressModels } from '@yukinu/validators/address'

export interface IAddressService {
  /**
   * Get all addresses
   * @param input - The user's id to get addresses for
   * @example
   * {
   *   userId: 'Main St',
   * }
   * @returns A list of addresses
   */
  all(input: AddressModels.AllInput): Promise<AddressModels.AllOutput>

  /**
   * Get a single address by ID
   * @param input - The data containing the address ID and user ID
   * @example
   * {
   *   id: 'address-id'
   *   userId: 'user-id'
   * }
   * @returns The address information
   */
  one(input: AddressModels.OneInput): Promise<AddressModels.OneOutput>

  /**
   * Create a new address
   * @param input - The data to create the address with
   * @example
   * {
   *  userId: 'user-id',
   *  recipientName: 'John Doe',
   *  phoneNumber: '123-456-7890',
   *  street: '123 Main St',
   *  city: 'Anytown',
   *  state: 'CA',
   *  postalCode: '12345',
   *  country: 'USA'
   * }
   * @returns The ID of the created address
   */
  create(input: AddressModels.CreateInput): Promise<AddressModels.CreateOutput>

  /**
   * Update an existing address
   * @param input - The data to update the address with
   * @example
   * {
   *   id: 'address-id',
   *   recipientName: 'Jane Doe', // optional
   *   phoneNumber: '987-654-3210', // optional
   *   street: '456 Elm St', // optional
   *   city: 'Othertown', // optional
   *   state: 'NY', // optional
   *   postalCode: '54321', // optional
   *   country: 'USA' // optional
   * }
   * @returns The ID of the updated address
   */
  update(input: AddressModels.UpdateInput): Promise<AddressModels.UpdateOutput>

  /**
   * Delete an address
   * @param input - The data containing the address ID and user ID to delete
   * @example
   * {
   *   id: 'address-id'
   *   userId: 'user-id'
   * }
   * @returns The ID of the deleted address
   */
  delete(input: AddressModels.DeleteInput): Promise<AddressModels.DeleteOutput>
}
