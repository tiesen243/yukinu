import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class AccountEntity extends AbstractEntity<AccountEntity> {
  declare public provider: string
  declare public providerAccountId: string
  declare public password: string | null

  declare public userId: string

  public constructor(props: AbstractEntity.EntityProps<AccountEntity>) {
    super({
      password: null,
      ...props,
    })
  }
}
