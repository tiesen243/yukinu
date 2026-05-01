import type { Database } from '@yukinu/db/drizzle'

import { signIn } from '@yukinu/auth'

import type { SignInDto } from '@/modules/identity/application/dtos/auth/sign-in.dto'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class SignInUseCase extends AbstractUseCase<
  SignInDto.Input & { reqHeaders: Headers },
  SignInDto.Output
> {
  public constructor(private readonly _db: Database) {
    super()
  }

  public async execute({
    reqHeaders,
    ...input
  }: SignInDto.Input & { reqHeaders: Headers }): Promise<SignInDto.Output> {
    const ipAddress =
      reqHeaders.get('x-forwarded-for') ?? reqHeaders.get('x-real-ip') ?? null
    const userAgent = reqHeaders.get('user-agent') ?? null

    return await signIn(input, {
      ipAddress,
      userAgent,
    })
  }
}
