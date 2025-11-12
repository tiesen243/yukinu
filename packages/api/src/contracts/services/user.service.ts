import type { UserModels } from '@yukinu/validators/user'

export interface IUserService {
  /**
   * Get a list of users with pagination
   * @param input - The query parameters for searching and pagination
   * @example
   * {
   *   search: 'john',
   *   page: 1,
   *   limit: 10
   * }
   * @returns A list of users and pagination info
   */
  all(input: UserModels.AllInput): Promise<UserModels.AllOutput>

  /**
   * Get a single user by ID
   * @param input - The data containing the user ID
   * @example
   * {
   *   id: 'user-id'
   * }
   * @returns The user's information
   */
  one(input: UserModels.OneInput): Promise<UserModels.OneOutput>

  /**
   * Update a user's information
   * @param input - The data to update the user with
   * @example
   * {
   *   id: 'user-id',
   *   role: 'admin',
   *   status: 'active',
   *   password: 'newPassword123' // optional
   * }
   * @param actingUser - The user performing the update
   * @example
   * {
   *   id: 'admin-user-id',
   *   role: 'admin'
   * }
   * @returns The ID of the updated user
   */
  update(
    input: UserModels.UpdateInput,
    actingUser: Pick<UserModels.User, 'id' | 'role'>,
  ): Promise<UserModels.UpdateOutput>

  /**
   * Delete a user
   * @param input - The data containing the user ID to delete
   * @example
   * {
   *   id: 'user-id'
   * }
   * @param actingUser - The user performing the deletion
   * @example
   * {
   *   id: 'admin-user-id',
   *   role: 'admin'
   * }
   * @returns The ID of the deleted user
   */
  delete(
    input: UserModels.DeleteInput,
    actingUser: Pick<UserModels.User, 'id' | 'role'>,
  ): Promise<UserModels.DeleteOutput>
}
