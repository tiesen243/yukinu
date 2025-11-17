import type { UserModels } from '@yukinu/validators/user'
import type { VendorModels } from '@yukinu/validators/vendor'

export interface IVendorService {
  /**
   * Get all vendors with optional filters
   * @param input - The parameters for filtering and pagination
   * @example
   * {
   *   status: 'approved', // optional
   *   page: 1,
   *   limit: 10
   * }
   * @returns A list of vendors along with pagination details
   */
  all(input: VendorModels.AllInput): Promise<VendorModels.AllOutput>

  /**
   * Get a single vendor associated with the acting user
   * @param actingUser - The user requesting their vendor information
   * @example
   * {
   *   id: 'user-id',
   *   role: 'vendor_owner' | 'vendor_staff'
   * }
   * @returns The vendor associated with the acting user
   */
  one(
    actingUser: Pick<UserModels.User, 'id' | 'role'>,
  ): Promise<Pick<VendorModels.Vendor, 'id'>>

  /**
   * Register a new vendor
   * @param input - The data for registering a new vendor
   * @example
   * {
   *  userId: 'user-id',
   *  name: 'Vendor Name',
   *  description: 'A brief description of the vendor',
   *  website: 'https://vendor-website.com'
   * }
   * @returns The ID of the newly registered vendor
   */
  register(
    input: VendorModels.RegisterInput,
  ): Promise<VendorModels.RegisterOutput>

  /**
   * Update a vendor's status and adjust the owner's role accordingly
   * @param input - The data for updating the vendor
   * @example
   * {
   *  id: 'vendor-id',
   *  name: 'Updated Vendor Name',
   *  description: 'Updated description', // optional
   *  status: 'approved',
   *  website: 'https://updated-website.com', // optional
   *  imageUrl: 'https://image-url.com/image.png' // optional
   * }
   * @param actingUser - The user performing the update
   * @example
   * {
   *   id: 'admin-user-id',
   *   role: 'admin'
   * }
   * @returns The ID of the updated vendor
   */
  update(
    input: VendorModels.UpdateInput,
    actingUser: Pick<UserModels.User, 'id' | 'role'>,
  ): Promise<VendorModels.UpdateOutput>

  /**
   * Delete a vendor by ID
   * @param input - The parameters for deleting the vendor
   * @example
   * {
   *   id: 'vendor-id'
   * }
   * @param actingUser - The user performing the deletion
   * @example
   * {
   *   id: 'admin-user-id',
   *   role: 'admin'
   * }
   * @returns The ID of the deleted vendor
   */
  delete(
    input: VendorModels.DeleteInput,
    actingUser: Pick<UserModels.User, 'id' | 'role'>,
  ): Promise<VendorModels.DeleteOutput>
}
