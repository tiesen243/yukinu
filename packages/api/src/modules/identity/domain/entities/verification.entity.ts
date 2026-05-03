import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class VerificationEntity extends AbstractEntity<VerificationEntity> {
  declare public token: string
  declare public expiresAt: Date
  declare public type: string

  declare public userId: string

  public constructor(
    props: AbstractEntity.EntityProps<
      VerificationEntity,
      'token' | 'expiresAt'
    >,
  ) {
    const bytes = new Uint8Array(32)
    crypto.getRandomValues(bytes)

    super({
      token: [...bytes].map((b) => b.toString(16).padStart(2, '0')).join(''),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // Default to 15 minutes
      ...props,
    })
  }
}

export namespace VerificationEntity {
  export type WithUser = VerificationEntity & {
    user: { id: string; username: string; email: string }
  }
}
