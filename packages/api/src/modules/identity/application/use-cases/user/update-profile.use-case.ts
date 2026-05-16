import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'
import { utapi } from '@yukinu/uploadthing'

import type { UpdateProfileDto } from '@/modules/identity/application/dtos/user/update-profile.dto'
import type { ProfileRepository } from '@/modules/identity/domain/repositories/profile.repository'
import type { UserRepository } from '@/modules/identity/domain/repositories/user.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class UpdateProfileUseCase extends AbstractUseCase<
  UpdateProfileDto.Input,
  UpdateProfileDto.Output
> {
  constructor(
    private readonly _db: Database,
    private readonly _profileRepo: ProfileRepository,
    private readonly _userRepo: UserRepository,
  ) {
    super()
  }

  public async execute(
    input: UpdateProfileDto.Input,
  ): Promise<UpdateProfileDto.Output> {
    const { id, image, ...profileData } = input

    const [[user], [profile]] = await Promise.all([
      this._userRepo.find([{ id }], {}, { limit: 1 }),
      this._profileRepo.find([{ id }], {}, { limit: 1 }),
    ])

    if (!user || !profile)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })

    if (image !== user.image) {
      const updatedUser = user.clone({ image })
      await this._userRepo.save(updatedUser)
      if (user.image) await utapi.deleteFiles(user.image.split('/').pop() ?? '')
    }

    const updatedProfile = profile.clone(profileData)
    await this._profileRepo.save(updatedProfile)
    if (profile.banner && profileData.banner !== profile.banner)
      await utapi.deleteFiles(profile.banner.split('/').pop() ?? '')

    return { id }
  }
}
