import type { NewProfile, Profile, profiles } from '@yukinu/db/schema/profile'

import type { IBaseRepository } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IProfileRepository extends IBaseRepository<typeof profiles> {}

export declare namespace IProfileRepository {
  export type ProfileType = Profile
  export type NewProfileType = NewProfile
}
