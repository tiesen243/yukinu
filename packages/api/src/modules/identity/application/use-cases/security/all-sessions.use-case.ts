import type { AllSessionsDto } from '@/modules/identity/application/dtos/security/all-sessions.dto'
import type { SessionRepository } from '@/modules/identity/domain/repositories/session.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class AllSessionsUseCase extends AbstractUseCase<
  AllSessionsDto.Input,
  AllSessionsDto.Output
> {
  public constructor(private readonly _sessionRepo: SessionRepository) {
    super()
  }

  public execute(input: AllSessionsDto.Input): Promise<AllSessionsDto.Output> {
    return this._sessionRepo.find([{ userId: input.userId }])
  }
}
