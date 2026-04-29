import type { Database } from '@yukinu/db/drizzle'

import { sendEmail } from '@yukinu/email'
import { randomBytes } from 'node:crypto'

import type { UserRepository } from '@/modules/identity/domain/repositories/user.repository'
import type { VerificationRepository } from '@/modules/identity/domain/repositories/verification.repository'
import type { ForgotPasswordDto } from '@/modules/identity/types'

import { VerificationEntity } from '@/modules/identity/domain/entities/verification.entity'
import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class ForgotPasswordUseCase extends AbstractUseCase<
  ForgotPasswordDto.Input,
  ForgotPasswordDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _userRepo: UserRepository,
    private readonly _verificationRepo: VerificationRepository,
  ) {
    super()
  }

  public async execute(
    input: ForgotPasswordDto.Input,
  ): Promise<ForgotPasswordDto.Output> {
    const { email } = input
    const [user] = await this._userRepo.all([{ email }], {}, { limit: 1 })
    if (!user?.username) return { id: '' }

    const { id, username } = user
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    const newVerification = new VerificationEntity({
      token,
      userId: id,
      type: 'password_reset',
      expiresAt,
    })
    await this._verificationRepo.save(newVerification)

    const resetLink = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/forgot-password/reset?token=${token}`
    await sendEmail({
      to: email,
      subject: 'Yukinu Password Reset',
      template: 'ResetPassword',
      data: { username, resetLink },
    })

    return { id }
  }
}
