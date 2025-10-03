import { TRPCError } from '@trpc/server'

import type { db } from '@yukinu/db'
import type { UserModel } from '@yukinu/validators/user'
import { Password } from '@yukinu/auth'
import { eq, or } from '@yukinu/db'
import { profiles } from '@yukinu/db/schemas/profile'
import { accounts, users } from '@yukinu/db/schemas/user'

export class UserService {
  private _password: Password

  constructor(private _db: typeof db) {
    this._password = new Password()
  }

  public async register(
    input: UserModel.RegisterBody,
  ): Promise<{ id: string }> {
    const hashedPassword = await this._password.hash(input.password)

    return this._db.transaction(async (tx) => {
      const [existing] = await tx
        .select({ id: users.id })
        .from(users)
        .where(
          or(eq(users.email, input.email), eq(users.username, input.username)),
        )
      if (existing) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User already exists',
        })
      }

      const [created] = await tx
        .insert(users)
        .values({
          email: input.email,
          username: input.username,
        })
        .returning({ id: users.id })
      if (!created)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create user',
        })

      await tx.insert(accounts).values({
        userId: created.id,
        provider: 'credentials',
        accountId: created.id,
        password: hashedPassword,
      })

      await tx.insert(profiles).values({
        userId: created.id,
      })

      return { id: created.id }
    })
  }
}
