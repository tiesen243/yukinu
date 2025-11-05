import type { VendorValidator } from '@yukinu/validators/vendor'

import type { IVendorRepository } from '@/contracts/repositories/vendor.repository'

export interface IVendorService {
  /**
   * Get all vendors with optional filters
   * @param data - The parameters for filtering and pagination
   * @returns A list of vendors
   */
  all(data: VendorValidator.AllParams): Promise<IVendorRepository.VendorType[]>

  /**
   * Register a new vendor
   * @param data - The data for the new vendor
   * @returns The ID of the newly created vendor
   */
  register(
    data: VendorValidator.RegisterBody & {
      ownerId: IVendorRepository.VendorType['ownerId']
    },
  ): Promise<{ id: IVendorRepository.VendorType['id'] }>

  /**
   * Approve a vendor and update the user role to vendor_owner
   * @param vendorId - The ID of the vendor to approve
   * @param userId - The ID of the user to update the role for
   */
  approve(data: VendorValidator.ApproveBody): Promise<void>

  /**
   * Invite a member to the vendor by email
   * @param vendorId - The ID of the vendor
   * @param email - The email of the user to invite
   */
  inviteMember(data: VendorValidator.InviteBody): Promise<void>
}
