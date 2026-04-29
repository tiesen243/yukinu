import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'
import { Password } from '@yukinu/auth'
import { sendEmail } from '@yukinu/email'

import type { SignUpDto } from '@/modules/identity/application/dtos/auth/sign-up.dto'
import type { AccountRepository } from '@/modules/identity/domain/repositories/account.repository'
import type { ProfileRepository } from '@/modules/identity/domain/repositories/profile.repository'
import type { UserRepository } from '@/modules/identity/domain/repositories/user.repository'
import type { VerificationRepository } from '@/modules/identity/domain/repositories/verification.repository'

import { AccountEntity } from '@/modules/identity/domain/entities/account.entity'
import { ProfileEntity } from '@/modules/identity/domain/entities/profile.entity'
import { UserEntity } from '@/modules/identity/domain/entities/user.entity'
import { VerificationEntity } from '@/modules/identity/domain/entities/verification.entity'
import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class SignUpUseCase extends AbstractUseCase<
  SignUpDto.Input,
  SignUpDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _accountRepo: AccountRepository,
    private readonly _profileRepo: ProfileRepository,
    private readonly _userRepo: UserRepository,
    private readonly _verificationRepo: VerificationRepository,
  ) {
    super()
  }

  public async execute(input: SignUpDto.Input): Promise<SignUpDto.Output> {
    await this._checkExistingUser(input.email, input.username)

    const password = await new Password().hash(input.password)
    const result = await this._createUser({ ...input, password })

    const verificationLink = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/verify-email?token=${result.verificationToken}`
    await sendEmail({
      to: input.email,
      subject: 'Welcome to Yukinu!',
      template: 'Welcome',
      data: { username: input.username, verificationLink },
    })

    return result
  }

  private async _checkExistingUser(email: string, username: string) {
    const [user] = await this._userRepo.all(
      [{ email }, { username }],
      {},
      { limit: 1 },
    )
    if (user)
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Email or username already exists',
      })
  }

  private _createUser(input: SignUpDto.Input): Promise<SignUpDto.Output> {
    const { email, username, password } = input

    return this._db.transaction(async (tx) => {
      const newUser = new UserEntity({ email, username })
      await this._userRepo.save(newUser, tx)

      const newAccount = new AccountEntity({
        userId: newUser.id,
        provider: 'credentials',
        providerAccountId: newUser.id,
        password,
      })
      await this._accountRepo.save(newAccount, tx)

      const newProfile = new ProfileEntity({
        id: newUser.id,
        fullName: username,
      })
      await this._profileRepo.save(newProfile, tx)

      const verificationToken = this._generateVerificationToken()
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
      const newVerification = new VerificationEntity({
        userId: newUser.id,
        token: verificationToken,
        type: 'email',
        expiresAt,
      })
      await this._verificationRepo.save(newVerification, tx)

      return {
        userId: newUser.id,
        verificationToken,
      }
    })
  }

  private _generateVerificationToken(): string {
    const bytes = new Uint8Array(32)
    crypto.getRandomValues(bytes)
    return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
  }
}
