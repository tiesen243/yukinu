import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class ProfileEntity extends AbstractEntity<ProfileEntity> {
  declare public fullName: string | null
  declare public banner: string | null
  declare public bio: string | null
  declare public gender: string | null
  declare public dateOfBirth: Date | null

  public constructor(props: AbstractEntity.EntityProps<ProfileEntity>) {
    if (props.gender && !['male', 'female', 'other'].includes(props.gender))
      throw new Error('Invalid gender value')

    super({
      fullName: null,
      banner: null,
      bio: null,
      gender: null,
      dateOfBirth: null,
      ...props,
    })
  }
}
