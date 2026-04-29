import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class UserEntity extends AbstractEntity<UserEntity> {
  declare public username: string
  declare public email: string
  declare public emailVerified: Date | null
  declare public image: string | null
  declare public role: UserEntity.Role
  declare public status: UserEntity.Status
  declare public deletedAt: Date | null

  public constructor(props: AbstractEntity.EntityProps<UserEntity, 'role'>) {
    super({
      emailVerified: null,
      image: null,
      role: 'user',
      deletedAt: null,
      ...props,
    })
  }
}

export namespace UserEntity {
  export type Role =
    | 'user'
    | 'admin'
    | 'moderator'
    | 'vendor_owner'
    | 'vendor_staff'
  export type Status = 'active' | 'inactive' | 'banned'
}
