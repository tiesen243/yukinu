import { TRPCError } from '@trpc/server'
import type { Database } from '@yukinu/db/drizzle'

import type { DeleteSessionDto } from '@/modules/identity/application/dtos/security/delete-session.dto'
import type { SessionRepository } from '@/modules/identity/domain/repositories/session.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class DeleteSessionUseCase extends AbstractUseCase<
  DeleteSessionDto.Input,
  DeleteSessionDto.Output
> {
  constructor(
    private readonly _db: Database,
    private readonly _sessionRepo: SessionRepository,
  ) {
    super()
  }

  async execute(
    input: DeleteSessionDto.Input,
  ): Promise<DeleteSessionDto.Output> {
    const [session] = await this._sessionRepo.find(
      [{ id: input.id }],
      {},
      { limit: 1 },
    )
    if (!session)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Session not found.' })

    if (session.userId !== input.userId)
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You do not have permission to delete this session.',
      })

    await this._sessionRepo.delete([{ id: input.id }])
    return { id: session.id }
  }
}
