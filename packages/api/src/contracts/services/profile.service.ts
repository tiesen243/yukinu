import type { ProfileModels } from '@yukinu/validators/profile'

export interface IProfileService {
  /**
   * Get profile by user ID
   * @param input - The user ID to fetch the profile for
   * @example
   * {
   *  id: 'user-id'
   * }
   * @returns The profile associated with the user ID, or null if not found
   */
  getByUserId(
    input: ProfileModels.OneInput,
  ): Promise<Omit<ProfileModels.OneOutput, 'username' | 'email'>>

  /**
   * Update profile information
   * @param input - The data for updating the profile
   * @example
   * {
   *  id: 'profile-id',
   *  fullName: 'New Full Name', // optional
   *  avatarUrl: 'https://new-avatar-url.com/avatar.png', // optional
   *  bio: 'Updated bio', // optional
   *  gender: 'other', // optional
   *  dateOfBirth: '1990-01-01', // optional
   *  website: 'https://new-website.com' // optional
   * }
   * @returns The updated profile
   */
  update(input: ProfileModels.UpdateInput): Promise<ProfileModels.UpdateOutput>
}
