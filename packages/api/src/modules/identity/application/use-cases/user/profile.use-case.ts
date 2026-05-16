import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { ProfileDto } from '@/modules/identity/application/dtos/user/profile.dto'
import type { ProfileRepository } from '@/modules/identity/domain/repositories/profile.repository'
import type { UserRepository } from '@/modules/identity/domain/repositories/user.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class ProfileUseCase extends AbstractUseCase<
  ProfileDto.Input,
  ProfileDto.Output
> {
  constructor(
    private readonly _db: Database,
    private readonly _userRepo: UserRepository,
    private readonly _profileRepo: ProfileRepository,
  ) {
    super()
  }

  public async execute(input: ProfileDto.Input): Promise<ProfileDto.Output> {
    const [[user], [profile]] = await Promise.all([
      this._userRepo.find([input], {}, { limit: 1 }),
      this._profileRepo.find([input], {}, { limit: 1 }),
    ])

    if (!user || !profile)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })

    return { user, profile }
  }
}
