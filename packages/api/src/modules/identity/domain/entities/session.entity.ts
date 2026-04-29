import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class SessionEntity extends AbstractEntity<SessionEntity> {
  declare public token: string
  declare public expiresAt: Date
  declare public ipAddress: string | null
  declare public userAgent: string | null

  declare public userId: string

  public constructor(props: AbstractEntity.EntityProps<SessionEntity>) {
    super({
      ipAddress: null,
      userAgent: null,
      ...props,
    })
  }
}
