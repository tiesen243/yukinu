import type { Database } from '@yukinu/db/drizzle'

import { signIn } from '@yukinu/auth'

import type { SignInDto } from '@/modules/identity/application/dtos/auth/sign-in.dto'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class SignInUseCase extends AbstractUseCase<
  SignInDto.Input,
  SignInDto.Output
> {
  public constructor(private readonly _db: Database) {
    super()
  }

  public async execute(input: SignInDto.Input): Promise<SignInDto.Output> {
    const result = await signIn(input)
    return result
  }
}
