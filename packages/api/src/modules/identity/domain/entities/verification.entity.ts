import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class VerificationEntity extends AbstractEntity<VerificationEntity> {
  declare public token: string
  declare public expiresAt: Date
  declare public type: string

  declare public userId: string
}
