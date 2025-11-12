import { TRPCError } from '@trpc/server'

import type { Database } from '@yukinu/db'
import type { ProfileModels } from '@yukinu/validators/profile'

import type { IProfileService } from '@/contracts/services/profile.service'
import type { IProfileRepository } from '@/types'

export class ProfileService implements IProfileService {
  constructor(
    private readonly _db: Database,
    private readonly _profile: IProfileRepository,
  ) {}

  async getByUserId(
    input: ProfileModels.OneInput,
  ): Promise<Omit<ProfileModels.OneOutput, 'username' | 'email'>> {
    const profile = await this._profile.find(input.id)
    if (!profile)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Profile not found' })
    return profile
  }

  async update(
    input: ProfileModels.UpdateInput,
  ): Promise<ProfileModels.UpdateOutput> {
    const { id = '', ...updateData } = input

    const profile = await this._profile.find(id)
    if (!profile)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Profile not found' })

    await this._profile.update(id, updateData)

    return { profileId: id }
  }
}
