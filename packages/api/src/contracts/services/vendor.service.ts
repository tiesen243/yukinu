import type { VendorValidator } from '@yukinu/validators/vendor'

import type { IVendorRepository } from '@/contracts/repositories/vendor.repository'

export interface IVendorService {
  /**
   * Get all vendors with optional filters
   * @param data - The parameters for filtering and pagination
   * @example
   * {
   *   status: 'approved', // optional
   *   page: 1,
   *   limit: 10
   * }
   * @returns A list of vendors along with pagination details
   */
  all(data: VendorValidator.AllParams): Promise<{
    vendors: IVendorRepository.FindWithOwnerResult[]
    pagination: { page: number; total: number; totalPages: number }
  }>

  /**
   * Register a new vendor
   * @param data - The data for registering a new vendor
   * @example
   * {
   *   name: 'Vendor Name',
   *   ownerId: 'owner-uuid'
   * }
   * @returns The ID of the newly registered vendor
   */
  register(
    data: VendorValidator.RegisterBody & {
      ownerId: IVendorRepository.VendorType['ownerId']
    },
  ): Promise<{ id: IVendorRepository.VendorType['id'] }>

  /**
   * Update a vendor's status and adjust the owner's role accordingly
   * @param data - The data for updating the vendor
   * @example
   * {
   *   vendorId: 'vendor-uuid',
   *   status: 'approved'
   * }
   */
  update(data: VendorValidator.UpdateBody): Promise<void>

  /**
   * Delete a vendor by ID
   * @param data - The parameters for deleting the vendor
   * @example
   * {
   *   vendorId: 'vendor-uuid'
   * }
   */
  delete(data: VendorValidator.OneParams): Promise<void>

  /**
   * Invite a member to the vendor by email
   * @param data - The data for inviting a member
   * @example
   * {
   *   vendorId: 'vendor-uuid',
   *   email: 'member@vendor.com'
   *  }
   */
  inviteMember(data: VendorValidator.InviteBody): Promise<void>
}
