import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class UserEntity extends AbstractEntity<UserEntity> {
  declare public username: string
  declare public email: string
  declare public emailVerified: Date | null
  declare public image: string | null
  declare public role: UserEntity.Role
  declare public status: UserEntity.Status
  declare public deletedAt: Date | null

  public constructor(
    props: AbstractEntity.EntityProps<UserEntity, 'role' | 'status'>,
  ) {
    super({
      emailVerified: null,
      image: null,
      role: 'user',
      status: 'active',
      deletedAt: null,
      ...props,
    })
  }
}

export namespace UserEntity {
  export const roles = [
    'user',
    'admin',
    'moderator',
    'vendor_owner',
    'vendor_staff',
  ] as const
  export type Role = (typeof roles)[number]

  export const statuses = ['active', 'inactive', 'banned'] as const
  export type Status = (typeof statuses)[number]
}
